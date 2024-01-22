import { Router } from "express";
import { AuthModule } from ".";

const { adminLoginController } = AuthModule.adminLogin()
const { userLoginController } = AuthModule.userLogin()

const authRoutes = Router()

authRoutes.post("/admin/login", adminLoginController.login.bind(adminLoginController))
authRoutes.post("/user/login", userLoginController.login.bind(userLoginController))