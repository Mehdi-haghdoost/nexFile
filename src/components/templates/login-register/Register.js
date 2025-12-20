"use client";
import { useState } from "react";
import AuthFooter from "@/components/modules/login-register/AuthFooter";
import { showErrorToast } from "@/lib/toast";
import { useRegister } from "@/hooks/auth/useRegister";
import styles from "./register.module.css";

const Register = ({ goto }) => {
  const { register, validationErrors, isLoading } = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // چک کردن قبول شرایط
    if (!formData.terms) {
      showErrorToast("لطفاً شرایط و قوانین را بپذیرید");
      return;
    }

    // ارسال به API
    await register(formData);
  };

  return (
    <div
      className={`${styles.register} flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden`}
    >
      {/* Main Content Container */}
      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
        {/* Content Wrapper */}
        <div className="w-full max-w-[350px] flex flex-col gap-6 md:gap-8">
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex w-10 h-10 p-1 flex-col items-center justify-center gap-2 rounded-lg border border-white/70 bg-gradient-primary shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="18"
                viewBox="0 0 25 18"
                fill="none"
              >
                <path
                  d="M16.3184 1.31818C20.5608 1.31828 23.9999 4.75741 24 8.99982C24 13.07 20.8342 16.4012 16.8311 16.6649L16.583 16.6815H7.0459C3.70714 16.6815 1.00009 13.9753 1 10.6365C1 7.29772 3.70709 4.59064 7.0459 4.59064C7.83163 4.59069 8.58124 4.74057 9.26855 5.01251L9.64941 5.1629L9.87207 4.82013C11.2426 2.7112 13.618 1.31818 16.3184 1.31818Z"
                  fill="url(#paint0_linear_11_357)"
                  stroke="url(#paint1_linear_11_357)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_11_357"
                    x1="12.5"
                    y1="5"
                    x2="12.5"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#B7ABEB" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_11_357"
                    x1="12.5"
                    y1="0.818176"
                    x2="12.5"
                    y2="17.1818"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="text-semibold-18 dark:text-semibold-18-white">
              NexFile
            </h3>
          </div>

          {/* Header */}
          <div className="flex flex-col text-center items-center justify-center gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
              Create an account
            </h2>
            <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
              Enter your name, email and password to create an account
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
            {/* Input Fields */}
            <div className="flex flex-col gap-3.5 w-full">
              {/* Full Name */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-neutral-300 dark:text-neutral-200">
                  Full Name
                </label>
                <div className="flex items-center w-full h-12 py-3 px-4 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-sm font-inter bg-transparent dark:text-white outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-400"
                    placeholder="Ridwan Taufiiqul"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-neutral-300 dark:text-neutral-200">
                  Email
                </label>
                <div className="flex items-center w-full h-12 py-3 px-4 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-sm font-inter bg-transparent dark:text-white outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-400"
                    placeholder="ridwant@gmail.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-neutral-300 dark:text-neutral-200">
                  Password
                </label>
                <div className="flex items-center w-full h-12 py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-sm font-inter bg-transparent dark:text-white outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none shrink-0 hover:opacity-70 transition-opacity"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8C2 8 4 3.33333 8 3.33333C12 3.33333 14 8 14 8C14 8 12 12.6667 8 12.6667C4 12.6667 2 8 2 8Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="8" cy="8" r="2" stroke="#A1A1A3" strokeWidth="1.3"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-neutral-300 dark:text-neutral-200">
                  Confirm Password
                </label>
                <div className="flex items-center w-full h-12 py-3 px-4 gap-2 rounded-lg border border-stroke-500 bg-white dark:bg-neutral-800 dark:border-neutral-600">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full text-sm font-inter bg-transparent dark:text-white outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none shrink-0 hover:opacity-70 transition-opacity"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8C2 8 4 3.33333 8 3.33333C12 3.33333 14 8 14 8C14 8 12 12.6667 8 12.6667C4 12.6667 2 8 2 8Z" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="8" cy="8" r="2" stroke="#A1A1A3" strokeWidth="1.3"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#A1A1A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 w-full">
                <input
                  id="link-checkbox"
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 shrink-0 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="link-checkbox"
                  className="text-xs text-neutral-300 dark:text-neutral-200 leading-relaxed"
                >
                  I agree to NexFile's{" "}
                  <span className="text-primary-500 cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary-500 cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال ثبت‌نام..." : "Register"}
            </button>

            {/* Login Link */}
            <p className="text-xs text-neutral-300 dark:text-neutral-200 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => goto("login")}
                className="text-primary-500 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto w-full flex justify-center py-4 md:py-6">
        <AuthFooter />
      </div>
    </div>
  );
};

export default Register;