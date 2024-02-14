import { hash } from "bcrypt";
import { IUser } from "./user-domain";
import { CreateUserDTO, UpdateUserDTO } from "./user-dto";
import UserRepository from "./user-repository";
import ProductRepository from "../products/product-repository";
import fs from "fs";
import { CustomError } from "../shared/errors/CustomError";

class UserService {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository
  ) {}

  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      const userAlreadyExists = await this.userRepository.findByEmail(data.email);
      if (userAlreadyExists) {
        throw new CustomError("User with this email already exists.", 400);
      }

      const payload = {
        ...data,
        password: await hash(data.password, 8),
      };

      const result = await this.userRepository.create(payload);

      return result;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new CustomError("Failed to create user.", 500);
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new CustomError("Failed to fetch users.", 500);
    }
  }

  async getById(id: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new CustomError("Failed to fetch user.", 500);
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    try {
      const currentUser = await this.userRepository.findById(id);
      const updatedUser = await this.userRepository.update(id, data);

      if (!updatedUser) {
        throw new CustomError(`User with ID ${id} cannot be updated.`, 500);
      }

      if (currentUser && currentUser.photo && data.photo) {
        const fileName = currentUser.photo.split("/").pop();
        if (fileName) {
          try {
            fs.unlinkSync(`uploads/${fileName}`);
          } catch (error) {
            console.error("Error deleting previous image:", error);
            throw new CustomError("Failed to delete previous image.", 500);
          }
        }
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new CustomError("Failed to update user.", 500);
    }
  }

  async softDelete(id: string): Promise<IUser | null> {
    try {
      const userToDelete = await this.userRepository.findById(id);
      if (!userToDelete) {
        throw new CustomError(`User with ID ${id} not found.`, 404);
      }

      const fileName = userToDelete.photo.split("/").pop();
      const deletedUser = await this.userRepository.softDelete(id);

      if (!deletedUser) {
        throw new CustomError(`User with ID ${id} cannot be deleted.`, 500);
      }

      try {
        if (fileName) {
          fs.unlinkSync(`uploads/${fileName}`);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        throw new CustomError("Failed to delete image.", 500);
      }

      return deletedUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new CustomError("Failed to delete user.", 500);
    }
  }

  async buyProduct(userId: string, productId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);
      const product = await this.productRepository.findById(productId);

      if (!user || !product) {
        throw new CustomError("User or product not found.", 404);
      }

      if (user.jewelsAmount < product.value) {
        throw new CustomError("Insufficient jewels amount.", 400);
      }

      if (product.amount <= 0) {
        throw new CustomError("Product out of stock.", 400);
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
    } catch (error) {
      console.error("Error buying product:", error);
      throw new CustomError("Failed to buy product.", 500);
    }
  }

  async addToFavorites(
    userId: string,
    productId: string
  ): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);
      const product = await this.productRepository.findById(productId);

      if (!user || !product) {
        throw new CustomError("User or product not found.", 404);
      }

      if (user.favoriteProducts.includes(product._id)) {
        return user;
      }

      user.favoriteProducts.push(product._id);

      await this.userRepository.update(userId, {
        favoriteProducts: user.favoriteProducts,
      });

      return user;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw new CustomError("Failed to add to favorites.", 500);
    }
  }

  async removeFromFavorites(
    userId: string,
    productId: string
  ): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new CustomError("User not found.", 404);
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
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw new CustomError("Failed to remove from favorites.", 500);
    }
  }
}

export default UserService;
