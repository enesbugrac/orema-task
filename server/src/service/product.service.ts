import {
  FilterQuery,
  UpdateQuery,
  DocumentDefinition,
  QueryOptions,
} from "mongoose";
import { number } from "zod";
import Product, { ProductDoc } from "../models/product.model";

export const createProduct = async (
  data: DocumentDefinition<Omit<ProductDoc, "createdAt" | "updatedAt">>
) => {
  const product = await Product.create(data);
  return product.toJSON();
};
export const getAllProduct = async (query: FilterQuery<ProductDoc>) => {
  let order = query.order ? query.order : "desc";
  let sortBy = query.sortBy ? query.sortBy : "_id";
  let limit = query.limit ? parseInt(query.limit) : 100;
  let skip = parseInt(query.skip);
  let findArgs: { [key: string]: any } = {};
  if (query.type) {
    findArgs = {
      price: {
        $gte: query.price ? query.price[0] : 0,
        $lte: query.price ? query.price[1] : 15000000,
      },
      type: query.type,
    };
  } else {
    findArgs = {
      price: {
        $gte: query.price ? query.price[0] : 0,
        $lte: query.price ? query.price[1] : 15000000,
      },
    };
  }

  let term = query.searchterm;
  if (term) {
    return Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate("user")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);
  } else {
    return Product.find(findArgs)
      .populate("user")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);
  }
};
export const getProduct = async (query: FilterQuery<ProductDoc>) => {
  return Product.findOne(query);
};
export const getMultipleProduct = async (query: FilterQuery<ProductDoc>) => {
  return Product.find({
    _id: { $in: query.productId },
  }).lean();
};

export const updateProduct = async (
  query: FilterQuery<ProductDoc>,
  update: UpdateQuery<ProductDoc>,
  options: QueryOptions
) => {
  return Product.findOneAndUpdate(query, update, options);
};

export const deleteProduct = async (query: FilterQuery<ProductDoc>) => {
  const product = await Product.deleteOne(query);
  return product;
};
