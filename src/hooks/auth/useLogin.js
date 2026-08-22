import { useState } from "react";
import { useSearchParams } from "next/navigation";
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

      if (formData.rememberMe) {
        localStorage.setItem("userEmail", formData.email);
      } else {
        localStorage.removeItem("userEmail");
      }

      /**
       * The password was correct but no session exists yet. The caller shows
       * the code step; redirecting here would land on a protected page with
       * no auth cookies.
       */
      if (data.requiresTwoFactor) {
        return { success: true, requiresTwoFactor: true };
      }

      /**
 * The organization requires two-step verification and this account has
 * none. The caller sends them to the enrolment step.
 */
      if (data.requiresTwoFactorSetup) {
        return { success: true, requiresTwoFactorSetup: true };
      }

      showSuccessToast("Login successful! Redirecting...");
      setLogin(data.user);

      const redirectTo = getSafeRedirect(searchParams.get("redirect"));

      /**
       * A full document navigation instead of router.push().
       *
       * router.refresh() right after router.push() invalidated the RSC cache
       * mid-navigation and intermittently cancelled it. A hard navigation also
       * guarantees the freshly set cookies ride along on the first request to
       * the protected route.
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