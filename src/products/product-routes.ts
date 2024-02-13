import { Router } from "express"
import { ProductModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"
import { createProductMiddleware } from "../shared/middlewares/productMiddleware"
import { authorizeAdminMiddleware } from "../shared/middlewares/authorizeAdminMiddleware"

const { controller } = ProductModule.make()

const productRoutes = Router()

productRoutes.post("/product", logMiddleware, createProductMiddleware, authorizeAdminMiddleware, controller.create.bind(controller));
productRoutes.get("/product/:id", logMiddleware, controller.getById.bind(controller));
productRoutes.get("/product", logMiddleware, controller.getAll.bind(controller));
productRoutes.patch("/product/:id", logMiddleware, authorizeAdminMiddleware, controller.update.bind(controller))
productRoutes.delete("/product/:id", logMiddleware, authorizeAdminMiddleware, controller.delete.bind(controller))

export { productRoutes }