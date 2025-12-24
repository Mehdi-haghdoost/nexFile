import { z } from "zod";

// Name validation - minimum 5 characters
const nameValidation = z
  .string()
  .min(1, "Name is required")
  .trim()
  .min(5, "Name must be at least 5 characters")
  .max(50, "Name must not exceed 50 characters")
  .refine(
    (name) => /^[a-zA-Z\s]+$/.test(name),
    { message: "Name can only contain letters and spaces" }
  )
  .refine(
    (name) => {
      const letters = name.replace(/\s/g, "");
      return letters.length >= 5;
    },
    { message: "Name must contain at least 5 letters" }
  );

// Email validation
const emailValidation = z
  .string()
  .min(1, "Email is required")
  .trim()
  .toLowerCase()
  .refine(
    (email) => email.length >= 5,
    { message: "Email is too short" }
  )
  .refine(
    (email) => email.length <= 100,
    { message: "Email is too long" }
  )
  .refine(
    (email) => email.includes("@"),
    { message: "Email must contain @ symbol" }
  )
  .refine(
    (email) => {
      const atCount = (email.match(/@/g) || []).length;
      return atCount === 1;
    },
    { message: "Email must contain exactly one @ symbol" }
  )
  .refine(
    (email) => {
      const parts = email.split("@");
      return parts[0] && parts[0].length >= 1;
    },
    { message: "Email must have username before @" }
  )
  .refine(
    (email) => {
      const parts = email.split("@");
      return parts[1] && parts[1].includes(".");
    },
    { message: "Email must have valid domain (e.g., gmail.com)" }
  )
  .refine(
    (email) => {
      const parts = email.split("@");
      if (!parts[1]) return false;
      const domainParts = parts[1].split(".");
      const tld = domainParts[domainParts.length - 1];
      return tld && tld.length >= 2;
    },
    { message: "Invalid email domain extension" }
  )
  .refine(
    (email) => !email.includes(" "),
    { message: "Email cannot contain spaces" }
  )
  .refine(
    (email) => {
      const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },
    { message: "Invalid email format" }
  );

// Password validation
const passwordValidation = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password must not exceed 50 characters")
  .refine(
    (password) => /[A-Z]/.test(password),
    { message: "Password must contain at least one uppercase letter" }
  )
  .refine(
    (password) => /[a-z]/.test(password),
    { message: "Password must contain at least one lowercase letter" }
  )
  .refine(
    (password) => /[0-9]/.test(password),
    { message: "Password must contain at least one number" }
  )
  .refine(
    (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    { message: "Password must contain at least one special character" }
  );

// Schema for Frontend Register
export const registerSchemaFrontend = z
  .object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for Backend Register
export const registerSchema = z
  .object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Validation for Login
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, "Password is required"),
});

// Validation for Forget Password
export const forgetPasswordSchema = z.object({
  email: emailValidation,
});

// Validation for Reset Password
export const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    token: z.string().min(1, "Reset token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Helper: Validate single field
export const validateField = (fieldName, value, allData = {}) => {
  try {
    switch (fieldName) {
      case "name": {
        if (!value || !value.trim()) {
          return "Name is required";
        }
        const trimmed = value.trim();
        if (trimmed.length < 5) {
          return "Name must be at least 5 characters";
        }
        if (trimmed.length > 50) {
          return "Name must not exceed 50 characters";
        }
        if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
          return "Name can only contain letters and spaces";
        }
        const letters = trimmed.replace(/\s/g, "");
        if (letters.length < 5) {
          return "Name must contain at least 5 letters";
        }
        return null;
      }

      case "email": {
        if (!value || !value.trim()) {
          return "Email is required";
        }
        const trimmed = value.trim().toLowerCase();
        if (trimmed.length < 5) {
          return "Email is too short";
        }
        if (trimmed.length > 100) {
          return "Email is too long";
        }
        if (!trimmed.includes("@")) {
          return "Email must contain @ symbol";
        }
        const atCount = (trimmed.match(/@/g) || []).length;
        if (atCount !== 1) {
          return "Email must contain exactly one @ symbol";
        }
        const parts = trimmed.split("@");
        if (!parts[0] || parts[0].length < 1) {
          return "Email must have username before @";
        }
        if (!parts[1] || !parts[1].includes(".")) {
          return "Email must have valid domain (e.g., gmail.com)";
        }
        const domainParts = parts[1].split(".");
        const tld = domainParts[domainParts.length - 1];
        if (!tld || tld.length < 2) {
          return "Invalid email domain extension";
        }
        if (trimmed.includes(" ")) {
          return "Email cannot contain spaces";
        }
        const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return "Invalid email format";
        }
        return null;
      }

      case "password": {
        if (!value) {
          return "Password is required";
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters";
        }
        if (value.length > 50) {
          return "Password must not exceed 50 characters";
        }
        if (!/[A-Z]/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(value)) {
          return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(value)) {
          return "Password must contain at least one number";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          return "Password must contain at least one special character";
        }
        return null;
      }

      case "confirmPassword": {
        if (!value) {
          return "Please confirm your password";
        }
        if (value !== allData.password) {
          return "Passwords do not match";
        }
        return null;
      }

      case "terms": {
        if (!value) {
          return "You must accept the terms and conditions";
        }
        return null;
      }

      default:
        return null;
    }
  } catch (error) {
    return "Invalid input";
  }
};

// Helper validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) return false;
  
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  
  const [username, domain] = parts;
  if (!username || username.length < 1) return false;
  if (!domain || domain.length < 3) return false;
  
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;
  
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) return false;
  
  return true;
};

export const validatePassword = (password) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar,
    checks: {
      minLength: hasMinLength,
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
      number: hasNumber,
      specialChar: hasSpecialChar,
    },
  };
};

export const getPasswordStrength = (password) => {
  const validation = validatePassword(password);
  const passedChecks = Object.values(validation.checks).filter(
    (check) => check
  ).length;

  if (passedChecks === 0) return { strength: "none", percentage: 0 };
  if (passedChecks <= 2) return { strength: "weak", percentage: 40 };
  if (passedChecks <= 3) return { strength: "medium", percentage: 60 };
  if (passedChecks <= 4) return { strength: "good", percentage: 80 };
  return { strength: "strong", percentage: 100 };
};