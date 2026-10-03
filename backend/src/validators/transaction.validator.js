import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const baseTransactionSchema = {
  name: z
    .string()
    .trim()
    .min(2, "Name should be at least 2 characters")
    .max(20, "Name shouldn't be more than 20 characters"),
  
  amount: z
    .number({
      error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Description is too long"),

  date: z.coerce
    .date({
      error: "Invalid date",
    })
    .optional()
    .default(() => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      return `${year}-${month}-${day}`;
    }),

  notes: z
    .string()
    .trim()
    .max(500, "Notes are too long")
    .optional()
    .or(z.literal("")),
};

export const createTransactionSchema = z.discriminatedUnion("type", [
  // Income
  z.object({
    type: z.literal("income"),

    account: objectId,
    category: objectId,

    ...baseTransactionSchema,
  }),

  // Expense
  z.object({
    type: z.literal("expense"),

    account: objectId,
    category: objectId,

    ...baseTransactionSchema,
  }),

  // Transfer
  z.object({
    type: z.literal("transfer"),

    fromAccountId: objectId,
    toAccountId: objectId,

    ...baseTransactionSchema,
  }),
]);
