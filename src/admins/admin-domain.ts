import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Admin = model("Admin", AdminSchema);
