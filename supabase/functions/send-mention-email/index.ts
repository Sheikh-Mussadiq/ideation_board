// Just create a new function in the prod. Supabase and paste this code. (working locally)!

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

interface User {
  email: string;
  email_notifications: boolean;
}
const updateMentionedUsersWithPreferences = async (mentionedUsers: any[]) => {
  const userIds = mentionedUsers.map(user => user.id);
  const { data: preferences, error } = await supabase
    .from("users")
    .select("user_id, email_notifications")
    .in("user_id", userIds);

  if (error) throw error;

  const preferencesMap = preferences.reduce((acc: any, pref) => {
    acc[pref.user_id] = pref.email_notifications;
    return acc;
  }, {});

  return mentionedUsers.map(user => ({
    ...user,
    email_notifications: preferencesMap[String(user.id)] ?? true,
  }));
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mentionedUsers, currentUserName, cardTitle, boardId, comment } = body;

    // Filter users with email notifications
    const updatedUsers = await updateMentionedUsersWithPreferences(mentionedUsers);
    const recipients = updatedUsers
  .filter((user: User) => user.email_notifications)
  .map((user: User) => ({ Email: user.email }));

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No users to notify via email." }),
        { headers: corsHeaders, status: 200 }
      );
    }

    // Send email via Mailjet
    const auth = btoa(`${Deno.env.get('MJ_APIKEY_PUBLIC')}:${Deno.env.get('MJ_APIKEY_PRIVATE')}`);
    const mailjetResponse = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        Messages: [{
          From: { Email: "no-replyy@socialhub.io", Name: "Ideaboard Notification" },
          To: recipients,
          Subject: "You were mentioned in a comment",
          HTMLPart: `
             <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #F0EEFF; border-radius: 10px; max-width: 600px; margin: auto;">
        <h2 style="color: #6D28D9;">You were mentioned in a comment</h2>
        <p style="color: #333; font-size: 16px;">
          <strong>${currentUserName}</strong> mentioned you in a comment at <strong> ${cardTitle}</strong>:
        </p>
        <blockquote style="font-style: italic; background: #fff; padding: 10px; border-left: 4px solid #6D28D9;">${comment}</blockquote>
        <p style="margin-top: 20px;"><a href="https://app.socialhub.io/prototype/ideaboard/#/ideation/${boardId}" style="background-color: #6D28D9; color: #FFFFFF; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">Check it out here</a></p>
      </div>
          `
        }]
      })
    });

    if (!mailjetResponse.ok) throw new Error(await mailjetResponse.text());

    return new Response(
      JSON.stringify({ success: true }),
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Email sending failed", error: error instanceof Error ? error.message : String(error)  }),
      { headers: corsHeaders, status: 500 }
    );
  }
});