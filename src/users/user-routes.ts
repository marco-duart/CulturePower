import { Router } from "express"
import { UserModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"
import { authenticateUserMiddleware } from "../shared/middlewares/authenticateUserMiddleware"
import { createUserMiddleware } from "../shared/middlewares/userMiddleware"

const { controller } = UserModule.make()

const userRoutes = Router()

userRoutes.post("/user", logMiddleware, createUserMiddleware, controller.create.bind(controller));
userRoutes.get("/user/:id", logMiddleware, controller.getById.bind(controller));
userRoutes.get("/user", logMiddleware, controller.getAll.bind(controller));
userRoutes.patch("/user/:id", logMiddleware, controller.update.bind(controller))
userRoutes.delete("/user/:id", logMiddleware, controller.delete.bind(controller))
userRoutes.post("/user/buy-product/:productId", logMiddleware, authenticateUserMiddleware, controller.buyProduct.bind(controller));
userRoutes.post("/user/add-to-favorites/:productId", logMiddleware, authenticateUserMiddleware, controller.addToFavorites.bind(controller));

export { userRoutes }