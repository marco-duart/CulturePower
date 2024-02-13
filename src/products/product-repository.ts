import { Product, IProduct } from "./product-domain";
import { CreateProductDTO, UpdateProductDTO } from "./product-dto";

class ProductRepository {
  constructor(private model: typeof Product) {}

  async create(data: CreateProductDTO): Promise<IProduct> {
    return await this.model.create(data);
  }

  async findById(_id: string): Promise<IProduct | null> {
    return await this.model.findOne({ _id, deletedAt: null }).exec();
  }

  async findAll(): Promise<IProduct[]> {
    return await this.model
      .find({ deletedAt: null, amount: { $gt: 0 } })
      .exec();
  }

  async update(
    _id: string,
    data: Partial<UpdateProductDTO>
  ): Promise<IProduct | null> {
    return await this.model
      .findByIdAndUpdate({ _id, deletedAt: null }, { ...data }, { new: true })
      .exec();
  }

  async softDelete(_id: string): Promise<IProduct | null> {
    return await this.model
      .findByIdAndUpdate(_id, { deletedAt: new Date() }, { new: true })
      .exec();
  }
}

export default ProductRepository;
