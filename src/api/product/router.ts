// product/router.ts

import {ServerRoute} from "@hapi/hapi";
import { createProduct, getAllProducts, getProductById, updateProduct } from "./handler";


const productRoutes:ServerRoute[]=[
    
        // method:"POST",
        // path:"/product",
        // handler: createProduct,
        {
    method: "POST",
    path: "/products",
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024,
        allow: "multipart/form-data",
      }
    },
    handler: createProduct,
  },

  {
    method:"GET",
    path:"/products",
    handler: getAllProducts,
  },

  // get by single product

  {
    method:"GET",
    path:"/product",
    handler: getProductById,
  },

  // update a single product
  {
    method:"PUT",
    path:"/product/{id}",
     options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 20 * 1024 * 1024,
        allow: "multipart/form-data",
      }
    },
    handler: updateProduct,
  }
    
];
export default productRoutes;