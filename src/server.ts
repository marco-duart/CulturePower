import express from "express";
import { authRoutes } from "./auth/auth-routes";
import { userRoutes } from "./users/user-routes";
import { adminRoutes } from "./admins/admin-routes";
import { productRoutes } from "./products/product-routes";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")));

app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(productRoutes);

export { app };
