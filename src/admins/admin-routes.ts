import { Router } from "express"
import { AdminModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"

const { controller } = AdminModule.make()

const adminRoutes = Router()

adminRoutes.post("/admin", logMiddleware, controller.create.bind(controller));
adminRoutes.get("/admin/:id", logMiddleware, controller.getById.bind(controller));
adminRoutes.get("/admin", logMiddleware, controller.getAll.bind(controller));
adminRoutes.patch("/admin/:id", logMiddleware, controller.update.bind(controller))
adminRoutes.delete("/admin/:id", logMiddleware, controller.delete.bind(controller))

export { adminRoutes }