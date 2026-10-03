import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: function () {
        return this.type !== "transfer";
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: function () {
        return this.type !== "transfer";
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["income", "expense", "transfer"],
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    fromAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: function () {
        return this.type === "transfer";
      },
    },

    toAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: function () {
        return this.type === "transfer";
      },
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;
