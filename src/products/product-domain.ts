import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  value: number;
  amount: number;
  description: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Product = model("Product", ProductSchema);
