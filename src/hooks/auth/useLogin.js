import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
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

    // Validation با Zod
    try {
      loginSchema.parse(formData);
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      showErrorToast("لطفاً فرم را با دقت تکمیل کنید");
      return { success: false };
    }

    // شروع Loading
    setLoading(true);
    const toastId = showLoadingToast("در حال ورود...");

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
        throw new Error(data.message || "خطا در ورود");
      }

      // موفقیت
      showSuccessToast("ورود با موفقیت انجام شد");

      // ذخیره کاربر در Store
      setLogin(data.user);

      // مدیریت Remember Me
      if (formData.rememberMe) {
        localStorage.setItem("userEmail", formData.email);
      } else {
        localStorage.removeItem("userEmail"); // پاک کن اگه remember me false باشه
      }

      // هدایت به صفحه اصلی
      setTimeout(() => {
        router.push("/home");
      }, 1500);

      return { success: true, data };
    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "خطا در ورود";
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