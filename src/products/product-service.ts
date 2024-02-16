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
    const result = await this.repository.create(data);
    return result;
  }

  async getAll(): Promise<IProduct[]> {
    return await this.repository.findAll();
  }

  async getById(id: string): Promise<IProduct | null> {
    return await this.repository.findById(id);
  }

  async update(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
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
        fs.unlinkSync(`uploads/${fileName}`);
      }
    }

    return updatedProduct;
  }

  async softDelete(id: string): Promise<IProduct | null> {
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
  }
}

export default ProductService;
