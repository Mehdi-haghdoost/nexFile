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

      setTimeout(() => {
        router.push("/home");
      }, 2000);

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