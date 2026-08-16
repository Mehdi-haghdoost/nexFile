"use client";
import { useState } from "react";
import AuthFooter from "@/components/modules/login-register/AuthFooter.jsx";
import { useTwoFactorChallenge } from "@/hooks/auth/useTwoFactorChallenge";
import { showErrorToast } from "@/lib/toast";

const TwoFactorChallenge = ({ goto }) => {
  const { verifyCode, requestRecovery, isLoading } = useTwoFactorChallenge();

  const [code, setCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);

  const isCodeReady = useBackupCode
    ? code.replace(/[\s-]/g, "").length === 10
    : code.length === 6;

  // TOTP codes are digits only; backup codes are letters and digits.
  const handleCodeChange = (value) => {
    const next = useBackupCode
      ? value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 11)
      : value.replace(/\D/g, "").slice(0, 6);

    setCode(next);
    setError("");
  };

  const switchMode = () => {
    setUseBackupCode((prev) => !prev);
    setCode("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCodeReady) return;

    const result = await verifyCode(code);

    if (!result.success) {
      setError(result.message);
      setCode("");

      // The challenge window closed, so the password step must run again.
      if (result.expired) {
        showErrorToast("Please sign in again");
        goto("login");
      }
    }
  };

  const handleRecovery = async () => {
    const result = await requestRecovery();

    if (result.success) {
      setRecoverySent(true);
    } else if (result.expired) {
      goto("login");
    }
  };

  if (recoverySent) {
    return (
      <div className="flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden">
        <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
          <div className="w-full max-w-[450px] flex flex-col gap-6 md:gap-8">
            <div className="flex items-center justify-center">
              <div className="flex w-16 h-16 md:w-[72px] md:h-[72px] p-1 flex-col items-center justify-center rounded-full border-2 border-white/70 bg-gradient-primary shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col text-center items-center justify-center gap-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
                Check your email
              </h2>
              <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
                If the account needs recovery, we&apos;ve sent a link to turn off two-step verification.
              </p>
              <p className="text-xs text-neutral-300 dark:text-neutral-200 px-4 sm:px-0 mt-2">
                The link expires in 15 minutes
              </p>
            </div>

            <button onClick={() => goto("login")} className="btn-primary w-full">
              Back to Login
            </button>
          </div>
        </div>

        <div className="mt-auto w-full flex justify-center py-4 md:py-6">
          <AuthFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden">
      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
        <div className="w-full max-w-[350px] flex flex-col gap-6 md:gap-8">
          <div className="flex items-center justify-center gap-3">
            <div className="flex w-10 h-10 p-1 flex-col items-center justify-center gap-2 rounded-lg border border-white/70 bg-gradient-primary shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-semibold-18 dark:text-semibold-18-white">NexFile</h3>
          </div>

          <div className="flex flex-col text-center items-center justify-center gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
              Two-step verification
            </h2>
            <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
              {useBackupCode
                ? "Enter one of the backup codes you saved"
                : "Enter the 6-digit code from your authenticator app"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col gap-1 w-full">
              <input
                type="text"
                inputMode={useBackupCode ? "text" : "numeric"}
                autoComplete="one-time-code"
                autoFocus
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder={useBackupCode ? "ABCDE-FGHJK" : "000000"}
                className={`w-full h-14 rounded-lg border text-center font-mono ${
                  useBackupCode ? "text-lg tracking-[0.2em]" : "text-2xl tracking-[0.4em]"
                } bg-white dark:bg-neutral-800 dark:text-white outline-none ${
                  error ? "border-red-500" : "border-stroke-500 dark:border-neutral-600"
                }`}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!isCodeReady || isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            <div className="flex flex-col items-center gap-3 w-full">
              <button
                type="button"
                onClick={switchMode}
                className="text-xs text-primary-500 hover:underline"
              >
                {useBackupCode
                  ? "Use your authenticator app instead"
                  : "Use a backup code instead"}
              </button>

              <button
                type="button"
                onClick={handleRecovery}
                disabled={isLoading}
                className="text-xs text-neutral-300 dark:text-neutral-200 hover:text-primary-500 transition-colors disabled:opacity-50"
              >
                Lost access to both? Email me a recovery link
              </button>

              <button
                type="button"
                onClick={() => goto("login")}
                className="text-xs text-neutral-300 dark:text-neutral-200 hover:text-primary-500 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-auto w-full flex justify-center py-4 md:py-6">
        <AuthFooter />
      </div>
    </div>
  );
};

export default TwoFactorChallenge;