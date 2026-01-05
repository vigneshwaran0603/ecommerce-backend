import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
dotenv.config();

import registerRoutes from "./api/auth/register/router";
import loginRoutes from "./api/auth/login/router";
import { connectDB } from "./database/mongo";
import productRoutes from "./api/product/router";
import adminRegisterRoutes from "./api/admin/register/router";
import adminLoginRoutes from "./api/admin/login/router";
import cartRoutes from "./api/cart/router";
import { paymentRoutes } from "./api/chekout/router";

const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: Number(process.env.PORT) || 5000,
    host: "0.0.0.0", // REQUIRED for Render
    routes: {
      cors: {
        origin: ["https://ecommerce-frontend-dun-two.vercel.app"], // allow all (safe for testing)
        headers: [
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
        ],
        exposedHeaders: ["Authorization"],
        credentials: false, // IMPORTANT: must be false if origin is "*"
      },
    },
  });

  // Health check (VERY IMPORTANT for Render)
  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      return { status: "Backend is running 🚀" };
    },
  });

  // Register routes
  server.route(registerRoutes);
  server.route(loginRoutes);
  server.route(productRoutes);
  server.route(adminRegisterRoutes);
  server.route(adminLoginRoutes);
  server.route(cartRoutes);
  server.route(paymentRoutes);

  await server.start();
  console.log("Server running at:", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
