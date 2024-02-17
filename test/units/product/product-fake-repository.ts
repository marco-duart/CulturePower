import { randomUUID } from 'crypto';
import { IProduct, CreateProductDTO, UpdateProductDTO } from '../../../src/products/product-dto';

class ProductFakeRepository {
  private products: IProduct[] = [];

  constructor() {
    const product1: IProduct = {
      _id: "123456789",
      name: 'Fake Product 1',
      value: 10,
      amount: 20,
      description: 'Description of product 1',
      photo: 'product1.jpg',
    };

    const product2: IProduct = {
      _id: "987654321",
      name: 'Fake Product 2',
      value: 15,
      amount: 30,
      description: 'Description of product 2',
      photo: 'product2.jpg',
    };
    this.products.push(product1, product2);
  }

  async create(data: CreateProductDTO): Promise<IProduct> {
    const id = randomUUID()
    const product: IProduct = {
      _id: id,
      ...data,
    };
    this.products.push(product);
    return product;
  }

  async findAll(): Promise<IProduct[]> {
    return this.products;
  }

  async findById(id: string): Promise<IProduct | null> {
    return this.products.find(product => product._id === id) || null;
  }

  async update(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
    const index = this.products.findIndex(product => product._id === id);
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  async softDelete(id: string): Promise<IProduct | null> {
    const index = this.products.findIndex(product => product._id === id);
    if (index === -1) return null;

    const deletedProduct = this.products.splice(index, 1)[0];
    return deletedProduct;
  }
}

export { ProductFakeRepository };
