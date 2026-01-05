// product/router.ts
import { ServerRoute } from "@hapi/hapi";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./handler";

const productRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/products",
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        allow: "multipart/form-data",
        maxBytes: 10 * 1024 * 1024,
        timeout: false, // ✅ IMPORTANT (prevents 500 on Render)
      },
    },
    handler: createProduct,
  },

  {
    method: "GET",
    path: "/products",
    handler: getAllProducts,
  },

  {
    method: "GET",
    path: "/product",
    handler: getProductById,
  },

  {
    method: "PUT",
    path: "/product/{id}",
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        allow: "multipart/form-data",
        maxBytes: 20 * 1024 * 1024,
        timeout: false, // ✅ IMPORTANT
      },
    },
    handler: updateProduct,
  },
];

export default productRoutes;
