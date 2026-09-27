import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    avatar: {
      type: String,
    },
    currency: {
      type: String,
      enum: {
        values: ["INR", "USD"],
      },
      default: "INR",
    },
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
      },
    ],
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
      },
    ],
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
