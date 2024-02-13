import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  jewelsAmount: number;
  products: string[];
  favoriteProducts: string[];
  photo: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    jewelsAmount: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, refPath: "Product" }],
    favoriteProducts: [{ type: Schema.Types.ObjectId, refPath: "Product" }],
    photo: { type: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
