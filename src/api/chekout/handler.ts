import { Request, ResponseToolkit } from "@hapi/hapi";
import { createStripePaymentOperation, verifyStripePaymentOperation } from "../../operations/payment.operations";
// import {
//   createStripePaymentOperation,
//   verifyStripePaymentOperation,
// } from "../../operations/checkout.operation";

// Create Stripe Payment
export const createStripePaymentHandler = async (req: Request, h: ResponseToolkit) => {
  const { cartItems } = req.payload as { cartItems: { productId: string; quantity: number }[] };

  if (!cartItems || cartItems.length === 0)
    return h.response({ success: false, message: "Cart items required" }).code(400);

  try {
    const result = await createStripePaymentOperation(cartItems);
    return h.response({ success: true, payment: result }).code(200);
  } catch (error: any) {
    console.error("Stripe Create Error:", error);
    return h.response({ success: false, message: error.message }).code(500);
  }
};

// Verify Stripe Payment
export const verifyStripePaymentHandler = async (req: Request, h: ResponseToolkit) => {
  const { paymentIntentId } = req.payload as { paymentIntentId: string };

  if (!paymentIntentId)
    return h.response({ success: false, message: "PaymentIntentId required" }).code(400);

  try {
    const result = await verifyStripePaymentOperation(paymentIntentId);
    return h.response(result).code(result.success ? 200 : 400);
  } catch (error: any) {
    console.error("Stripe Verify Error:", error);
    return h.response({ success: false, message: error.message }).code(500);
  }
};