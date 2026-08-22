"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";
import useAuthStore from "@/store/auth/authStore";

const getSafeRedirect = (value, fallback = "/home") => {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
};

/** Second login step: verify a TOTP or backup code, or start email recovery. */
export const useTwoFactorChallenge = () => {
  const searchParams = useSearchParams();
  const { login: setLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const verifyCode = async (code) => {
    setIsLoading(true);
    const toastId = showLoadingToast("Verifying...");

    try {
      const response = await fetch("/api/auth/two-factor/challenge", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      dismissToast(toastId);

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Verification failed",
          expired: data.code === "CHALLENGE_EXPIRED",
        };
      }

      setLogin(data.user);

      if (data.usedBackupCode) {
        showSuccessToast(
          `Backup code used. ${data.remainingBackupCodes} remaining.`
        );
      } else {
        showSuccessToast("Login successful! Redirecting...");
      }

      window.location.replace(getSafeRedirect(searchParams.get("redirect")));

      return { success: true };
    } catch (error) {
      dismissToast(toastId);
      return { success: false, message: error.message || "Verification failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const requestRecovery = async () => {
    setIsLoading(true);
    const toastId = showLoadingToast("Sending recovery email...");

    try {
      const response = await fetch("/api/auth/two-factor/recovery/request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      dismissToast(toastId);

      if (!response.ok || !data.success) {
        showErrorToast(data.message || "Failed to send recovery email");
        return { success: false, expired: data.code === "CHALLENGE_EXPIRED" };
      }

      return { success: true };
    } catch (error) {
      dismissToast(toastId);
      showErrorToast(error.message || "Failed to send recovery email");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRecovery = async (token) => {
    try {
      const response = await fetch("/api/auth/two-factor/recovery/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || "Recovery failed" };
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message || "Recovery failed" };
    }
  };

  /**
   * Confirms enrolment for a member forced to set up two-step verification.
   * Unlike the settings flow, this is where their session is issued.
   */
  const confirmEnrolment = async (code) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/two-factor/enable", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || "Setup failed" };
      }

      if (data.user) setLogin(data.user);

      return { success: true, backupCodes: data.backupCodes };
    } catch (error) {
      return { success: false, message: error.message || "Setup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const startEnrolment = async () => {
    try {
      const response = await fetch("/api/auth/two-factor/setup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || "Failed to start setup" };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message || "Failed to start setup" };
    }
  };
  return { verifyCode, requestRecovery, confirmRecovery, isLoading, confirmEnrolment, startEnrolment };
};