// product.validation.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3),
  price: z.number(),
  image: z.string(),
  category: z.string(),
  description:z.string(),
});

export type ProductInput = z.infer<typeof productSchema>