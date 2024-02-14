import { Request, Response } from "express";
import ProductService from "./product-service";
import { UpdateProductDTO, CreateProductDTO } from "./product-dto";
import { CustomError } from "../shared/errors/CustomError";
import { StatusCode } from "../utils/enums/statusCode";

class ProductController {
  constructor(private service: ProductService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateProductDTO = req.body;
      const photoPath = req.file?.path;

      if (photoPath) {
        const fileName = photoPath.split("\\").pop();
        data.photo = `${req.protocol}://${req.get("host")}/${fileName}`;
      }

      const createdProduct = await this.service.create(data);
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const product = await this.service.getById(id);

      if (product) {
        res.status(200).json(product);
      } else {
        throw new CustomError("Product not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const productArray = await this.service.getAll();
      res.status(200).json(productArray);
    } catch (error) {
      console.error("Error fetching all products:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data: UpdateProductDTO = req.body;
      const photoPath = req.file?.path;

      if (photoPath) {
        const fileName = photoPath.split("\\").pop();
        data.photo = `${req.protocol}://${req.get("host")}/${fileName}`;
      }

      const updatedProduct = await this.service.update(id, data);

      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        throw new CustomError("Product not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedProduct = await this.service.softDelete(id);

      if (deletedProduct) {
        res.status(200).json(deletedProduct);
      } else {
        throw new CustomError("Product not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }
}

export default ProductController;
