import { z } from "zod";

export const loginSchema = z.object({
  
  email: z.email(),
  password: z.string().min(6, "password is requied")
});

export type RegisterInput = z.infer<typeof loginSchema>