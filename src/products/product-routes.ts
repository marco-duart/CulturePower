import { Router } from "express"
import { ProductModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"
import { createProductMiddleware } from "../shared/middlewares/productMiddleware"

const { controller } = ProductModule.make()

const productRoutes = Router()

productRoutes.post("/product", logMiddleware, createProductMiddleware, controller.create.bind(controller));
productRoutes.get("/product/:id", logMiddleware, controller.getById.bind(controller));
productRoutes.get("/product", logMiddleware, controller.getAll.bind(controller));
productRoutes.patch("/product/:id", logMiddleware, controller.update.bind(controller))
productRoutes.delete("/product/:id", logMiddleware, controller.delete.bind(controller))

export { productRoutes }