import { DocumentDefinition, ModifyResult } from "mongoose";
import { Request, Response } from "express";
import { FilterQuery, UpdateQuery } from "mongoose";
import User, { HistoryDoc, UserDoc } from "../models/user.model";
import logger from "../utils/logger";
import { omit } from "lodash";
import Product, { ProductDoc } from "../models/product.model";
import { stripe } from "../app";

export const createUser = async (
  input: DocumentDefinition<
    Omit<
      UserDoc,
      "createdAt" | "updatedAt" | "comparePassword" | "cart" | "history"
    >
  >
) => {
  try {
    return await User.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
};
export const createHistory = async (input: any, user: UserDoc) => {
  let history: any = [];
  input.history.forEach((item: any) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      product_id: item._id,
      price: item.price,
      quantity: item.quantity,
      payment_id: input.payment_id,
    });
  });
  console.log(history);
  return User.findOneAndUpdate(
    { _id: user._id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true }
  );
};
export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), ["password"]);
};

export const findUser = async (query: FilterQuery<UserDoc>) => {
  return User.findOne(query);
};
export const removeFromCart = async (
  query: FilterQuery<ProductDoc>,
  user: UserDoc
) => {
  User.findOneAndUpdate(
    { _id: user._id },
    {
      $pull: { cart: { product_id: query.product_id } },
    },
    { new: true },
    (err: any, userInfo: any) => {
      return userInfo;
    }
  );
};
export const getClientSecret = async (query: FilterQuery<ProductDoc>) => {
  const total = parseInt(query.total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });
  return {
    clientSecret: paymentIntent.client_secret,
  };
};

export const addToCart = async (
  query: FilterQuery<ProductDoc>,
  user: UserDoc
) => {
  User.findOne({ _id: user._id }, async (err: any, userInfo: UserDoc) => {
    let duplicate = false;
    userInfo.cart.forEach((item: any) => {
      if (item.product_id == query.productId) {
        duplicate = true;
      }
    });
    if (duplicate) {
      let newUserData = await User.findOneAndUpdate(
        { _id: user._id, "cart.product_id": query.productId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true, rawResult: true }
      );
    } else {
      let newUserData = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $push: {
            cart: {
              product_id: query.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true, rawResult: true }
      );
      return newUserData.value;
    }
  });
};
