import toast from 'react-hot-toast';
import { API_CONFIG } from '../config';

export async function loginToSocialHub(username, password) {


  try {
    const response = await fetch('http://localhost:5000/api/user/loginSocialHub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
  console.log("from social hub auth: ", response);
    if (!response.ok) {
      // Handle non-200 responses
      const errorData = await response.json();
      console.error('SocialHub API error:', errorData);
      throw new Error(errorData.message || 'Login failed');
    }
  
    // Parse the response body
    const data = await response.json();

    // Store the access token in localStorage
    if (data.accessToken) {
      localStorage.setItem('cookies', data.cookies);
      localStorage.setItem('accessToken', data.accessToken);
    } else {
      throw new Error('Access token not found in response');
    }
  
    return data; // Return the data
  } catch (error) {
    toast.error('Login failed');
    console.error('SocialHub login error:', error);
    throw error;
  }

  // try {
  //   const response = await fetch(`${API_CONFIG.SOCIALHUB_API_URL}/users/login`, {
  //     method: 'POST',
  //     headers: API_CONFIG.HEADERS,
  //     credentials: 'include',
  //     body: JSON.stringify({ username, password })
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     console.error('SocialHub API error:', errorData);
  //     throw new Error(JSON.stringify(errorData));
  //   }

  //   // Extract access token from cookies
  //   const cookies = response.headers.get('set-cookie');
  //   if (!cookies) {
  //     throw new Error('No authentication cookies received');
  //   }

  //   const accessToken = cookies
  //     .split(';')
  //     .find(cookie => cookie.trim().startsWith('accesstoken='))
  //     ?.split('=')[1];

  //   if (!accessToken) {
  //     throw new Error('Access token not found in cookies');
  //   }

  //   return { accessToken };
  // } catch (error) {
  //   console.error('SocialHub login error:', error);
  //   throw error;
  // }
  
}