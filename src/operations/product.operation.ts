// operations/product.operation.ts
import Product from "../models/Product";
import { ProductInput } from "../shared/validation/product.validation";

// -------------------- CREATE PRODUCT --------------------
export const createProductOperation = async (data: ProductInput) => {
  // Rule 1: Check duplicate product name
  const existing = await Product.findOne({ name: data.name });
  if (existing) {
    throw new Error("Product with this name already exists");
  }

  // Rule 2: Minimum price validation
  if (data.price < 1) {
    throw new Error("Price must be at least 1");
  }

  // Rule 3: Save product (Cloudinary image URL already included)
  const product = await Product.create(data);
  return product;
};

// -------------------- GET ALL PRODUCTS --------------------
export const getAllProductOperation = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

// -------------------- GET PRODUCT BY ID --------------------
export const getProductByIdOperation = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

// -------------------- UPDATE PRODUCT --------------------
export const updateProductOperation = async (id: string, data: any) => {
  // Prevent duplicate product names
  if (data.name) {
    const exists = await Product.findOne({
      name: data.name,
      _id: { $ne: id },
    });

    if (exists) {
      throw new Error("Another product with this name already exists");
    }
  }

  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new Error("Product not found");
  }

  return updated;
};
