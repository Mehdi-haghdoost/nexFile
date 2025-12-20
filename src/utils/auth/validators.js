import { z } from "zod";

// Schema برای Frontend Register 
export const registerSchemaFrontend = z
  .object({
    name: z
      .string()
      .min(2, "نام باید حداقل 2 کاراکتر باشد")
      .max(50, "نام نباید بیشتر از 50 کاراکتر باشد")
      .trim(),
    email: z
      .string()
      .email("ایمیل معتبر نیست")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
      .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
      .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
      .regex(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "باید شرایط و قوانین را بپذیرید",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

// Schema برای Backend Register 
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "نام باید حداقل 2 کاراکتر باشد")
      .max(50, "نام نباید بیشتر از 50 کاراکتر باشد")
      .trim(),
    email: z
      .string()
      .email("ایمیل معتبر نیست")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
      .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
      .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
      .regex(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

// Validation برای Login
export const loginSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست").toLowerCase().trim(),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

// Validation برای Forget Password
export const forgetPasswordSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست").toLowerCase().trim(),
});

// Validation برای Reset Password
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
      .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
      .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
      .regex(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد"),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

// Helper validation functions
export const validateEmail = (email) => {
  const pattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;
  return pattern.test(email);
};

export const validatePassword = (password) => {
  const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/g;
  return pattern.test(password);
};