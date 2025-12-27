"use client";
import { useState } from "react";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "@/lib/toast";
import { forgetPasswordSchema } from "@/utils/auth/validators";

export const useForgetPassword = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const sendResetLink = async (email) => {
    setValidationErrors({});

    try {
      forgetPasswordSchema.parse({ email });
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
    const toastId = showLoadingToast("Sending reset link...");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      dismissToast(toastId);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      showSuccessToast("Password reset link sent to your email");

      return { success: true, data };
    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "Failed to send reset link";
      showErrorToast(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendResetLink,
    validationErrors,
    isLoading,
  };
};