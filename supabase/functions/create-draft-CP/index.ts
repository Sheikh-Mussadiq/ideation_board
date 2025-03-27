// Just create a new function in the prod. Supabase and paste this code. (working locally)!
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};
const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

const FOUR_YEARS = 60 * 60 * 24 * 365 * 4;

async function getLongTermSignedUrl(storagePath = "") {
  const { data, error } = await supabase.storage
    .from("ideation_media")
    .createSignedUrl(storagePath, FOUR_YEARS);

  if (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

async function processAttachments(attachments = [{ type: "file", storagePath: "", name: "", size: 0 }]) {
  const processedAttachments = [];

  for (const attachment of attachments) {
    if (attachment.type === "file") {
      const signedUrl = await getLongTermSignedUrl(attachment.storagePath);
      if (signedUrl) {
        processedAttachments.push({
          url: signedUrl,
          filename: attachment.name,
          size: attachment.size,
        });
      }
    }
  }

  return processedAttachments;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { attachments, description, title, userId, userName, channelIds, accountId } = await req.json();

    const { data: tokenData, error: tokenError } = await supabase
      .from("automation_access_tokens")
      .select("token")
      .eq("account_id", accountId)
      .single();

    if (tokenError || !tokenData) {
      console.error("Error fetching automation token:", tokenError);
      return new Response(JSON.stringify({ success: false, message: "Failed to fetch automation token" }), { headers: corsHeaders, status: 500 } );
    }

    const processedAttachments = await processAttachments(attachments);
    const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, "");

    const requestBody = {
      channelIds: channelIds,
      publishTime: new Date().toISOString(),
      content: {
        text: cleanDescription,
        title: title,
        images: processedAttachments.filter((a) => a.filename && a.filename.match(/\.(jpg|jpeg|png|gif)$/i)) || [],
        videos: processedAttachments.filter((a) => a.filename && a.filename.match(/\.(mp4|mov|avi)$/i)) || [],
      },
      authorId: userId,
      actor: userName,
    };

    // console.log("Sending data to SocialHub API...", requestBody);
    const response = await fetch(`https://automation-api.socialhub.io/cp/posts?accesstoken=${tokenData.token}`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    // console.log("Response from SocialHub API:", result);
    return new Response(JSON.stringify({ success: true, result }), { headers: corsHeaders, status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ success: false, message: "An error occurred" }), { headers: corsHeaders, status: 500 });
  }
});
