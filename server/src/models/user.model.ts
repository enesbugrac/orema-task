import mongoose, { Document, Schema } from "mongoose";
import config from "config";
import bcrypt from "bcrypt";
import { ProductDoc } from "./product.model";

export interface UserDoc extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  cart: CartDoc[];
  history: HistoryDoc[];
  comparePassword(password: string): Promise<Boolean>;
}
export interface CartDoc extends Document {
  product_id: ProductDoc["_id"];
  quantity: number;
  date: number;
}
export interface HistoryDoc extends Document {
  payment_id: string;
  product_id: ProductDoc["_id"];
  quantity: number;
  dateOfPurchase: number;
  price: number;
  name: string;
}

const cartSchema = new Schema<CartDoc>(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    date: { type: Number, required: true },
  },
  { _id: false }
);
const historySchema = new Schema<HistoryDoc>(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    dateOfPurchase: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    payment_id: { type: String, required: true },
  },
  { _id: false }
);
const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    cart: {
      type: [cartSchema],
      default: [],
    },
    history: {
      type: [historySchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre<UserDoc>("save", async function (next) {
  let self = this as UserDoc;
  if (!self.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>("saltFactor"));
  const hash = await bcrypt.hashSync(self.password, salt);
  self.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<Boolean> {
  let self = this as UserDoc;
  return bcrypt.compare(password, self.password).catch((err) => false);
};

const User = mongoose.model<UserDoc>("User", userSchema);
export default User;
