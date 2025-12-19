import { z } from "zod";

export const checkoutSchema = z.object({});

export type CheckoutInput = z.infer<typeof checkoutSchema>;