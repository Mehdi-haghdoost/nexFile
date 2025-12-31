"use client";
import { useState, useEffect } from "react";
import AuthFooter from '@/components/modules/login-register/AuthFooter.jsx'
import { useForgetPassword } from "@/hooks/auth/useForgetPassword";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { validateField } from "@/utils/auth/validators";
import styles from "./forgetPassword.module.css";

const ForgetPassword = ({ goto }) => {
  const { sendResetLink, validationErrors, isLoading } = useForgetPassword();

  const [formData, setFormData] = useState({
    email: "",
    touched: false,
    fieldError: "",
    isFormValid: false,
  });

  const [resetData, setResetData] = useState({
    emailSent: false,
    resetUrl: "",
    sentEmail: "",
  });

  useEffect(() => {
    if (formData.email) {
      const error = validateField("email", formData.email);
      setFormData(prev => ({
        ...prev,
        fieldError: error || "",
        isFormValid: !error,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fieldError: "",
        isFormValid: false,
      }));
    }
  }, [formData.email]);

  const handleBlur = () => {
    setFormData(prev => ({ ...prev, touched: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormData(prev => ({ ...prev, touched: true }));

    if (!formData.isFormValid) {
      const error = formData.fieldError || "Please enter a valid email";
      showErrorToast(error);
      return;
    }

    const result = await sendResetLink(formData.email);

    if (result.success) {
      setResetData({
        emailSent: true,
        resetUrl: result.data?.resetUrl || "",
        sentEmail: formData.email,
      });
    } else if (result.errors) {
      const firstError = Object.values(result.errors)[0];
      if (firstError) {
        showErrorToast(firstError);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resetData.resetUrl);
    showSuccessToast("Link copied to clipboard!");
  };

  const handleGoToReset = () => {
    try {
      const url = new URL(resetData.resetUrl);
      const token = url.searchParams.get('token');
      if (token) {
        goto('reset', token);
      }
    } catch (error) {
      showErrorToast("Invalid reset URL");
    }
  };

  if (resetData.emailSent) {
    return (
      <div className={`${styles.forgetPassword} flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden`}>
        <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
          <div className="w-full max-w-[450px] flex flex-col gap-6 md:gap-8">
            <div className="flex items-center justify-center">
              <div className="flex w-16 h-16 md:w-[72px] md:h-[72px] p-1 flex-col items-center justify-center rounded-full border-2 border-white/70 bg-gradient-primary shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
            </div>

            <div className="flex flex-col text-center items-center justify-center gap-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
                Check your email
              </h2>
              <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
                We've sent a password reset link to <strong>{resetData.sentEmail}</strong>
              </p>
              <p className="text-xs text-neutral-300 dark:text-neutral-200 px-4 sm:px-0 mt-2">
                The link will expire in 1 hour
              </p>
            </div>

            {resetData.resetUrl && process.env.NODE_ENV === "development" && (
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-2 w-full p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    Development Mode - Email not sent, use this link:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={resetData.resetUrl}
                      readOnly
                      className="flex-1 text-xs p-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGoToReset}
                  className="btn-primary w-full"
                >
                  Go to Reset Password →
                </button>
              </div>
            )}

            <div className="flex flex-col items-center gap-4 w-full">
              <button
                onClick={() => goto("login")}
                className="btn-primary w-full"
              >
                Back to Login
              </button>

              <button
                onClick={() => {
                  setResetData({
                    emailSent: false,
                    resetUrl: "",
                    sentEmail: "",
                  });
                  setFormData({
                    email: "",
                    touched: false,
                    fieldError: "",
                    isFormValid: false,
                  });
                }}
                className="text-xs text-neutral-300 dark:text-neutral-200 hover:text-primary-500 transition-colors"
              >
                Try another email
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto w-full flex justify-center py-4 md:py-6">
          <AuthFooter />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.forgetPassword} flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden`}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
        <div className="w-full max-w-[350px] flex flex-col gap-6 md:gap-8">
          <div className="flex items-center justify-center gap-3">
            <div className="flex w-10 h-10 p-1 flex-col items-center justify-center gap-2 rounded-lg border border-white/70 bg-gradient-primary shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="18" viewBox="0 0 25 18" fill="none">
                <path d="M16.3184 1.31818C20.5608 1.31828 23.9999 4.75741 24 8.99982C24 13.07 20.8342 16.4012 16.8311 16.6649L16.583 16.6815H7.0459C3.70714 16.6815 1.00009 13.9753 1 10.6365C1 7.29772 3.70709 4.59064 7.0459 4.59064C7.83163 4.59069 8.58124 4.74057 9.26855 5.01251L9.64941 5.1629L9.87207 4.82013C11.2426 2.7112 13.618 1.31818 16.3184 1.31818Z" fill="url(#paint0_linear_11_357)" stroke="url(#paint1_linear_11_357)" />
                <defs>
                  <linearGradient id="paint0_linear_11_357" x1="12.5" y1="5" x2="12.5" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#B7ABEB" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_11_357" x1="12.5" y1="0.818176" x2="12.5" y2="17.1818" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="text-semibold-18 dark:text-semibold-18-white">NexFile</h3>
          </div>

          <div className="flex flex-col text-center items-center justify-center gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
              Forgot password
            </h2>
            <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
              Enter your email address to receive a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-neutral-300 dark:text-neutral-200">
                  Email
                </label>
                <div
                  className={`flex items-center w-full h-12 py-3 px-4 gap-2 rounded-lg border ${
                    formData.touched && formData.fieldError ? "border-red-500" : "border-stroke-500"
                  } bg-white dark:bg-neutral-800 dark:border-neutral-600`}
                >
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    onBlur={handleBlur}
                    className="w-full text-sm font-inter bg-transparent dark:text-white outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-400"
                    placeholder="john@example.com"
                  />
                </div>
                {formData.touched && (formData.fieldError || validationErrors.email) && (
                  <p className="text-xs text-red-500 mt-1">
                    {formData.fieldError || validationErrors.email}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.isFormValid || isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => goto("login")}
              className="text-xs text-neutral-300 dark:text-neutral-200 hover:text-primary-500 transition-colors"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-center py-4 md:py-6">
        <AuthFooter />
      </div>
    </div>
  );
};

export default ForgetPassword;