import { Express, Request, Response } from "express";
import {
  createProductHandler,
  deleteProductHandler,
  getAllProductHandler,
  getMultipleProductHandler,
  getProductHandler,
  updateProductHandler,
} from "./controller/product.controller";
import {
  createUserSessionHandler,
  deleteUserSessionHandler,
  getUserSessionHandler,
} from "./controller/session.controller";
import {
  addToCartHandler,
  createHistoryHandler,
  createUserHandler,
  getCartHandler,
  getClientSecretHandler,
  getHistoryHandler,
  removeFromCartHandler,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import { validateRequest } from "./middleware/validateRequest";
import {
  createProductSchema,
  deleteProductSchema,
  getAllProductSchema,
  getMultipleProductsSchema,
  getProductSchema,
  updateProductSchema,
} from "./schema/product.schema";
import { createSessionSchema } from "./schema/session.schema";
import {
  addToCartSchema,
  createHistorySchema,
  createUserSchema,
  getCartSchema,
  getClientSecretSchema,
  removeFromCartSchema,
} from "./schema/user.schema";

export const routes = (app: Express) => {
  app.get("/api", (request: Request, response: Response) => {
    response.sendStatus(200);
  });
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);
  app.post(
    "/api/sessions",
    validateRequest(createSessionSchema),
    createUserSessionHandler
  );
  app.get("/api/sessions", requireUser, getUserSessionHandler);
  app.delete("/api/sessions", requireUser, deleteUserSessionHandler);
  app.get(
    "/api/users/addtocart",
    [requireUser, validateRequest(addToCartSchema)],
    addToCartHandler
  );
  app.get(
    "/api/users/clientsecret",
    [requireUser, validateRequest(getClientSecretSchema)],
    getClientSecretHandler
  );
  app.get("/api/users/history", requireUser, getHistoryHandler);
  app.post(
    "/api/users/createhistory",
    [requireUser, validateRequest(createHistorySchema)],
    createHistoryHandler
  );
  app.get("/api/users/getusercart", requireUser, getCartHandler);
  app.get(
    "/api/users/removefromcart",
    [requireUser, validateRequest(removeFromCartSchema)],
    removeFromCartHandler
  );

  app.post(
    "/api/products",
    [requireUser, validateRequest(createProductSchema)],
    createProductHandler
  );

  app.put(
    "/api/products/:productId",
    [requireUser, validateRequest(updateProductSchema)],
    updateProductHandler
  );
  app.get(
    "/api/products/allproducts",
    validateRequest(getAllProductSchema),
    getAllProductHandler
  );
  app.get(
    "/api/products/multiple",
    validateRequest(getMultipleProductsSchema),
    getMultipleProductHandler
  );
  app.get(
    "/api/products/:productId",
    validateRequest(getProductSchema),
    getProductHandler
  );

  app.delete(
    "/api/products/:productId",
    [requireUser, validateRequest(deleteProductSchema)],
    deleteProductHandler
  );
};
