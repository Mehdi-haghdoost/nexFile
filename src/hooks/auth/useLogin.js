// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   showSuccessToast,
//   showErrorToast,
//   showLoadingToast,
//   dismissToast,
// } from "@/lib/toast";
// import { loginSchema } from "@/utils/auth/validators";
// import useAuthStore from "@/store/auth/authStore";

// export const useLogin = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { login: setLogin, setLoading, setError } = useAuthStore();
//   const [validationErrors, setValidationErrors] = useState({});

//   const login = async (formData) => {
//     setValidationErrors({});
//     setError(null);

//     try {
//       loginSchema.parse(formData);
//     } catch (error) {
//       const errors = {};
      
//       if (error.errors && Array.isArray(error.errors)) {
//         error.errors.forEach((err) => {
//           errors[err.path[0]] = err.message;
//         });
//       }
      
//       setValidationErrors(errors);
//       return { success: false, errors };
//     }

//     setLoading(true);
//     const toastId = showLoadingToast("Logging in...");

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       dismissToast(toastId);

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       showSuccessToast("Login successful! Redirecting...");

//       setLogin(data.user);

//       if (formData.rememberMe) {
//         localStorage.setItem("userEmail", formData.email);
//       } else {
//         localStorage.removeItem("userEmail");
//       }

//       const redirectTo = searchParams.get("redirect") || "/home";

//       // Immediate redirect without setTimeout
//       router.push(redirectTo);
//       router.refresh();

//       return { success: true, data };
//     } catch (error) {
//       dismissToast(toastId);
//       const errorMessage = error.message || "Login failed";
//       setError(errorMessage);
//       showErrorToast(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     login,
//     validationErrors,
//     isLoading: useAuthStore((state) => state.isLoading),
//     error: useAuthStore((state) => state.error),
//   };
// };

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";
import { loginSchema } from "@/utils/auth/validators";
import useAuthStore from "@/store/auth/authStore";

/**
 * Only allow redirects to same-origin paths. Without this check a crafted
 * ?redirect=https://evil.com would turn the login page into an open redirect.
 */
const getSafeRedirect = (value, fallback = "/home") => {
  if (!value) return fallback;
  // Must start with a single slash: "//evil.com" is protocol-relative.
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
};

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: setLogin, setLoading, setError } = useAuthStore();
  const [validationErrors, setValidationErrors] = useState({});

  const login = async (formData) => {
    setValidationErrors({});
    setError(null);

    try {
      loginSchema.parse(formData);
    } catch (error) {
      const errors = {};

      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
      }

      setValidationErrors(errors);
      return { success: false, errors };
    }

    setLoading(true);
    const toastId = showLoadingToast("Logging in...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      dismissToast(toastId);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      showSuccessToast("Login successful! Redirecting...");

      setLogin(data.user);

      if (formData.rememberMe) {
        localStorage.setItem("userEmail", formData.email);
      } else {
        localStorage.removeItem("userEmail");
      }

      const redirectTo = getSafeRedirect(searchParams.get("redirect"));

      /**
       * A full document navigation instead of router.push().
       *
       * Two reasons:
       * 1. router.push() followed by router.refresh() races: refresh
       *    invalidates the RSC cache while the navigation is still in flight,
       *    which intermittently cancels it and leaves the user on the login page.
       * 2. The auth cookies were only just set by this response. A hard
       *    navigation guarantees the very first request to the protected route
       *    already carries them, so middleware sees a valid session on the
       *    first try rather than after a refresh round-trip.
       *
       * replace() is used so the login page is not left in the history stack.
       */
      window.location.replace(redirectTo);

      return { success: true, data };
    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "Login failed";
      setError(errorMessage);
      showErrorToast(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    validationErrors,
    isLoading: useAuthStore((state) => state.isLoading),
    error: useAuthStore((state) => state.error),
  };
};