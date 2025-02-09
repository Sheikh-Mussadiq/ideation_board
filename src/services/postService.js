import { API_CONFIG } from '../config';

const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  if (!response.ok) {
    const errorData = isJson ? await response.json() : { message: response.statusText };
    throw new Error(errorData.message || `Failed with status ${response.status}`);
  }

  return isJson ? response.json() : null;
};

export async function createSocialHubPost(title, text) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}?accesstoken=${API_CONFIG.ACCESS_TOKEN}`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({
        channelIds: ['656ef10f4695b4a5851a9452'],
        publishTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Schedule for tomorrow
        content: {
          text,
          title,
          type: 'POST'
        },
        authorId: '5620ec175a5c8da16a01e2d2',
        actor: 'System'
      })
    });

    const data = await handleApiResponse(response);
    
    // Construct the correct URL format
    const postUrl = `https://app.socialhub.io/cp2/publisher/edit/${data.id}?selectedPostId=${data.postId || data.id}`;
    
    return {
      id: data.id,
      url: postUrl
    };
  } catch (error) {
    console.error('Error creating SocialHub post:', error.message);
    throw error;
  }
}

export async function updateSocialHubPost(postId, title, text) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${postId}?accesstoken=${API_CONFIG.ACCESS_TOKEN}`, {
      method: 'PUT',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({
        content: {
          text,
          title,
          type: 'POST'
        }
      })
    });

    const data = await handleApiResponse(response);
    const postUrl = `https://app.socialhub.io/cp2/publisher/edit/${data.id}?selectedPostId=${data.postId || data.id}`;

    return {
      id: data.id,
      url: postUrl
    };
  } catch (error) {
    console.error('Error updating SocialHub post:', error.message);
    throw error;
  }
}