let isRefreshing = false;
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      return response.json();
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

export const fetchWithAuth = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    let response = await fetch(url, finalOptions);

    if (response.status === 401 && !options._retry) {
      try {
        await refreshAccessToken();
        
        finalOptions._retry = true;
        response = await fetch(url, finalOptions);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login-register';
        }
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const api = {
  get: async (url, options = {}) => {
    return fetchWithAuth(url, {
      ...options,
      method: 'GET',
    });
  },

  post: async (url, data, options = {}) => {
    return fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: async (url, data, options = {}) => {
    return fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (url, options = {}) => {
    return fetchWithAuth(url, {
      ...options,
      method: 'DELETE',
    });
  },

  // For FormData uploads
  upload: async (url, formData, options = {}) => {
    const { headers = {}, ...restOptions } = options;
    
    // Remove Content-Type header for FormData
    const uploadHeaders = { ...headers };
    delete uploadHeaders['Content-Type'];
    
    return fetchWithAuth(url, {
      ...restOptions,
      method: 'POST',
      headers: uploadHeaders,
      body: formData,
    });
  },
};