import { Router } from "express"
import { UserModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"
import { authorizationMiddleware } from "../shared/middlewares/authenticateUserMiddleware"

const { controller } = UserModule.make()

const userRoutes = Router()

userRoutes.post("/user", logMiddleware, controller.create.bind(controller));
userRoutes.get("/user/:id", logMiddleware, authorizationMiddleware, controller.getById.bind(controller));
userRoutes.get("/user", logMiddleware, authorizationMiddleware, controller.getAll.bind(controller));
userRoutes.patch("/user/:id", logMiddleware, authorizationMiddleware, controller.update.bind(controller))
userRoutes.delete("/user/:id", logMiddleware, authorizationMiddleware, controller.delete.bind(controller))

export { userRoutes }