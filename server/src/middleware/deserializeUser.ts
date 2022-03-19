import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reCreateAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt";
export const deserializeUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const accessToken = get(request, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );
  const refreshToken = get(request, "headers.x-refresh");
  if (!accessToken) return next();
  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    response.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessT = await reCreateAccessToken({ refreshToken });
    if (newAccessT) {
      response.setHeader("x-access-token", newAccessT);
      const result = verifyJwt(newAccessT);
      response.locals.user = result.decoded;
      return next();
    }
  }
};
