import mongoose, { Document, Schema } from "mongoose";
import { UserDoc } from "./user.model";
export interface ProductDoc extends mongoose.Document {
  user: UserDoc["_id"];
  type: string;
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDoc>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

productSchema.index(
  {
    title: "text",
    description: "text",
  },
  {
    weights: {
      name: 5,
      description: 1,
    },
  }
);
const Product = mongoose.model<ProductDoc>("Product", productSchema);

export default Product;
