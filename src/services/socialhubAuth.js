import { API_CONFIG } from '../config';

export async function loginToSocialHub(username, password) {
  try {
    const response = await fetch(`${API_CONFIG.SOCIALHUB_API_URL}/users/login`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SocialHub API error:', errorData);
      throw new Error(JSON.stringify(errorData));
    }

    // Extract access token from cookies
    const cookies = response.headers.get('set-cookie');
    if (!cookies) {
      throw new Error('No authentication cookies received');
    }

    const accessToken = cookies
      .split(';')
      .find(cookie => cookie.trim().startsWith('accesstoken='))
      ?.split('=')[1];

    if (!accessToken) {
      throw new Error('Access token not found in cookies');
    }

    return { accessToken };
  } catch (error) {
    console.error('SocialHub login error:', error);
    throw error;
  }
}