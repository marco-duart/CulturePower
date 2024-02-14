import { IProduct } from "./product-domain";
import { CreateProductDTO, UpdateProductDTO } from "./product-dto";
import ProductRepository from "./product-repository";
import fs from "fs";
import { CustomError } from "../shared/errors/CustomError";

class ProductService {
  constructor(private repository: ProductRepository) {}

  async create(data: CreateProductDTO): Promise<IProduct> {
    try {
      const result = await this.repository.create(data);
      return result;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new CustomError("Failed to create product.", 500);
    }
  }

  async getAll(): Promise<IProduct[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new CustomError("Failed to fetch products.", 500);
    }
  }

  async getById(id: string): Promise<IProduct | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new CustomError("Failed to fetch product.", 500);
    }
  }

  async update(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
    try {
      const currentProduct = await this.repository.findById(id);
      if (!currentProduct) {
        throw new CustomError(`Product with ID ${id} not found.`, 404);
      }

      const updatedProduct = await this.repository.update(id, data);
      if (!updatedProduct) {
        throw new CustomError(`Product with ID ${id} cannot be updated.`, 500);
      }

      if (currentProduct.photo && data.photo) {
        const fileName = currentProduct.photo.split("/").pop();
        if (fileName) {
          try {
            fs.unlinkSync(`uploads/${fileName}`);
          } catch (error) {
            console.error("Error deleting previous image:", error);
            throw new CustomError("Failed to delete previous image.", 500);
          }
        }
      }

      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new CustomError("Failed to update product.", 500);
    }
  }

  async softDelete(id: string): Promise<IProduct | null> {
    try {
      const productToDelete = await this.repository.findById(id);
      if (!productToDelete) {
        throw new CustomError(`Product with ID ${id} not found.`, 404);
      }

      const fileName = productToDelete.photo.split("/").pop();

      const deletedProduct = await this.repository.softDelete(id);
      if (!deletedProduct) {
        throw new CustomError(`Product with ID ${id} cannot be deleted.`, 500);
      }

      try {
        if (fileName) {
          fs.unlinkSync(`uploads/${fileName}`);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        throw new CustomError("Failed to delete image.", 500);
      }

      return deletedProduct;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new CustomError("Failed to delete product.", 500);
    }
  }
}

export default ProductService;
