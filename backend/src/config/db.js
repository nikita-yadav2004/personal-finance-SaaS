import mongoose from "mongoose";

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connect to DB.");
  } catch (error) {
    console.log("MongoDB error:", error);
  }
}

export default connectToDB;
