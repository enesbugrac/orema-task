import { number, object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name required!",
    }),
    password: string({
      required_error: "Password required!",
    }).min(8, "Password short(min 8)!"),
    confirmPassword: string({
      required_error: "Confirm Password required!",
    }),
    email: string({
      required_error: "Email required!",
    }).email("Email not valid!"),
    cart: object({
      product_id: string(),
      quantity: number(),
    })
      .partial()
      .array(),
    history: object({
      product_id: string(),
      quantity: number(),
      date: number(),
      price: number(),
      name: string(),
    }).array(),
  }).refine((userData) => userData.password === userData.confirmPassword, {
    message: "Confirm password not match!",
    path: ["confirmationPassword"],
  }),
});
export const addToCartSchema = object({
  query: object({
    productId: string(),
  }),
});
export const createHistorySchema = object({
  body: object({
    payment_id: string(),
    history: object({
      product_id: string(),
      quantity: number(),
      date: number(),
      price: number(),
      name: string(),
    })
      .partial()
      .array(),
  }),
});
export const getCartSchema = object({
  query: object({
    user_id: string(),
  }),
});

export const removeFromCartSchema = object({
  query: object({
    product_id: string(),
  }),
});
export const getClientSecretSchema = object({
  query: object({
    total: string(),
  }),
});
export type CreateUserType = Omit<
  TypeOf<typeof createUserSchema>,
  "body.confirmPassword"
>;
export type AddToCartType = TypeOf<typeof addToCartSchema>;
export type GetCartType = TypeOf<typeof getCartSchema>;
export type RemoveFromCartType = TypeOf<typeof removeFromCartSchema>;
export type GetClientSecretType = TypeOf<typeof getClientSecretSchema>;
export type CreateHistoryType = TypeOf<typeof createHistorySchema>;
