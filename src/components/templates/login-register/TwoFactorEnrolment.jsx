"use client";
import { useEffect, useState, useRef } from "react";
import AuthFooter from "@/components/modules/login-register/AuthFooter.jsx";
import { useTwoFactorChallenge } from "@/hooks/auth/useTwoFactorChallenge";
import { copyTextToClipboard } from "@/utils/clipboard";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

const STEPS = { SCAN: "scan", VERIFY: "verify", CODES: "codes" };

const TwoFactorEnrolment = ({ goto }) => {
  const { startEnrolment, confirmEnrolment, isLoading } = useTwoFactorChallenge();

  const [step, setStep] = useState(STEPS.SCAN);
  const [setupData, setSetupData] = useState(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState("");

  // A second call would issue a new secret and invalidate the QR on screen
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const start = async () => {
      const result = await startEnrolment();

      if (result.success) {
        setSetupData(result.data);
      } else {
        showErrorToast(result.message);
        goto("login");
      }
    };

    start();
  }, [startEnrolment, goto]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return;

    const result = await confirmEnrolment(code);

    if (result.success) {
      setBackupCodes(result.backupCodes || []);
      setStep(STEPS.CODES);
    } else {
      setError(result.message);
      setCode("");
    }
  };

  const handleCopy = async () => {
    const copied = await copyTextToClipboard(backupCodes.join("\n"));
    if (copied) showSuccessToast("Backup codes copied");
  };

  const handleDownload = () => {
    const blob = new Blob(
      [`nexFile backup codes\n\nEach code works once.\n\n${backupCodes.join("\n")}\n`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nexfile-backup-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center dark:bg-neutral-900 min-h-screen md:min-h-full md:h-auto md:rounded-xl bg-white md:shadow-sm md:mx-3 overflow-x-hidden">
      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 pt-12 md:pt-16 lg:pt-20 pb-6">
        <div className="w-full max-w-[380px] flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col text-center items-center justify-center gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-500 dark:text-white">
              Set up two-step verification
            </h2>
            <p className="text-sm text-neutral-300 dark:text-neutral-200 px-4 sm:px-0">
              Your organization requires this before you can sign in.
            </p>
          </div>

          {step === STEPS.SCAN && (
            <div className="flex flex-col items-center gap-4 w-full">
              {!setupData ? (
                <div className="h-[240px] w-[240px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={setupData.qrCodeDataUrl}
                  alt="Two-step verification QR code"
                  className="rounded-lg bg-white p-2"
                  width={240}
                  height={240}
                />
              )}

              {setupData?.manualKey && (
                <div className="w-full rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                  <p className="text-xs text-neutral-300 dark:text-neutral-200">
                    Can&apos;t scan? Enter this key manually:
                  </p>
                  <code className="mt-1 block break-all font-mono text-xs text-neutral-500 dark:text-white">
                    {setupData.manualKey}
                  </code>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(STEPS.VERIFY)}
                disabled={!setupData}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {step === STEPS.VERIFY && (
            <form onSubmit={handleVerify} className="flex flex-col items-center gap-6 w-full">
              <div className="flex flex-col gap-1 w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="000000"
                  className={`w-full h-14 rounded-lg border text-center font-mono text-2xl tracking-[0.4em] bg-white dark:bg-neutral-800 dark:text-white outline-none ${
                    error ? "border-red-500" : "border-stroke-500 dark:border-neutral-600"
                  }`}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={code.length !== 6 || isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify and continue"}
              </button>

              <button
                type="button"
                onClick={() => setStep(STEPS.SCAN)}
                className="text-xs text-neutral-300 dark:text-neutral-200 hover:text-primary-500 transition-colors"
              >
                Back to QR code
              </button>
            </form>
          )}

          {step === STEPS.CODES && (
            <div className="flex flex-col gap-4 w-full">
              <p className="text-xs text-neutral-300 dark:text-neutral-200 text-center">
                Save these backup codes. They are shown only once and each works a single time.
              </p>

              <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
                {backupCodes.map((backupCode) => (
                  <code key={backupCode} className="text-center font-mono text-xs text-neutral-500 dark:text-white">
                    {backupCode}
                  </code>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-9 flex-1 rounded-lg border border-stroke-300 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="h-9 flex-1 rounded-lg border border-stroke-300 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                >
                  Download
                </button>
              </div>

              <button
                type="button"
                onClick={() => window.location.replace("/home")}
                className="btn-primary w-full"
              >
                Continue to NexFile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto w-full flex justify-center py-4 md:py-6">
        <AuthFooter />
      </div>
    </div>
  );
};

export default TwoFactorEnrolment;