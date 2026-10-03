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