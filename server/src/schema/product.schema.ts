import { object, string, TypeOf, number, array, any } from "zod";

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    type: string({
      required_error: "Type is required",
    }),
    image: string({
      required_error: "image is required",
    }),
    description: string({
      required_error: "Description is required",
    }).min(120, "Description should be at least 120 characters long"),
    price: number({
      required_error: "Price is required",
    }),
  }),
};
const filterPayload = {
  query: object({
    skip: string(),
    limit: string(),
    type: any(),
    price: string().array(),
    searchterm: string(),
  }).partial(),
};
const params = {
  params: object({
    productId: string({
      required_error: "productId is required",
    }),
  }),
};
const query = {
  query: object({
    productId: any(),
  }),
};
export const createProductSchema = object({
  ...payload,
});

export const updateProductSchema = object({
  ...payload,
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export const getProductSchema = object({
  ...params,
});
export const getMultipleProductsSchema = object({
  ...query,
});

export const getAllProductSchema = object({
  ...filterPayload,
});

export type CreateProductType = TypeOf<typeof createProductSchema>;
export type UpdateProductType = TypeOf<typeof updateProductSchema>;
export type GetProductType = TypeOf<typeof getProductSchema>;
export type GetMultipleProductsType = TypeOf<typeof getMultipleProductsSchema>;
export type DeleteProductType = TypeOf<typeof deleteProductSchema>;
export type GetAllProductType = TypeOf<typeof getAllProductSchema>;
