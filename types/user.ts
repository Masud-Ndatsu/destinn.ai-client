import * as z from "zod";

export const authSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  educationLevel: z.string().optional(),
  experienceYears: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience seems too high")
    .optional()
    .or(z.literal("")),
  interests: z.string().optional(),
});

export type AuthFormData = z.infer<typeof authSchema>;
