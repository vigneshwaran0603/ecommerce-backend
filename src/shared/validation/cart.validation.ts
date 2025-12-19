// cart.validation.ts
import { z } from "zod";

export const addCartSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});