import { Router } from "express";
import { ProductModule } from "./index";
import { logMiddleware } from "../shared/middlewares/logMiddleware";
import { createProductMiddleware } from "../shared/middlewares/productMiddleware";
import { authorizeAdminMiddleware } from "../shared/middlewares/authorizeAdminMiddleware";
import { authenticateUserMiddleware } from "../shared/middlewares/authenticateUserMiddleware";
import uploadMiddleware from "../shared/middlewares/uploadMiddleware";

const { controller } = ProductModule.make();

const productRoutes = Router();

productRoutes.post(
  "/product",
  logMiddleware,
  authorizeAdminMiddleware,
  uploadMiddleware.single("photo"),
  controller.create.bind(controller)
);
productRoutes.get(
  "/product/:id",
  logMiddleware,
  authenticateUserMiddleware,
  controller.getById.bind(controller)
);
productRoutes.get(
  "/product",
  logMiddleware,
  authenticateUserMiddleware,
  controller.getAll.bind(controller)
);
productRoutes.patch(
  "/product/:id",
  logMiddleware,
  authorizeAdminMiddleware,
  uploadMiddleware.single("photo"),
  controller.update.bind(controller)
);
productRoutes.delete(
  "/product/:id",
  logMiddleware,
  authorizeAdminMiddleware,
  controller.delete.bind(controller)
);

export { productRoutes };
