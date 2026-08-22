"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import useAuthStore from "@/store/auth/authStore";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

const getSafeRedirect = (value, fallback = "/home") => {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
};

/**
 * Completes a social sign-in.
 *
 * Google redirects back here with ?oauth=google. At that point NextAuth has a
 * session but the app does not, so this exchanges it for the app's own cookies
 * and then routes to the right step.
 *
 * @param {Function} onStepRequired called with the step name when the sign-in
 *   cannot complete yet: "two-factor" or "two-factor-setup".
 */
export const useOAuthBridge = (onStepRequired) => {
  const searchParams = useSearchParams();
  const { login: setLogin } = useAuthStore();
  const [isExchanging, setIsExchanging] = useState(false);

  // Guards against StrictMode running the exchange twice
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (searchParams.get("oauth") !== "google") return;
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const exchange = async () => {
      setIsExchanging(true);

      try {
        const response = await fetch("/api/auth/oauth-session", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Google sign-in failed");
        }

        // The provider session has served its purpose; leaving it live would
        // let a signed-out user silently re-authenticate.
        await signOut({ redirect: false });

        // The account already has TOTP and must present a code
        if (data.requiresTwoFactor) {
          setIsExchanging(false);
          onStepRequired?.("two-factor");
          return;
        }

        // Organization policy demands enrolment before this account can enter
        if (data.requiresTwoFactorSetup) {
          setIsExchanging(false);
          onStepRequired?.("two-factor-setup");
          return;
        }

        setLogin(data.user);
        showSuccessToast("Login successful! Redirecting...");
        window.location.replace(getSafeRedirect(searchParams.get("redirect")));
      } catch (error) {
        showErrorToast(error.message || "Google sign-in failed");
        setIsExchanging(false);
      }
    };

    exchange();
  }, [searchParams, setLogin, onStepRequired]);

  return { isExchanging };
};