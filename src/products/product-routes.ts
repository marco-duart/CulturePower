import { Router } from "express"
import { ProductModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"
import { authorizationMiddleware } from "../shared/middlewares/authenticateUserMiddleware"

const { controller } = ProductModule.make()

const productRoutes = Router()

productRoutes.post("/product", logMiddleware, controller.create.bind(controller));
productRoutes.get("/product/:id", logMiddleware, authorizationMiddleware, controller.getById.bind(controller));
productRoutes.get("/product", logMiddleware, authorizationMiddleware, controller.getAll.bind(controller));
productRoutes.patch("/product/:id", logMiddleware, authorizationMiddleware, controller.update.bind(controller))
productRoutes.delete("/product/:id", logMiddleware, authorizationMiddleware, controller.delete.bind(controller))

export { productRoutes }