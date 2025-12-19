// src/routes/payment.routes.ts
import { ServerRoute } from "@hapi/hapi";
import {
  createStripePaymentHandler,
  verifyStripePaymentHandler,
} from "./handler";

export const paymentRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/payment/create",
    handler: createStripePaymentHandler,
  },
  {
    method: "POST",
    path: "/payment/verify",
    handler: verifyStripePaymentHandler,
  },
];