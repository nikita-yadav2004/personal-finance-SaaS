import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const accountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Account name must be at least 2 characters")
    .max(50, "Account name is too long"),

  type: z.enum([
    "cash",
    "bank",
    "savings",
    "credit_card",
    "investment",
    "other",
  ]),

  balance: z
    .number({
      error: "Balance must be a number",
    })
    .min(0, "Balance cannot be negative"),

  currency: z.string().length(3, "Currency must be 3 characters"),

  institution: z
    .string()
    .trim()
    .max(100, "Institution name is too long")
    .optional(),

  last4: z
    .string()
    .regex(/^\d{4}$/, "Enter exactly 4 digits")
    .optional()
    .or(z.literal("")),
});

const defaultValues = {
  name: "",
  type: "bank",
  balance: 0,
  currency: "INR",
  institution: "",
  last4: "",
};

const AccountForm = ({
  mode = "create",
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues,
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name || "",
        type: initialData.type || "bank",
        balance: initialData.balance ?? 0,
        currency: initialData.currency || "INR",
        institution: initialData.institution || "",
        last4: initialData.last4 || "",
      });
    }
  }, [mode, initialData, reset]);

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-3 w-[90%] md:w-[50%] lg:w-[30%]"
    >
      {/* Account Name */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Account Name
        </label>

        <input
          id="name"
          type="text"
          placeholder="HDFC Bank"
          {...register("name")}
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Account Type */}
      <div>
        <label htmlFor="type" className="mb-1 block text-sm font-medium">
          Account Type
        </label>

        <select
          id="type"
          {...register("type")}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="bank">Bank Account</option>
          <option value="savings">Savings Account</option>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="investment">Investment</option>
          <option value="other">Other</option>
        </select>

        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Balance */}
      <div>
        <label htmlFor="balance" className="mb-1 block text-sm font-medium">
          Initial Balance
        </label>

        <input
          id="balance"
          type="number"
          step="0.01"
          {...register("balance", {
            valueAsNumber: true,
          })}
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.balance && (
          <p className="mt-1 text-sm text-red-500">{errors.balance.message}</p>
        )}
      </div>

      {/* Currency */}
      <div>
        <label htmlFor="currency" className="mb-1 block text-sm font-medium">
          Currency
        </label>

        <input
          id="currency"
          type="text"
          maxLength={3}
          {...register("currency")}
          className="w-full rounded-lg border px-3 py-2 uppercase"
        />

        {errors.currency && (
          <p className="mt-1 text-sm text-red-500">{errors.currency.message}</p>
        )}
      </div>

      {/* Institution */}
      <div>
        <label htmlFor="institution" className="mb-1 block text-sm font-medium">
          Institution
        </label>

        <input
          id="institution"
          type="text"
          placeholder="HDFC Bank"
          {...register("institution")}
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.institution && (
          <p className="mt-1 text-sm text-red-500">
            {errors.institution.message}
          </p>
        )}
      </div>

      {/* Last 4 digits */}
      <div>
        <label htmlFor="last4" className="mb-1 block text-sm font-medium">
          Last 4 Digits
        </label>

        <input
          id="last4"
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="4521"
          {...register("last4")}
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.last4 && (
          <p className="mt-1 text-sm text-red-500">{errors.last4.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Saving..."
            : mode === "edit"
              ? "Update Account"
              : "Create Account"}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
