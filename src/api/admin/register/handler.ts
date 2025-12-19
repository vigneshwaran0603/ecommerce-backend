import { Request, ResponseToolkit } from "@hapi/hapi";
import { registerSchema } from "../../../shared/validation/user.validation";
import { adminRegisterOperation } from "../../../operations/admin.operations";

export const adminRegisterHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const parsed = registerSchema.safeParse(req.payload);

    if (!parsed.success) {
      return h.response({ success: false, errors: parsed.error }).code(400);
    }

    const result = await adminRegisterOperation(parsed.data);
    return h.response(result).code(result.success ? 201 : 400);

  } catch (err: any) {
    console.log("Register API Error:", err);
    return h.response({ success: false, error: err.message }).code(500);
  }
};

