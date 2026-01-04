// shared/validation/product.validation.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters"),

  price: z
    .number()
    .min(1, "Price must be at least 1"),

  image: z
    .string()
    .url("Image must be a valid Cloudinary URL"),

  category: z
    .string()
    .min(2, "Category is required"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});

export type ProductInput = z.infer<typeof productSchema>;
