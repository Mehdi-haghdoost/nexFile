import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";
import { registerSchemaFrontend } from "@/utils/auth/validators";
import useAuthStore from "@/store/auth/authStore";

export const useRegister = () => {
  const router = useRouter();
  const { setUser, setLoading, setError } = useAuthStore();
  const [validationErrors, setValidationErrors] = useState({});

  const register = async (formData) => {
    // Reset errors
    setValidationErrors({});
    setError(null);

    // Validation with Zod
    try {
      registerSchemaFrontend.parse(formData);
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      showErrorToast("Please fill out the form carefully");
      return { success: false };
    }

    // Confirm with user
    const result = await Swal.fire({
      title: "Registration",
      text: "Are you sure the information is correct?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, register",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return { success: false };
    }

    // Start Loading
    setLoading(true);
    const toastId = showLoadingToast("Registering...");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      dismissToast(toastId);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success
      showSuccessToast("Registration successful");

      // Save user in Store
      setUser(data.user);

      // Redirect to login
      setTimeout(() => {
        router.push("/login-register?step=login");
      }, 1500);

      return { success: true, data };
    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "Registration failed";
      setError(errorMessage);
      showErrorToast(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    validationErrors,
    isLoading: useAuthStore((state) => state.isLoading),
    error: useAuthStore((state) => state.error),
  };
};