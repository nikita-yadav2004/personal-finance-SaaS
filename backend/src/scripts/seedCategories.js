import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "../models/category.model.js";
import { defaultCategories } from "../data/defaultCategories.js";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await Category.deleteMany({
      user: null,
      isDefault: true,
    });

    await Category.insertMany(
      defaultCategories.map((category) => ({
        ...category,
        user: null,
        isDefault: true,
      })),
    );

    console.log("Default categories inserted");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedCategories();
