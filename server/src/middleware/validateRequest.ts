import { Express, Request, Response, NextFunction, query } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: request.body,
        params: request.params,
        query: request.query,
      });
      next();
    } catch (error: any) {
      response.status(400).send(error.errors);
    }
  };
