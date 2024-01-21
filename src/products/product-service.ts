import { IProduct } from "./product-domain";
import { CreateProductDTO, UpdateProductDTO } from "./product-dto";
import ProductRepository from "./product-repository";


class ProductService {
    constructor(private repository: ProductRepository) {}
  
    async create(data: CreateProductDTO): Promise<IProduct> {
      const result = await this.repository.create(data);
  
      return result
    }
  
    async getAll(): Promise<IProduct[]> {
      return await this.repository.findAll()
    }
  
    async getById(id: string): Promise<IProduct | null> {
      return await this.repository.findById(id);
    }
  
    async update(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
      return await this.repository.update(id, data)
    }
  
    async softDelete(id: string): Promise<IProduct | null> {
      return await this.repository.softDelete(id)
    }
  
  }
  
  export default ProductService;
  