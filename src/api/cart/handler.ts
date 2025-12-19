
import { Request, ResponseToolkit } from "@hapi/hapi";
import { addCartSchema } from "../../shared/validation/cart.validation";
import {
  addToCartOperation,
  getCartOperation,
  removeItemOperation,
} from "../../operations/cart.operations";

export const addToCartHandler = async (req: Request, h: ResponseToolkit) => {
  const parsed = addCartSchema.safeParse(req.payload);

  if (!parsed.success) {
    console.log("Add Cart Validation Error:", parsed.error);
    return h.response({ success: false, errors: parsed.error }).code(400);
  }

  try {
    const result = await addToCartOperation(parsed.data);
    return h.response(result).code(result.success ? 201 : 400);
  } catch (err) {
    console.error("Add Cart Error:", err);
    return h.response({ success: false, message: "Internal server error" }).code(500);
  }
};

export const getCartHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const result = await getCartOperation();
    return h.response(result).code(200);
  } catch (err) {
    console.error("Get Cart Error:", err);
    return h.response({ success: false, message: "Internal server error" }).code(500);
  }
};

export const removeItemHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const productId = req.params.productId;
    const result = await removeItemOperation(productId);
    return h.response(result).code(result.success ? 200 : 400);
  } catch (err) {
    console.error("Remove Cart Error:", err);
    return h.response({ success: false, message: "Internal server error" }).code(500);
  }
};