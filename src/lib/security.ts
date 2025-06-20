import DOMPurify from "dompurify";
import { z } from "zod";

// Enhanced password validation schema
export const strongPasswordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .max(128, "Password cannot exceed 128 characters");

// Enhanced email validation
export const secureEmailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email must be at least 5 characters")
  .max(254, "Email cannot exceed 254 characters")
  .refine((email) => {
    // Additional email security checks
    const domain = email.split("@")[1];
    return domain && domain.length > 1 && !domain.includes("..");
  }, "Invalid email format");

// Name validation
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(50, "Name cannot exceed 50 characters")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Name can only contain letters, spaces, apostrophes, and hyphens",
  );

// Phone validation
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
  .max(20, "Phone number cannot exceed 20 characters");

// Text input sanitization
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
};

// Safe HTML content sanitization (for rich text)
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ol", "ul", "li"],
    ALLOWED_ATTR: [],
  });
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> =
    new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 900000,
  ) {} // 15 minutes

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return 0;
    return Math.max(0, attempt.resetTime - Date.now());
  }
}

// Input validation helpers
export const validateAndSanitize = {
  email: (email: string) => {
    const sanitized = sanitizeInput(email.toLowerCase().trim());
    return secureEmailSchema.parse(sanitized);
  },

  password: (password: string) => {
    return strongPasswordSchema.parse(password);
  },

  name: (name: string) => {
    const sanitized = sanitizeInput(name);
    return nameSchema.parse(sanitized);
  },

  phone: (phone: string) => {
    const sanitized = sanitizeInput(phone.replace(/\s/g, ""));
    return phoneSchema.parse(sanitized);
  },

  text: (text: string, maxLength: number = 1000) => {
    const sanitized = sanitizeInput(text);
    if (sanitized.length > maxLength) {
      throw new Error(`Text cannot exceed ${maxLength} characters`);
    }
    return sanitized;
  },
};
