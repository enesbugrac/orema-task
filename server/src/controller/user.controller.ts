import { Request, Response } from "express";
import { omit } from "lodash";
import {
  AddToCartType,
  CreateHistoryType,
  CreateUserType,
  GetCartType,
  GetClientSecretType,
  RemoveFromCartType,
} from "../schema/user.schema";
import {
  addToCart,
  createHistory,
  createUser,
  findUser,
  getClientSecret,
  removeFromCart,
} from "../service/user.service";
import logger from "../utils/logger";

export const createUserHandler = async (
  request: Request<{}, {}, CreateUserType["body"]>,
  response: Response
) => {
  try {
    const userData = await createUser(request.body);
    return response.status(200).send(omit(userData.toJSON(), ["password"]));
  } catch (error: any) {
    logger.error(error);
    return response.status(409).send(error.message);
  }
};
export const addToCartHandler = async (
  request: Request<{}, AddToCartType["query"], {}>,
  response: Response
) => {
  const user = response.locals.user;
  const newCart = await addToCart(request.query, user);
  return response.status(200).send({ success: true });
};
export const getCartHandler = async (request: Request, response: Response) => {
  const user_id = response.locals.user._id;
  const user = await findUser({ _id: user_id });
  return response.status(200).send(user?.cart);
};
export const removeFromCartHandler = async (
  request: Request<{}, RemoveFromCartType["query"], {}>,
  response: Response
) => {
  const user = response.locals.user;
  const newCart = await removeFromCart(request.query, user);
  console.log(newCart);
  return response.status(200).send({ success: true });
};
export const getClientSecretHandler = async (
  request: Request<{}, GetClientSecretType["query"], {}>,
  response: Response
) => {
  const clientSecret = await getClientSecret(request.query);
  return response.status(200).send(clientSecret);
};
export const getHistoryHandler = async (
  request: Request,
  response: Response
) => {
  const user_id = response.locals.user;
  const user = await findUser({ _id: user_id });
  return response.status(200).send(user?.history);
};
export const createHistoryHandler = async (
  request: Request<{}, {}, CreateHistoryType["body"]>,
  response: Response
) => {
  const user = response.locals.user;
  const newUserData = await createHistory(request.body, user);
  console.log(newUserData);
  return response.status(200).send(newUserData);
};
