import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';

const getMaloonAccessToken = () => {
  const cookies = document.cookie
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, val]) => {
      acc[key] = val;
      return acc;
    }, {});

  return cookies['accesstoken'];
};

// Create a fetch interceptor
const createProxyFetch = (originalFetch) => {
  return async (url, options = {}) => {
    try {
      const originalUrl = new URL(url);

      // Only intercept Supabase REST and Auth API calls
      if (!originalUrl.pathname.includes('/rest/v1/') && !originalUrl.pathname.includes('/auth/v1/')) {
        return originalFetch(url, options);
      }

      // Get the access token
      const maloonAccessToken = getMaloonAccessToken();

      // Keep original query parameters
      const queryParams = originalUrl.search.substring(1); // remove leading '?'

      // Construct proxy URL
      const proxyUrl = `${import.meta.env.VITE_SOCIALHUB_API_URL}/api2/sb-proxy${originalUrl.pathname}${queryParams ? '?' + queryParams : ''}${queryParams ? '&' : '?'}accesstoken=${maloonAccessToken}`;

      console.log('Proxying request:', {
        to: proxyUrl
      });

      // Make the request through proxy
      return originalFetch(proxyUrl, {
        ...options,
        credentials: 'include',
      });
    } catch (error) {
      console.error('Proxy fetch error:', error);
      throw error;
    }
  };
};

// Create a proxied Supabase client
export const createSupabaseProxy = (supabaseClient) => {

  // Replace the global fetch in the client's config
  supabaseClient.rest.headers = {
    ...supabaseClient.rest.headers,
    'X-Client-Info': 'supabase-js-proxy'
  };
  supabaseClient.auth.headers = {
    ...supabaseClient.auth.headers,
    'X-Client-Info': 'supabase-js-proxy'
  };

  // Override the fetch method in the client's config
  supabaseClient.rest.fetch = createProxyFetch(fetch);
  supabaseClient.auth.fetch = createProxyFetch(fetch);

  return supabaseClient;
};

// Create a proxied Supabase client
export const createProxiedSupabaseClient = () => {

  return createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: createProxyFetch(SUPABASE_CONFIG.url)
    }
  })
}

// Export a singleton instance
export const supabase = createProxiedSupabaseClient()