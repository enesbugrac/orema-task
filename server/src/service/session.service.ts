import { FilterQuery, UpdateQuery } from "mongoose";
import { get } from "lodash";
import Session, { SessionDoc } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt";
import { findUser } from "./user.service";
import config from "config";

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
};
export const getSession = async (query: FilterQuery<SessionDoc>) => {
  return Session.find(query).lean();
};
export const updateSession = async (
  query: FilterQuery<SessionDoc>,
  update: UpdateQuery<SessionDoc>
) => {
  return Session.updateOne(query, update);
};
export const reCreateAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = verifyJwt(refreshToken);
  if (!decoded || !get(decoded, "session")) return null;

  const session = await Session.findById(get(decoded, "session"));

  if (!session || !session.valid) return null;

  const user = await findUser({ _id: session.user });

  if (!user) return null;

  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTimeToLive") }
  );
  return accessToken;
};
