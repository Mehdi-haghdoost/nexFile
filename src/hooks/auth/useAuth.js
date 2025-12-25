"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth/authStore";

export const useAuth = (options = {}) => {
  const { requireAuth = true, redirectTo = "/login-register" } = options;
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          clearAuth();
          if (requireAuth) {
            router.push(redirectTo);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        clearAuth();
        if (requireAuth) {
          router.push(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo, router, setUser, clearAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};