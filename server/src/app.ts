import express from "express";
import config from "config";
import { connect } from "./utils/connect";
import logger from "./utils/logger";
import { routes } from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
import cors from "cors";
import Stripe from "stripe";
export const stripe = new Stripe(
  "sk_test_51HTozRFhgBIvpBlsmkvnGDOzuwCveNLt7CffF3B24m07s2Kv4Mu91hp8Ggn1459ZCbCA2hlERihOLPrOOFX2Vra0000h8YzpSt",
  { apiVersion: "2020-08-27" }
);
const port = config.get<number>("port");

const app = express();

app.use(cors());
app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`Live at http://localhost:${port}`);
  await connect();
  routes(app);
});
