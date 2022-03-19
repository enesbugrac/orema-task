import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getMultipleProduct,
  getProduct,
  updateProduct,
} from "../service/product.service";
import {
  CreateProductType,
  DeleteProductType,
  GetAllProductType,
  GetMultipleProductsType,
  GetProductType,
  UpdateProductType,
} from "../schema/product.schema";

export const createProductHandler = async (
  request: Request<{}, {}, CreateProductType["body"]>,
  response: Response
) => {
  const userId = response.locals.user._id;

  const body = request.body;
  const product = await createProduct({ ...body, user: userId });

  return response.status(200).send(product);
};
export const updateProductHandler = async (
  request: Request<UpdateProductType["params"]>,
  response: Response
) => {
  const userId = response.locals.user._id;
  const productId = request.params.productId;
  const updateData = request.body;

  const product = await getProduct({ _id: productId });
  if (!product) {
    return response.sendStatus(404);
  }
  if (String(product.user) !== userId) {
    return response.sendStatus(403);
  }
  const updatedData = await updateProduct({ _id: productId }, updateData, {
    new: true,
  });
  return response.status(200).send(updatedData);
};
export const deleteProductHandler = async (
  request: Request<DeleteProductType["params"]>,
  response: Response
) => {
  const userId = response.locals.user._id;
  const productId = request.params.productId;

  const product = await getProduct({ _id: productId });
  if (!product) {
    return response.sendStatus(404);
  }
  if (String(product.user) !== userId) {
    return response.sendStatus(403);
  }
  await deleteProduct({ _id: productId });
  return response.sendStatus(200);
};
export const getProductHandler = async (
  request: Request<GetProductType["params"]>,
  response: Response
) => {
  const productId = request.params.productId;

  const product = await getProduct({ _id: productId });

  if (!product) {
    return response.sendStatus(404);
  }

  return response.status(200).send(product);
};
export const getAllProductHandler = async (
  request: Request<{}, GetAllProductType["query"], {}>,
  response: Response
) => {
  const product = await getAllProduct(request.query);
  return response.status(200).send(product);
};
export const getMultipleProductHandler = async (
  request: Request<{}, GetMultipleProductsType["query"], {}>,
  response: Response
) => {
  const product = await getMultipleProduct(request.query);
  return response.status(200).send(product);
};
