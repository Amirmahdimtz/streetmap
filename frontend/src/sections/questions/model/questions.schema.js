// schemas/applicationSchema.js
import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z
    .string()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
  lastName: z
    .string()
    .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام خانوادگی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
  skills: z
    .string()
    .min(20, "مهارت خود را با جزئیات بیشتری بیان کنید (حداقل ۲۰ کاراکتر)")
    .max(500, "متن مهارت نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"),
  objective: z
    .string()
    .min(20, "هدف خود را با جزئیات بیشتری بیان کنید (حداقل ۲۰ کاراکتر)")
    .max(500, "متن هدف نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string().optional(),
    })
    .refine((data) => data.lat && data.lng, {
      message: "لطفاً موقعیت مکانی خود را روی نقشه انتخاب کنید",
    }),
});

export const stepSchemas = {
  0: applicationSchema.pick({ firstName: true, lastName: true }),
  1: applicationSchema.pick({ skills: true }),
  2: applicationSchema.pick({ objective: true }),
  3: applicationSchema.pick({ location: true }),
};
