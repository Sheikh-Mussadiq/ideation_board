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


Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { sharedUsers, currentUserName, boardTitle, boardId  } = body;

    const { data: users, error } = await supabase
        .from("users")
        .select("user_id, email, email_notifications")
        .in("user_id", sharedUsers);
    
      if (error) {
        console.error("Error fetching user emails and preferences:", error);
        throw new Error("Failed to fetch users.");
      }
    // Filter users with email notifications
    const recipients = users
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
          Subject: "A new Board has been shared with you! Check it out",
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #F0EEFF; border-radius: 10px; max-width: 600px; margin: auto;">
  <h2 style="color: #6D28D9;">A board has been shared with you!</h2>
  <p style="color: #333; font-size: 16px;">
    <strong>${currentUserName}</strong> has shared the board <strong>${boardTitle}</strong> with you.
  </p>
  <p style="color: #555; font-size: 14px;">Click the button below to access the board:</p>
  <p style="margin-top: 20px; text-align: center;">
    <a href="https://app.socialhub.io/prototype/ideaboard/#/ideation/${boardId}" 
       style="background-color: #6D28D9; color: #FFFFFF; padding: 12px 18px; border-radius: 5px; 
              text-decoration: none; font-weight: bold; display: inline-block;">
      View Board
    </a>
  </p>
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