import { object, string, TypeOf, number } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email required!",
    }),
    password: string({
      required_error: "Password required!",
    }),
  }),
});
