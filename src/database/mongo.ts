import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Missing mongo URI");

    await mongoose.connect(uri);
    console.log("MongoDB connected");

  } catch (err) {
    console.error("DB error:", err);
  }
};
