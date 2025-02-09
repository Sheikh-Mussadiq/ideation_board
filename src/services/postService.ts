import { API_CONFIG } from '../config';

interface SocialHubResponse {
  id: string;
  url?: string;
  postId?: string;
}

export async function createSocialHubPost(title: string, text: string): Promise<SocialHubResponse> {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log
    
    // Construct the correct URL format
    const postUrl = `https://app.socialhub.io/cp2/publisher/edit/${data.id}?selectedPostId=${data.postId || data.id}`;
    
    return {
      id: data.id,
      url: postUrl
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updateSocialHubPost(postId: string, title: string, text: string): Promise<SocialHubResponse> {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update post');
    }

    const data = await response.json();
    const postUrl = `https://app.socialhub.io/cp2/publisher/edit/${data.id}?selectedPostId=${data.postId || data.id}`;

    return {
      id: data.id,
      url: postUrl
    };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}