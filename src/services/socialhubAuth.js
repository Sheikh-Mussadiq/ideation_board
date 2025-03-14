// Example: socialHubService.js (frontend)
export async function fetchSocialHubDataAndCallBackend() {
  // 1) Parse cookies from document.cookie (if needed)
  //    If your domain and SocialHub domain are the same or properly set for cross-domain,
  //    simply using 'credentials: "include"' in fetch calls should automatically send them.
  const cookies = document.cookie
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {});

  const maloonAccessToken = cookies['accesstoken'];

  if (!maloonAccessToken) {
    throw new Error("Missing 'accesstoken' or 'hidden_accesstoken' cookies");
  }

  // 2) Call the 3 SocialHub endpoints from the frontend.
  //    We append the accesstoken in the query param (like your original code),
  //    and set 'credentials: "include"' to send cookies automatically.
  // --- a) User Info ---

  const userInfoRes = await fetch(
    `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/sb-auth?accesstoken=${maloonAccessToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addon: import.meta.env.VITE_ADDON_NAME
      }),
      credentials: "include",
    }
  );

  console.log('userInfoRes : ', userInfoRes);
  if (!userInfoRes.ok) {
    throw new Error("Failed to fetch user info from SocialHub");
  }
  const userInfoData = await userInfoRes.json();
  console.log('userInfoData : ', userInfoData);

  // --- b) Team Info ---
  const teamInfoRes = await fetch(
    `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/teams?accesstoken=${maloonAccessToken}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    }
  );

  if (!teamInfoRes.ok) {
    throw new Error("Failed to fetch team info from SocialHub");
  }
  const teamInfoData = await teamInfoRes.json();

  // --- c) User Users Info ---
  const userUsersInfoRes = await fetch(
    `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/users?accesstoken=${maloonAccessToken}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    }
  );
  if (!userUsersInfoRes.ok) {
    throw new Error("Failed to fetch user-users info from SocialHub");
  }
  const userUsersInfoData = await userUsersInfoRes.json();

  // --- d) User Channels Info ---
  const userChannelsInfoRes = await fetch(
    `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/channels?accesstoken=${maloonAccessToken}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    }
  );
  if (!userChannelsInfoRes.ok) {
    throw new Error("Failed to fetch user-channels info from SocialHub");
  }

  const userChannelsInfoData = await userChannelsInfoRes.json();

  // 3) After you have all 3 sets of data from SocialHub,
  //    send them to your backend route that now only deals with Supabase logic.
 /* const supabaseRes = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/generateJWT`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInfoData,
      teamInfoData,
    }),
    credentials: 'include'
  });

  if (!supabaseRes.ok) {
    throw new Error("Failed to generate JWT in the backend");
  }

  // 4) Get the final data (including your newly created token, user info, etc.)
  const supabaseData = await supabaseRes.json();
*/

  return {
    userInfo: userInfoData,
    userTeams: teamInfoData,
    userUsers: userUsersInfoData,
    userChannels: userChannelsInfoData
  };
}
