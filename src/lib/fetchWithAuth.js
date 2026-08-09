// let isRefreshing = false;
// let refreshPromise = null;

// const refreshAccessToken = async () => {
//   if (isRefreshing && refreshPromise) {
//     return refreshPromise;
//   }

//   isRefreshing = true;

//   refreshPromise = fetch('/api/auth/refresh', {
//     method: 'POST',
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(async (response) => {
//       if (!response.ok) {
//         throw new Error('Token refresh failed');
//       }
//       return response.json();
//     })
//     .catch((error) => {
//       throw error;
//     })
//     .finally(() => {
//       isRefreshing = false;
//       refreshPromise = null;
//     });

//   return refreshPromise;
// };

// export const fetchWithAuth = async (url, options = {}) => {
//   const defaultOptions = {
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   };

//   const finalOptions = { ...defaultOptions, ...options };

//   try {
//     let response = await fetch(url, finalOptions);

//     if (response.status === 401 && !finalOptions._retry) {
//       try {
//         await refreshAccessToken();
        
//         finalOptions._retry = true;
//         response = await fetch(url, finalOptions);
        
//         if (response.status === 401) {
//           if (typeof window !== 'undefined') {
//             window.location.href = '/login-register';
//           }
//           throw new Error('Session expired');
//         }
//       } catch (refreshError) {
//         if (typeof window !== 'undefined') {
//           window.location.href = '/login-register';
//         }
//         throw new Error('Session expired');
//       }
//     }

//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const api = {
//   get: async (url, options = {}) => {
//     const response = await fetchWithAuth(url, {
//       ...options,
//       method: 'GET',
//     });
//     return response;
//   },

//   post: async (url, data, options = {}) => {
//     const response = await fetchWithAuth(url, {
//       ...options,
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//     return response;
//   },

//   put: async (url, data, options = {}) => {
//     const response = await fetchWithAuth(url, {
//       ...options,
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//     return response;
//   },

//   patch: async (url, data, options = {}) => {
//     const response = await fetchWithAuth(url, {
//       ...options,
//       method: 'PATCH',
//       body: JSON.stringify(data),
//     });
//     return response;
//   },

//   delete: async (url, options = {}) => {
//     const response = await fetchWithAuth(url, {
//       ...options,
//       method: 'DELETE',
//     });
//     return response;
//   },

//   upload: async (url, formData, options = {}) => {
//     const { headers = {}, ...restOptions } = options;
    
//     const uploadHeaders = { ...headers };
//     delete uploadHeaders['Content-Type'];
    
//     const response = await fetchWithAuth(url, {
//       ...restOptions,
//       method: 'POST',
//       headers: uploadHeaders,
//       body: formData,
//     });
    
//     return response;
//   },
// };

/**
 * Module-level refresh lock.
 *
 * Every caller in the app must go through refreshAccessToken() so that only one
 * network refresh is ever in flight. Concurrent callers await the same promise
 * instead of each burning the refresh token, which previously logged the user
 * out at random.
 */
let refreshPromise = null;

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login-register";
  }
};

/**
 * Refresh the access token, deduplicated across the whole application.
 * Exported so hooks (useAuth) share the same lock as fetchWithAuth.
 *
 * @returns {Promise<object>} the refreshed session payload
 */
export const refreshAccessToken = () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = new Error("Token refresh failed");
        error.status = response.status;
        throw error;
      }
      return response.json();
    })
    .finally(() => {
      // Released on the next tick so callers that resolve synchronously still
      // observe the shared promise rather than starting a second refresh.
      refreshPromise = null;
    });

  return refreshPromise;
};

export const fetchWithAuth = async (url, options = {}) => {
  const { headers: callerHeaders, _retry, ...restOptions } = options;

  // Merge headers explicitly. Spreading `options` over defaults would replace
  // the whole headers object and silently drop Content-Type.
  const buildOptions = () => ({
    credentials: "include",
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...callerHeaders,
    },
  });

  let response = await fetch(url, buildOptions());

  if (response.status !== 401 || _retry) {
    return response;
  }

  try {
    await refreshAccessToken();
  } catch {
    redirectToLogin();
    throw new Error("Session expired");
  }

  // Retry once with the rotated cookies now in place.
  response = await fetch(url, buildOptions());

  if (response.status === 401) {
    redirectToLogin();
    throw new Error("Session expired");
  }

  return response;
};

export const api = {
  get: (url, options = {}) => fetchWithAuth(url, { ...options, method: "GET" }),

  post: (url, data, options = {}) =>
    fetchWithAuth(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (url, data, options = {}) =>
    fetchWithAuth(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: (url, data, options = {}) =>
    fetchWithAuth(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (url, options = {}) =>
    fetchWithAuth(url, { ...options, method: "DELETE" }),

  upload: (url, formData, options = {}) => {
    const { headers = {}, ...restOptions } = options;

    // The browser must set the multipart boundary itself.
    const uploadHeaders = { ...headers };
    delete uploadHeaders["Content-Type"];

    return fetchWithAuth(url, {
      ...restOptions,
      method: "POST",
      headers: { ...uploadHeaders, "Content-Type": undefined },
      body: formData,
    });
  },
};