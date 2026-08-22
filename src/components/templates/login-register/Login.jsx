"use client";
import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import AuthFooter from '@/components/modules/login-register/AuthFooter.jsx'
import {
  NexFileLogoIcon,
  AuthEmailIcon,
  AuthPasswordIcon,
  AuthEyeVisibleIcon,
  AuthEyeHiddenIcon,
  GoogleIcon,
  AppleIcon,
} from "@/components/ui/icons";
import { useLogin } from "@/hooks/auth/useLogin";
import { useOAuthBridge } from "@/hooks/auth/useOAuthBridge";
import { showErrorToast } from "@/lib/toast";
import { validateField } from "@/utils/auth/validators";
import styles from "./login.module.css";

const inputWrapperClass = (hasError) =>
  `flex items-center w-full h-12 py-3 px-4 gap-2 rounded-lg border ${
    hasError ? "border-red-500" : "border-stroke-500"
  } bg-white dark:bg-neutral-800 dark:border-neutral-600`;

const inputClass =
  "w-full text-sm font-inter bg-transparent dark:text-white outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-400";

const socialButtonClass =
  "flex h-12 w-full sm:flex-1 py-3 px-4 justify-center items-center gap-2 rounded-lg border border-stroke-500 bg-white dark:border-neutral-600 dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const Login = ({ goto }) => {
  const { login, validationErrors, isLoading } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Google sign-in can also land on a two-factor step, so the bridge decides
  // which one rather than this component assuming.
  const handleStepRequired = useCallback((step) => goto(step), [goto]);

  const { isExchanging } = useOAuthBridge(handleStepRequired);

  const isBusy = isLoading || isExchanging;

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  useEffect(() => {
    const errors = {};

    if (formData.email) {
      const emailError = validateField("email", formData.email, formData);
      if (emailError) errors.email = emailError;
    }

    // Login only checks that a password was entered. Applying the full
    // strength rules here would lock out accounts whose password predates them.
    setFieldErrors(errors);
    setIsFormValid(
      Boolean(formData.email && formData.password) && Object.keys(errors).length === 0
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const error = fieldErrors[fieldName];
    if (error) showErrorToast(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!isFormValid) {
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) showErrorToast(firstError);
      return;
    }

    const result = await login(formData);

    // Password accepted but the account needs a second factor
    if (result?.requiresTwoFactor) {
      goto("two-factor");
      return;
    }

    // Organization policy demands enrolment before this account can sign in
    if (result?.requiresTwoFactorSetup) {
      goto("two-factor-setup");
      return;
    }

    if (result && result.errors) {
      const firstError = Object.values(result.errors)[0];
      if (firstError) showErrorToast(firstError);
    }
  };

  /**
   * A full redirect, not redirect: false. For OAuth providers NextAuth returns
   * a URL instead of navigating, so the user never reached Google. The oauth
   * flag tells this page to exchange the provider session on return.
   */
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/login-register?oauth=google" });
    } catch (error) {
      console.error("Google login error:", error);
      showErrorToast("Google login failed");
    }
  };

  const handleAppleLogin = async () => {
    showErrorToast("Apple login is not available yet");
  };

  const getFieldError = (fieldName) => {
    if (touched[fieldName]) {
      return fieldErrors[fieldName] || validationErrors[fieldName];
    }
    return null;
  };

  return (
    <div
      className={`${styles.login} flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden`}
    >
      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
        <div className="w-full max-w-[350px] flex flex-col gap-6 md:gap-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex w-10 h-10 p-1 flex-col items-center justify-center gap-2 rounded-lg border border-white/70 bg-gradient-primary shrink-0">
              <NexFileLogoIcon />
            </div>
            <h3 className="text-semibold-18 dark:text-semibold-18-white">NexFile</h3>
          </div>

          {/* Header */}
          <div className="flex flex-col text-center items-center justify-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
                Welcome to
              </h2>
              <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                NexFile
              </h2>
            </div>
            <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
              {isExchanging
                ? "Finishing your Google sign-in..."
                : "Enter your email and password to login"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col gap-4 w-full">
              {/* Email */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-neutral-300 dark:text-neutral-200">Email</label>
                <div className={inputWrapperClass(getFieldError("email"))}>
                  <AuthEmailIcon />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
                {getFieldError("email") && (
                  <p className="text-xs text-red-500 mt-1">{getFieldError("email")}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-neutral-300 dark:text-neutral-200">Password</label>
                <div className={inputWrapperClass(getFieldError("password"))}>
                  <AuthPasswordIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none shrink-0 hover:opacity-70 transition-opacity"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <AuthEyeVisibleIcon /> : <AuthEyeHiddenIcon />}
                  </button>
                </div>
                {getFieldError("password") && (
                  <p className="text-xs text-red-500 mt-1">{getFieldError("password")}</p>
                )}
              </div>

              {/* Remember me and password recovery */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 w-full">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-checkbox"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 shrink-0 rounded-sm border-2 border-gray-500 bg-transparent text-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-transparent dark:focus:ring-primary-500"
                  />
                  <label
                    htmlFor="remember-checkbox"
                    className="text-sm text-neutral-300 dark:text-neutral-200"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => goto("forget")}
                  className="text-xs text-primary-500 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isBusy}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center justify-center w-full gap-3 sm:gap-5">
              <div className="flex-1 h-px bg-stroke-500"></div>
              <span className="text-xs text-neutral-300 dark:text-neutral-200 whitespace-nowrap">
                Or login with
              </span>
              <div className="flex-1 h-px bg-stroke-500"></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isBusy}
                className={socialButtonClass}
              >
                <GoogleIcon />
                <span className="text-sm text-neutral-500 dark:text-white">Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={isBusy}
                className={socialButtonClass}
              >
                <AppleIcon />
                <span className="text-sm text-neutral-500 dark:text-white">Apple</span>
              </button>
            </div>

            <p className="text-xs text-neutral-300 dark:text-neutral-200 text-center">
              Don&apos;t have account?{" "}
              <button
                type="button"
                onClick={() => goto("register")}
                className="text-primary-500 hover:underline"
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-center py-4 md:py-6">
        <AuthFooter />
      </div>
    </div>
  );
};

export default Login;