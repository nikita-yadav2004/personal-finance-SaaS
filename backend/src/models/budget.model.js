import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { timestamps: true },
);

const budgetModel = mongoose.model("budget", budgetSchema);

export default budgetModel;
