import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";
import { loginSchema } from "@/utils/auth/validators";
import useAuthStore from "@/store/auth/authStore";

export const useLogin = () => {
  const router = useRouter();
  const { login: setLogin, setLoading, setError } = useAuthStore();
  const [validationErrors, setValidationErrors] = useState({});

  const login = async (formData) => {
    // Reset errors
    setValidationErrors({});
    setError(null);

    // Validation with Zod
    try {
      loginSchema.parse(formData);
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      showErrorToast("Please fill out the form carefully");
      return { success: false };
    }

    // Start Loading
    setLoading(true);
    const toastId = showLoadingToast("Logging in...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Success
      showSuccessToast("Login successful");

      // Save user in Store
      setLogin(data.user);

      // Remember me
      if (formData.rememberMe) {
        localStorage.setItem("userEmail", formData.email);
      } else {
        localStorage.removeItem("userEmail");
      }

      // Redirect to home
      setTimeout(() => {
        router.push("/home");
      }, 1500);

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