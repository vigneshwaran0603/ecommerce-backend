// models   Cart.ts
// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema(
//   {
//     productId: { type: String, required: true }, 
//     quantity: { type: Number, required: true },
//   }
// );

// export const Cart = mongoose.model("Cart", cartSchema);


// Carts.ts

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);