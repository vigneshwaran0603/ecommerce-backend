import { z } from "zod";

export const adminLoginSchema = z.object({
  
  email: z.email(),
  password: z.string().min(6, "password is requied")
});

export type AdminRegisterInput = z.infer<typeof adminLoginSchema>