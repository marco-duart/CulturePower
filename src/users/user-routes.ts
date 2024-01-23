import { Router } from "express"
import { UserModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"
import { authorizeAdminMiddleware } from "../shared/middlewares/authorizeAdminMiddleware"

const { controller } = UserModule.make()

const userRoutes = Router()

userRoutes.post("/user", logMiddleware, controller.create.bind(controller));
userRoutes.get("/user/:id", logMiddleware, authorizeAdminMiddleware, controller.getById.bind(controller));
userRoutes.get("/user", logMiddleware, authorizeAdminMiddleware, controller.getAll.bind(controller));
userRoutes.patch("/user/:id", logMiddleware, authorizeAdminMiddleware, controller.update.bind(controller))
userRoutes.delete("/user/:id", logMiddleware, authorizeAdminMiddleware, controller.delete.bind(controller))

export { userRoutes }