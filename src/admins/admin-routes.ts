import { Router } from "express"
import { AdminModule } from "./index"
import { logMiddleware } from "../shared/middlewares/logMiddleware"
import { authorizationMiddleware } from "../shared/middlewares/authenticateUserMiddleware"

const { controller } = AdminModule.make()

const adminRoutes = Router()

adminRoutes.post("/admin", logMiddleware, controller.create.bind(controller));
adminRoutes.get("/admin/:id", logMiddleware, authorizationMiddleware, controller.getById.bind(controller));
adminRoutes.get("/admin", logMiddleware, authorizationMiddleware, controller.getAll.bind(controller));
adminRoutes.patch("/admin/:id", logMiddleware, authorizationMiddleware, controller.update.bind(controller))
adminRoutes.delete("/admin/:id", logMiddleware, authorizationMiddleware, controller.delete.bind(controller))

export { adminRoutes }