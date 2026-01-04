// product/router.ts

import { ServerRoute } from "@hapi/hapi";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./handler";

const productRoutes: ServerRoute[] = [
  // CREATE PRODUCT
  {
    method: "POST",
    path: "/products",
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB
        allow: "multipart/form-data",
      },
    },
    handler: createProduct,
  },

  // GET ALL PRODUCTS
  {
    method: "GET",
    path: "/products",
    handler: getAllProducts,
  },

  // GET SINGLE PRODUCT
  {
    method: "GET",
    path: "/product",
    handler: getProductById,
  },

  // UPDATE PRODUCT
  {
    method: "PUT",
    path: "/product/{id}",
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 20 * 1024 * 1024, // 20MB
        allow: "multipart/form-data",
      },
    },
    handler: updateProduct,
  },
];

export default productRoutes;
