"use client";
import { useState } from "react";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "@/lib/toast";
import { resetPasswordSchema } from "@/utils/auth/validators";

export const useResetPassword = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (formData) => {
    setValidationErrors({});

    try {
      resetPasswordSchema.parse(formData);
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

    setIsLoading(true);
    const toastId = showLoadingToast("Resetting password...");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      dismissToast(toastId);

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      showSuccessToast("Password reset successful!");

      return { success: true, data };
    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "Failed to reset password";
      showErrorToast(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    validationErrors,
    isLoading,
  };
};