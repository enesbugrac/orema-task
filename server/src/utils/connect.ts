import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

export const connect = async () => {
  const dbUri = config.get<string>("dbUri");

  return await mongoose
    .connect(dbUri)
    .then(() => {
      logger.info("MongoDB Live!!!");
    })
    .catch((err) => {
      logger.error("Error happened\n", err);
      process.exit(1);
    });
};
