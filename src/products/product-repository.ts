import { Product, IProduct } from './product-domain';
import { CreateProductDTO, UpdateProductDTO } from './product-dto';

class ProductRepository {
  constructor(private model: typeof Product) {}

  async create(data: CreateProductDTO): Promise<IProduct> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<IProduct | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<IProduct[]> {
    return await this.model.find({ deletedAt: null }).exec();
  }

  async update(id: string, data: Partial<UpdateProductDTO>): Promise<IProduct | null> {
    return await this.model.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
  }

  async softDelete(id: string): Promise<IProduct | null> {
    return await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).exec();
  }
}

export default ProductRepository;