"use client";
import { validatePassword } from "@/utils/auth/validators";

const PasswordRequirements = ({ password, show = true }) => {
  if (!show) return null;

  const validation = validatePassword(password);
  const checks = validation.checks;

  const RequirementItem = ({ met, text }) => (
    <li className="flex items-center gap-2 text-xs">
      {met ? (
        <svg
          className="w-4 h-4 text-green-500 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <span className={met ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
        {text}
      </span>
    </li>
  );

  return (
    <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
      <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-2">
        Password must contain:
      </p>
      <ul className="space-y-1.5">
        <RequirementItem met={checks.minLength} text="At least 8 characters" />
        <RequirementItem met={checks.uppercase} text="One uppercase letter (A-Z)" />
        <RequirementItem met={checks.lowercase} text="One lowercase letter (a-z)" />
        <RequirementItem met={checks.number} text="One number (0-9)" />
        <RequirementItem met={checks.specialChar} text="One special character (!@#$%^&*)" />
      </ul>
    </div>
  );
};

export default PasswordRequirements;