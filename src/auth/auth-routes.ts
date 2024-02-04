import { Router } from "express";
import { AuthModule } from ".";
import { authValidateMiddleware } from "../shared/middlewares/authMiddleware";

const { adminLoginController } = AuthModule.adminLogin()
const { userLoginController } = AuthModule.userLogin()

const authRoutes = Router()

authRoutes.post("/admin/login", authValidateMiddleware, adminLoginController.login.bind(adminLoginController))
authRoutes.post("/user/login", authValidateMiddleware, userLoginController.login.bind(userLoginController))

export { authRoutes }