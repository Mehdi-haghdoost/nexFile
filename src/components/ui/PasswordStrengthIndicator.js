"use client";
import { getPasswordStrength } from "@/utils/auth/validators";

const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const { strength, percentage } = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "good":
        return "bg-blue-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getText = () => {
    switch (strength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "good":
        return "Good";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-neutral-400">Password strength:</span>
        <span className={`text-xs font-medium ${getColor().replace("bg-", "text-")}`}>
          {getText()}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;