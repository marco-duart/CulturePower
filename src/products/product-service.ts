import { IProduct } from "./product-domain";
import { CreateProductDTO, UpdateProductDTO } from "./product-dto";
import ProductRepository from "./product-repository";
import fs from "fs";
import { CustomError } from "../shared/error/CustomError";
import { STATUS_CODE } from "../utils/enums/statusCode";
import { ERROR_LOG } from "../utils/enums/errorMessage";

class ProductService {
  constructor(private repository: ProductRepository) {}

  async create(data: CreateProductDTO): Promise<IProduct> {
    try {
      const result = await this.repository.create(data);
      return result;
    } catch (error) {
      console.error(ERROR_LOG.CREATE_PRODUCT, error);
      throw new CustomError(ERROR_LOG.CREATE_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<IProduct[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error(ERROR_LOG.FETCH_PRODUCTS, error);
      throw new CustomError(ERROR_LOG.FETCH_PRODUCTS, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(id: string): Promise<IProduct | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error(ERROR_LOG.FETCH_PRODUCT, error);
      throw new CustomError(ERROR_LOG.FETCH_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
    try {
      const currentProduct = await this.repository.findById(id);
      if (!currentProduct) {
        console.log(ERROR_LOG.PRODUCT_NOT_FOUND)
        throw new CustomError(ERROR_LOG.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }

      const updatedProduct = await this.repository.update(id, data);
      if (!updatedProduct) {
        console.log(ERROR_LOG.UPDATE_PRODUCT)
        throw new CustomError(ERROR_LOG.UPDATE_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
      }

      if (currentProduct.photo && data.photo) {
        const fileName = currentProduct.photo.split("/").pop();
        if (fileName) {
          try {
            fs.unlinkSync(`uploads/${fileName}`);
          } catch (error) {
            console.error(ERROR_LOG.DELETE_PREV_IMG, error);
            throw new CustomError(ERROR_LOG.DELETE_PREV_IMG, STATUS_CODE.INTERNAL_SERVER_ERROR);
          }
        }
      }

      return updatedProduct;
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_PRODUCT, error);
      throw new CustomError(ERROR_LOG.UPDATE_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(id: string): Promise<IProduct | null> {
    try {
      const productToDelete = await this.repository.findById(id);
      if (!productToDelete) {
        console.log(ERROR_LOG.PRODUCT_NOT_FOUND)
        throw new CustomError(ERROR_LOG.PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }

      const fileName = productToDelete.photo.split("/").pop();

      const deletedProduct = await this.repository.softDelete(id);
      if (!deletedProduct) {
        console.log(ERROR_LOG.DELETE_PRODUCT)
        throw new CustomError(ERROR_LOG.DELETE_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
      }

      try {
        if (fileName) {
          fs.unlinkSync(`uploads/${fileName}`);
        }
      } catch (error) {
        console.error(ERROR_LOG.DELETE_IMG, error);
        throw new CustomError(ERROR_LOG.DELETE_IMG, STATUS_CODE.INTERNAL_SERVER_ERROR);
      }

      return deletedProduct;
    } catch (error) {
      console.error(ERROR_LOG.DELETE_PRODUCT, error);
      throw new CustomError(ERROR_LOG.DELETE_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}

export default ProductService;
