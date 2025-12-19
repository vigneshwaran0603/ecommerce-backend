import { z } from "zod";

export const adminRegisterSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6)
});

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>