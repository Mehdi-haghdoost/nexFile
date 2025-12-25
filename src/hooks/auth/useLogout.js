"use client";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth/authStore";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

export const useLogout = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        clearAuth();
        localStorage.removeItem("userEmail");
        showSuccessToast("Logged out successfully");
        router.push("/login-register");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showErrorToast("Logout failed");
    }
  };

  return { logout };
};