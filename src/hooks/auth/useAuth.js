"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth/authStore";

export const useAuth = (options = {}) => {
  const { requireAuth = true, redirectTo = "/login-register" } = options;
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const checkInProgress = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (checkInProgress.current) {
        return;
      }

      checkInProgress.current = true;

      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          return true;
        } else if (response.status === 401) {
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setUser(refreshData.user);
            return true;
          } else {
            clearAuth();
            if (requireAuth) {
              router.push(redirectTo);
            }
            return false;
          }
        } else {
          clearAuth();
          if (requireAuth) {
            router.push(redirectTo);
          }
          return false;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        clearAuth();
        if (requireAuth) {
          router.push(redirectTo);
        }
        return false;
      } finally {
        setIsLoading(false);
        checkInProgress.current = false;
      }
    };

    checkAuth();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      checkAuth();
    }, 10 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [requireAuth, redirectTo, router, setUser, clearAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};