import { ServerRoute } from "@hapi/hapi";
import { addToCartHandler, getCartHandler, removeItemHandler } from "./handler";

const cartRoutes: ServerRoute[] = [
  {
  method: "POST",
  path: "/cart",
  handler: addToCartHandler,
},

  {
    method: "GET",
    path: "/cart",
    handler: getCartHandler,
  },
  {
    method: "DELETE",
    path: "/cart/{productId}",
    handler: removeItemHandler,
  },
];

export default cartRoutes;