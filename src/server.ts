

import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
dotenv.config();
import registerRoutes from "./api/auth/register/router";
import loginRoutes from "./api/auth/login/router";
import { connectDB } from "./database/mongo";
import productRoutes from "./api/product/router";
import adminRegisterRoutes from "./api/admin/register/router";
import adminLoginRoutes from "./api/admin/login/router";
import Inert from "@hapi/inert";
import cartRoutes from "./api/cart/router";
import { paymentRoutes } from "./api/chekout/router";



const init = async () => {
  await connectDB();

 
  const server = Hapi.server({
  port: Number(process.env.PORT) || 5000,
  host: "0.0.0.0", // ✅ REQUIRED for Render
  routes: {
    cors: {
      origin: ["*"], // temporary (later restrict to Vercel domain)
      additionalHeaders: ["Accept", "Content-Type", "Authorization"],
      credentials: true,
    },
  },
});


  await server.register(Inert);

  // Serve uploaded files
  server.route({
    method: "GET",
    path: "/uploads/{param*}",
    handler: {
      directory: {
        path: "uploads",
        listing: false,
      },
    },
  });

  // Register both routes
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
  console.log(err);
  process.exit(1);
});

init();