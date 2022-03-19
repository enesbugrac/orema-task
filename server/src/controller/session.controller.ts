import { Request, Response } from "express";
import config from "config";
import {
  createSession,
  getSession,
  updateSession,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt";

export const createUserSessionHandler = async (
  request: Request,
  response: Response
) => {
  const user = await validatePassword(request.body);
  if (!user) {
    return response.status(401).send("Email or password invalid!");
  }
  const session = await createSession(
    user._id,
    request.get("user-agent") || ""
  );

  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTimeToLive") }
  );
  const refreshToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("refreshTokenTimeToLive") }
  );

  return response.send({ accessToken, refreshToken });
};

export const getUserSessionHandler = async (
  request: Request,
  response: Response
) => {
  const user_id = response.locals.user._id;
  const sessions = await getSession({ user: user_id, valid: true });
  return response.send(sessions);
};
export const deleteUserSessionHandler = async (
  request: Request,
  response: Response
) => {
  const sessionId = response.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return response.send({
    accessToken: null,
    refreshToken: null,
  });
};
