import { Request, ResponseToolkit } from "@hapi/hapi";
import { adminLoginOperation } from "../../../operations/admin.operations";

export const adminLoginHandler = async (req: Request, h: ResponseToolkit) => {
  const { email, password } = req.payload as { email: string; password: string };

  try {
    const result = await adminLoginOperation({ email, password });
    return h.response(result).code(result.success ? 200 : 400);
  } catch (err) {
    console.error("Login error:", err);
    return h.response({ success: false, message: "Internal server error" }).code(500);
  }
};