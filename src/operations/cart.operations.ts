// operation
import { Types } from "mongoose";
import { Cart } from "../models/Cart";
import Product from "../models/Product";


interface AddToCartInput {
  productId: string;
  quantity: number;
}

// ADD TO CART
export const addToCartOperation = async (data: AddToCartInput) => {
  const { productId, quantity } = data;

  // Ensure product exists
  const product = await Product.findById(productId);
  if (!product) return { success: false, message: "Product not found" };

  // Check if the product is already in the cart
  const existing = await Cart.findOne({ productId: new Types.ObjectId(productId) });

  if (existing) {
    existing.quantity += quantity;
    await existing.save();
    return { success: true, message: "Cart updated", cart: existing };
  }

  // If product is new, create cart item
  const cart = await Cart.create({ productId: new Types.ObjectId(productId), quantity });
  return { success: true, message: "Item added to cart", cart };
};

// GET CART
export const getCartOperation = async () => {
  const cartItems = await Cart.find().populate("productId");
  return { success: true, cart: cartItems };
};

// REMOVE ITEM
export const removeItemOperation = async (productId: string) => {
  const deleted = await Cart.findOneAndDelete({ productId: new Types.ObjectId(productId) });
  if (!deleted) return { success: false, message: "Product not found in cart" };
  return { success: true, message: "Item removed from cart" };
};