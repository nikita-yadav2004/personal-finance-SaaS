import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
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
        values: [
          "bank",
          "cash",
          "creditCard",
          "savings",
          "investment",
          "others",
        ],
      },
    },
    institution: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    last4: {
      type: String,
      match: /^\d{4}$/,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const accountModel = mongoose.model("account", accountSchema);

export default accountModel;
