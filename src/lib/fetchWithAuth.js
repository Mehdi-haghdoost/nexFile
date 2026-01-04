let isRefreshing = false;
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
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

    if (response.status === 401 && !finalOptions._retry) {
      try {
        await refreshAccessToken();
        
        finalOptions._retry = true;
        response = await fetch(url, finalOptions);
        
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login-register';
          }
          throw new Error('Session expired');
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login-register';
        }
        throw new Error('Session expired');
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const api = {
  get: async (url, options = {}) => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'GET',
    });
    return response;
  },

  post: async (url, data, options = {}) => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  put: async (url, data, options = {}) => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },

  patch: async (url, data, options = {}) => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (url, options = {}) => {
    const response = await fetchWithAuth(url, {
      ...options,
      method: 'DELETE',
    });
    return response;
  },

  upload: async (url, formData, options = {}) => {
    const { headers = {}, ...restOptions } = options;
    
    const uploadHeaders = { ...headers };
    delete uploadHeaders['Content-Type'];
    
    const response = await fetchWithAuth(url, {
      ...restOptions,
      method: 'POST',
      headers: uploadHeaders,
      body: formData,
    });
    
    return response;
  },
};