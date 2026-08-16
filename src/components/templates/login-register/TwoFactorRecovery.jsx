"use client";
import { useEffect, useState, useRef } from "react";
import AuthFooter from "@/components/modules/login-register/AuthFooter.jsx";
import { useTwoFactorChallenge } from "@/hooks/auth/useTwoFactorChallenge";

const TwoFactorRecovery = ({ goto, token }) => {
  const { confirmRecovery } = useTwoFactorChallenge();

  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  // The link is single-use, so it must not be consumed twice by StrictMode.
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("This recovery link is missing its token");
        return;
      }

      const result = await confirmRecovery(token);
      setStatus(result.success ? "success" : "error");
      setMessage(result.message);
    };

    run();
  }, [token, confirmRecovery]);

  const isSuccess = status === "success";

  return (
    <div className="flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden">
      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
        <div className="w-full max-w-[450px] flex flex-col gap-6 md:gap-8">
          {status === "pending" ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-8 h-8 border-2 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-sm text-neutral-300 dark:text-neutral-200">
                Confirming your recovery link...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <div
                  className={`flex w-16 h-16 md:w-[72px] md:h-[72px] p-1 flex-col items-center justify-center rounded-full border-2 border-white/70 shrink-0 ${
                    isSuccess ? "bg-gradient-primary" : "bg-red-500"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {isSuccess ? (
                      <polyline points="20 6 9 17 4 12" />
                    ) : (
                      <>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <div className="flex flex-col text-center items-center justify-center gap-2">
                <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
                  {isSuccess ? "Two-step verification is off" : "Recovery failed"}
                </h2>
                <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
                  {message}
                </p>
                {isSuccess && (
                  <p className="text-xs text-neutral-300 dark:text-neutral-200 px-4 sm:px-0 mt-2">
                    We recommend setting it up again from Admin Console once you&apos;re signed in.
                  </p>
                )}
              </div>

              <button onClick={() => goto("login")} className="btn-primary w-full">
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-auto w-full flex justify-center py-4 md:py-6">
        <AuthFooter />
      </div>
    </div>
  );
};

export default TwoFactorRecovery;