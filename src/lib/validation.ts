import { z } from "zod";
import {
  secureEmailSchema,
  strongPasswordSchema,
  nameSchema,
} from "./security";

// Updated login schema with stronger validation
export const loginSchema = z.object({
  email: secureEmailSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password cannot exceed 128 characters"),
});

// Updated signup schema with stronger validation
export const signupSchema = z
  .object({
    email: secureEmailSchema,
    password: strongPasswordSchema,
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Search validation
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query cannot be empty")
    .max(200, "Search query cannot exceed 200 characters")
    .regex(/^[a-zA-Z0-9\s\-_.@]+$/, "Search query contains invalid characters"),
});

// Profile update validation
export const profileUpdateSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),
  department: z
    .string()
    .max(100, "Department cannot exceed 100 characters")
    .optional(),
  position: z
    .string()
    .max(100, "Position cannot exceed 100 characters")
    .optional(),
  office_number: z
    .string()
    .max(20, "Office number cannot exceed 20 characters")
    .optional(),
});
