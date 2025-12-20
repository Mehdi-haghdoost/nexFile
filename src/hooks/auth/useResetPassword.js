import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "@/lib/toast";
import { forgetPasswordSchema, resetPasswordSchema } from "@/utils/auth/validators";
import useAuthStore from "@/store/auth/authStore";

export const useResetPassword = () => {
  const router = useRouter();
  const { setLoading, setError } = useAuthStore();
  const [validationErrors, setValidationErrors] = useState({});

  // Forget Password - درخواست لینک بازیابی
  const forgetPassword = async (formData) => {
    setValidationErrors({});
    setError(null);

    // Validation
    try {
      forgetPasswordSchema.parse(formData);
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      showErrorToast("لطفاً ایمیل معتبر وارد کنید");
      return { success: false };
    }

    setLoading(true);
    const toastId = showLoadingToast("در حال ارسال لینک بازیابی...");

    try {
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      dismissToast(toastId);

      if (!response.ok) {
        throw new Error(data.message || "خطا در ارسال لینک");
      }

      showSuccessToast("لینک بازیابی به ایمیل شما ارسال شد");
      
      // هدایت به صفحه reset
      setTimeout(() => {
        router.push("/login-register?step=reset");
      }, 1500);

      return { success: true, data };

    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "خطا در ارسال لینک";
      setError(errorMessage);
      showErrorToast(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset Password - تنظیم رمز عبور جدید
  const resetPassword = async (formData) => {
    setValidationErrors({});
    setError(null);

    // Validation
    try {
      resetPasswordSchema.parse(formData);
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      showErrorToast("لطفاً فرم را با دقت تکمیل کنید");
      return { success: false };
    }

    // تایید از کاربر
    const result = await Swal.fire({
      title: "تغییر رمز عبور",
      text: "آیا از تغییر رمز عبور مطمئن هستید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "بله، تغییر کن",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return { success: false };
    }

    setLoading(true);
    const toastId = showLoadingToast("در حال تغییر رمز عبور...");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          token: formData.token,
        }),
      });

      const data = await response.json();

      dismissToast(toastId);

      if (!response.ok) {
        throw new Error(data.message || "خطا در تغییر رمز عبور");
      }

      showSuccessToast("رمز عبور با موفقیت تغییر کرد");
      
      // هدایت به صفحه success
      setTimeout(() => {
        router.push("/login-register?step=success");
      }, 1500);

      return { success: true, data };

    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "خطا در تغییر رمز عبور";
      setError(errorMessage);
      showErrorToast(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    forgetPassword,
    resetPassword,
    validationErrors,
    isLoading: useAuthStore((state) => state.isLoading),
    error: useAuthStore((state) => state.error),
  };
};