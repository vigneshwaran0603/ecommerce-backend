// models/Product.ts
import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default model("Product", productSchema);
