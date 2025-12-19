import Stripe from "stripe";
import { Cart } from "../models/Cart";

import { Types } from "mongoose";
import { Order } from "../models/Payment";

const stripe = new Stripe(process.env.STRIPE_SECRET!); // removed apiVersion

export const createStripePaymentOperation = async (
  cartItems: { productId: string; quantity: number }[]
) => {
  if (!cartItems || cartItems.length === 0) throw new Error("No items to checkout");

  const itemsForOrder = [];
  let totalAmount = 0;

  for (const item of cartItems) {
    const objectId = new Types.ObjectId(item.productId);
    const cartItem = await Cart.findOne({ productId: objectId }).populate<any>("productId");
    if (!cartItem) throw new Error("Cart item not found");

    const product = cartItem.productId;
    const quantity = item.quantity;

    itemsForOrder.push({ productId: product._id, quantity });
    totalAmount += product.price * quantity;
  }

  const order = await Order.create({
    items: itemsForOrder,
    totalAmount,
    status: "Pending",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    metadata: { orderId: order._id.toString() },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    orderId: order._id,
  };
};


// Verify Stripe Payment
export const verifyStripePaymentOperation = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    return { success: false, message: "Payment failed or incomplete" };
  }

  const orderId = paymentIntent.metadata.orderId;
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // Update order status
  order.status = "Paid";
  await order.save();

  // Remove cart items after successful payment
  for (const item of order.items) {
    await Cart.findOneAndDelete({ productId: item.productId });
  }

  return { success: true, message: "Payment successful", order };
};