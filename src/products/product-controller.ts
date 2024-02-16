import { Request, Response } from "express";
import ProductService from "./product-service";
import { UpdateProductDTO, CreateProductDTO } from "./product-dto";
import { CustomError } from "../shared/error/CustomError";
import { STATUS_CODE } from "../utils/enums/statusCode";
import { ERROR_LOG } from "../utils/enums/errorMessage";
import fs from "fs";

class ProductController {
  constructor(private service: ProductService) {}

  async create(req: Request, res: Response): Promise<void> {
    let photoPath: string | undefined;
    try {
      const data: CreateProductDTO = req.body;
      photoPath = req.file?.path;

      if (photoPath) {
        const fileName = photoPath.split("\\").pop();
        data.photo = `${req.protocol}://${req.get("host")}/${fileName}`;
      }

      const createdProduct = await this.service.create(data);
      res.status(STATUS_CODE.CREATED).json(createdProduct);
    } catch (error) {
      console.error(ERROR_LOG.CREATE_PRODUCT, error);
       
      if (photoPath) {
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.error(ERROR_LOG.DELETE_PREV_IMG, err);
          }
        });
      }

      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const product = await this.service.getById(id);

      if (product) {
        res.status(STATUS_CODE.OK).json(product);
      } else {
        console.log(ERROR_LOG.PRODUCT_NOT_FOUND)
        throw new CustomError(ERROR_LOG.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.FETCH_PRODUCT, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const productArray = await this.service.getAll();
      res.status(STATUS_CODE.OK).json(productArray);
    } catch (error) {
      console.error(ERROR_LOG.FETCH_PRODUCTS, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    let photoPath: string | undefined;
    try {
      const id: string = req.params.id;
      const data: UpdateProductDTO = req.body;
      photoPath = req.file?.path;

      if (photoPath) {
        const fileName = photoPath.split("\\").pop();
        data.photo = `${req.protocol}://${req.get("host")}/${fileName}`;
      }

      const updatedProduct = await this.service.update(id, data);

      if (updatedProduct) {
        res.status(STATUS_CODE.OK).json(updatedProduct);
      } else {
        console.log(ERROR_LOG.PRODUCT_NOT_FOUND)
        throw new CustomError(ERROR_LOG.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_PRODUCT, error);

      if (photoPath) {
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.error(ERROR_LOG.DELETE_PREV_IMG, err);
          }
        });
      }
      
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedProduct = await this.service.softDelete(id);

      if (deletedProduct) {
        res.status(STATUS_CODE.OK).json(deletedProduct);
      } else {
        console.log(ERROR_LOG.PRODUCT_NOT_FOUND)
        throw new CustomError(ERROR_LOG.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.DELETE_PRODUCT, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }
}

export default ProductController;
