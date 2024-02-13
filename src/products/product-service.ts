import { IProduct } from "./product-domain";
import { CreateProductDTO, UpdateProductDTO } from "./product-dto";
import ProductRepository from "./product-repository";
import fs from "fs";

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
    return await this.repository.update(id, data);
  }

  async softDelete(id: string): Promise<IProduct | null> {
    const productToDelete = await this.repository.findById(id);

    if (!productToDelete) {
      console.log("Tratar: Não veio product do db");
      return null;
    }

    const fileName = productToDelete.photo.split("/").pop();

    const deletedProduct = await this.repository.softDelete(id);

    if (!deletedProduct) {
      console.log("Tratar: Não conseguiu deletar o product do db");
      return null;
    }

    try {
      if (fileName) {
        fs.unlinkSync(`uploads/${fileName}`);
      }
    } catch (error) {
      console.error("Erro ao excluir a imagem:", error);
    }

    return deletedProduct;
  }
}

export default ProductService;
