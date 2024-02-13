import { hash } from "bcrypt";
import { IUser } from "./user-domain";
import { CreateUserDTO, UpdateUserDTO } from "./user-dto";
import UserRepository from "./user-repository";
import ProductRepository from "../products/product-repository";
import fs from "fs";

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
    const currentUser = await this.userRepository.findById(id);

    const updatedUser = await this.userRepository.update(id, data);

    if (!updatedUser) {
        return null;
    }

    if (currentUser && currentUser.photo && data.photo) {
        const fileName = currentUser.photo.split("/").pop();
        if (fileName) {
            try {
                fs.unlinkSync(`uploads/${fileName}`);
            } catch (error) {
                console.error("Erro ao excluir a imagem anterior:", error);
            }
        }
    }

    return updatedUser;
}

  async softDelete(id: string): Promise<IUser | null> {
    const userToDelete = await this.userRepository.findById(id);

    if (!userToDelete) {
      console.log("Tratar: Não veio user do db");
      return null;
    }

    const fileName = userToDelete.photo.split("/").pop();

    const deletedUser = await this.userRepository.softDelete(id);

    if (!deletedUser) {
      console.log("Tratar: Não conseguiu deletar o user do db");
      return null;
    }

    try {
      if (fileName) {
        fs.unlinkSync(`uploads/${fileName}`);
      }
    } catch (error) {
      console.error("Erro ao excluir a imagem:", error);
    }

    return deletedUser;
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

    await this.userRepository.update(userId, {
      jewelsAmount: user.jewelsAmount,
      products: user.products,
    });
    await this.productRepository.update(productId, { amount: product.amount });

    return user;
  }

  async addToFavorites(
    userId: string,
    productId: string
  ): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    const product = await this.productRepository.findById(productId);

    if (!user || !product) {
      return null;
    }

    if (user.favoriteProducts.includes(product._id)) {
      return user;
    }

    user.favoriteProducts.push(product._id);

    await this.userRepository.update(userId, {
      favoriteProducts: user.favoriteProducts,
    });

    return user;
  }

  async removeFromFavorites(
    userId: string,
    productId: string
  ): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return null;
    }

    const index = user.favoriteProducts.indexOf(productId);

    if (index === -1) {
      return user;
    }

    user.favoriteProducts.splice(index, 1);

    await this.userRepository.update(userId, {
      favoriteProducts: user.favoriteProducts,
    });

    return user;
  }
}

export default UserService;
