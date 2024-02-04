import { hash } from "bcrypt";
import { IUser } from "./user-domain";
import { CreateUserDTO, UpdateUserDTO } from "./user-dto";
import UserRepository from "./user-repository";
import ProductRepository from "../products/product-repository";

class UserService {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository
  ) {}

  async create(data: CreateUserDTO): Promise<IUser> {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);
    if (userAlreadyExists) {
      console.log("Tratar Erro");
    }

    const payload = {
      ...data,
      password: await hash(data.password, 8),
    };

    const result = await this.userRepository.create(payload);

    return result;
  }

  async getAll(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async getById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    return await this.userRepository.update(id, data);
  }

  async softDelete(id: string): Promise<IUser | null> {
    return await this.userRepository.softDelete(id);
  }

  async buyProduct(userId: string, productId: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    const product = await this.productRepository.findById(productId);

    if (!user || !product) {
      return null;
    }

    if (user.jewelsAmount < product.value) {
      return null;
    }

    if (product.amount <= 0) {
      return null;
    }

    user.jewelsAmount -= product.value;
    user.products.push(product._id);
    product.amount--;

    await this.userRepository.update(userId, { jewelsAmount: user.jewelsAmount, products: user.products });
    await this.productRepository.update(productId, { amount: product.amount });

    return user;
  }

  async addToFavorites(userId: string, productId: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    const product = await this.productRepository.findById(productId);

    if (!user || !product) {
      return null;
    }

    if (user.favoriteProducts.includes(product._id)) {
      return user;
    }

    user.favoriteProducts.push(product._id);

    await this.userRepository.update(userId, { favoriteProducts: user.favoriteProducts });

    return user;
  }
}

export default UserService;
