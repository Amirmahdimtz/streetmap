// schemas/auth-schema.js
import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .max(30, "نام کاربری نمی‌تواند بیشتر از ۳۰ کاراکتر باشد"),
  password: z
    .string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .max(50, "رمز عبور نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
});

// برای رجیستر (اختیاری)
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
      .max(30, "نام کاربری نمی‌تواند بیشتر از ۳۰ کاراکتر باشد"),
    email: z.string().email("ایمیل معتبر نیست"),
    password: z
      .string()
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });
