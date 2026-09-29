import { z } from "zod";

export const createAccountValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  type: z.enum([
    "bank",
    "cash",
    "creditCard",
    "savings",
    "investment",
    "others",
  ]),

  balance: z.number().default(0),

  currency: z.string().length(3).default("INR"),

  institution: z.string().trim().max(100).optional(),

  last4: z
    .string()
    .regex(/^\d{4}$/, "Last 4 digits must contain exactly 4 numbers")
    .optional(),

});

export const updateAccountValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .optional(),

  type: z
    .enum(["bank", "cash", "creditCard", "savings", "investment", "others"])
    .optional(),

  balance: z.number().default(0).optional(),

  currency: z.string().length(3).default("INR").optional(),

  institution: z.string().trim().max(100).optional(),

  last4: z
    .string()
    .regex(/^\d{4}$/, "Last 4 digits must contain exactly 4 numbers")
    .optional(),
});
