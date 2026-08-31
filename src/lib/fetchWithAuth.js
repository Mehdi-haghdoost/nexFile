// /**
//  * Module-level refresh lock.
//  *
//  * Every caller in the app must go through refreshAccessToken() so that only one
//  * network refresh is ever in flight. Concurrent callers await the same promise
//  * instead of each burning the refresh token, which previously logged the user
//  * out at random.
//  */
// let refreshPromise = null;

// const redirectToLogin = () => {
//   if (typeof window !== "undefined") {
//     window.location.href = "/login-register";
//   }
// };

// /**
//  * Refresh the access token, deduplicated across the whole application.
//  * Exported so hooks (useAuth) share the same lock as fetchWithAuth.
//  *
//  * @returns {Promise<object>} the refreshed session payload
//  */
// export const refreshAccessToken = () => {
//   if (refreshPromise) {
//     return refreshPromise;
//   }

//   refreshPromise = fetch("/api/auth/refresh", {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//   })
//     .then(async (response) => {
//       if (!response.ok) {
//         const error = new Error("Token refresh failed");
//         error.status = response.status;
//         throw error;
//       }
//       return response.json();
//     })
//     .finally(() => {
//       // Released on the next tick so callers that resolve synchronously still
//       // observe the shared promise rather than starting a second refresh.
//       refreshPromise = null;
//     });

//   return refreshPromise;
// };

// export const fetchWithAuth = async (url, options = {}) => {
//   const { headers: callerHeaders, _retry, ...restOptions } = options;

//   // Merge headers explicitly. Spreading `options` over defaults would replace
//   // the whole headers object and silently drop Content-Type.
//   const buildOptions = () => ({
//     credentials: "include",
//     ...restOptions,
//     headers: {
//       "Content-Type": "application/json",
//       // Marks every request as an in-page AJAX call. Download managers like
//       // IDM hook the browser's network layer and grab any response whose
//       // headers look like a file (application/pdf, a Content-Disposition
//       // filename, etc.), racing our own fetch() and leaving it with a
//       // truncated or empty body. This header is IDM's documented opt-out
//       // signal, so binary responses like the PDF proxy actually reach the
//       // page instead of being hijacked.
//       "X-Requested-With": "XMLHttpRequest",
//       ...callerHeaders,
//     },
//   });

//   let response = await fetch(url, buildOptions());

//   if (response.status !== 401 || _retry) {
//     return response;
//   }

//   try {
//     await refreshAccessToken();
//   } catch {
//     redirectToLogin();
//     throw new Error("Session expired");
//   }

//   // Retry once with the rotated cookies now in place.
//   response = await fetch(url, buildOptions());

//   if (response.status === 401) {
//     redirectToLogin();
//     throw new Error("Session expired");
//   }

//   return response;
// };

// export const api = {
//   get: (url, options = {}) => fetchWithAuth(url, { ...options, method: "GET" }),

//   post: (url, data, options = {}) =>
//     fetchWithAuth(url, {
//       ...options,
//       method: "POST",
//       body: JSON.stringify(data),
//     }),

//   put: (url, data, options = {}) =>
//     fetchWithAuth(url, {
//       ...options,
//       method: "PUT",
//       body: JSON.stringify(data),
//     }),

//   patch: (url, data, options = {}) =>
//     fetchWithAuth(url, {
//       ...options,
//       method: "PATCH",
//       body: JSON.stringify(data),
//     }),

//   delete: (url, options = {}) =>
//     fetchWithAuth(url, { ...options, method: "DELETE" }),

//   upload: (url, formData, options = {}) => {
//     const { headers = {}, ...restOptions } = options;

//     // The browser must set the multipart boundary itself.
//     const uploadHeaders = { ...headers };
//     delete uploadHeaders["Content-Type"];

//     return fetchWithAuth(url, {
//       ...restOptions,
//       method: "POST",
//       headers: { ...uploadHeaders, "Content-Type": undefined },
//       body: formData,
//     });
//   },
// };

let refreshPromise = null;

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login-register";
  }
};

// Shared across the whole app so concurrent 401s trigger one refresh call, not one per request.
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
      refreshPromise = null;
    });

  return refreshPromise;
};

export const fetchWithAuth = async (url, options = {}) => {
  const { headers: callerHeaders, _retry, ...restOptions } = options;

  const buildOptions = () => {
    // FormData needs the browser to set its own multipart boundary; a
    // Content-Type header of any kind here (including one set to
    // "undefined") stops that auto-detection from kicking in.
    const isFormData = restOptions.body instanceof FormData;

    return {
      credentials: "include",
      ...restOptions,
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        "X-Requested-With": "XMLHttpRequest",
        ...callerHeaders,
      },
    };
  };

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

    // Left unset entirely rather than nulled out, so buildOptions' FormData check applies.
    const uploadHeaders = { ...headers };
    delete uploadHeaders["Content-Type"];

    return fetchWithAuth(url, {
      ...restOptions,
      method: "POST",
      headers: uploadHeaders,
      body: formData,
    });
  },
};