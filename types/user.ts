import * as z from "zod";

// Signin schema - only email and password required
export const signInSchema = z.object({
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

// Signup schema - all fields required
export const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  experienceYears: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience seems too high"),
  interests: z.string().min(1, "At least one interest is required"),
});

// Combined schema for backward compatibility
export const authSchema = signInSchema;

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  experienceYears: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience seems too high"),
  interests: z.string().min(1, "At least one interest is required"),
});

export type AuthFormData = z.infer<typeof signInSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
