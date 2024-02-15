import { hash } from "bcrypt";
import { IUser } from "./user-domain";
import { CreateUserDTO, UpdateUserDTO } from "./user-dto";
import UserRepository from "./user-repository";
import ProductRepository from "../products/product-repository";
import fs from "fs";
import { CustomError } from "../shared/error/CustomError";
import { STATUS_CODE } from "../utils/enums/statusCode";
import { ERROR_LOG } from "../utils/enums/errorMessage";

class UserService {
  constructor(
    private userRepository: UserRepository,
    private productRepository: ProductRepository
  ) {}

  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      const userAlreadyExists = await this.userRepository.findByEmail(data.email);
      if (userAlreadyExists) {
        console.log(ERROR_LOG.USER_EXISTS)
        throw new CustomError(ERROR_LOG.USER_EXISTS, STATUS_CODE.BAD_REQUEST);
      }

      const payload = {
        ...data,
        password: await hash(data.password, 8),
      };

      const result = await this.userRepository.create(payload);

      return result;
    } catch (error) {
      console.error(ERROR_LOG.CREATE_USER, error);
      throw new CustomError(ERROR_LOG.CREATE_USER, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error(ERROR_LOG.FETCH_USERS, error);
      throw new CustomError(ERROR_LOG.FETCH_USERS, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(id: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error(ERROR_LOG.FETCH_USER, error);
      throw new CustomError(ERROR_LOG.FETCH_USER, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    try {
      const currentUser = await this.userRepository.findById(id);
      const updatedUser = await this.userRepository.update(id, data);

      if (!updatedUser) {
        console.log(ERROR_LOG.UPDATE_USER)
        throw new CustomError(ERROR_LOG.UPDATE_USER, STATUS_CODE.INTERNAL_SERVER_ERROR);
      }

      if (currentUser && currentUser.photo && data.photo) {
        const fileName = currentUser.photo.split("/").pop();
        if (fileName) {
          try {
            fs.unlinkSync(`uploads/${fileName}`);
          } catch (error) {
            console.error(ERROR_LOG.DELETE_PREV_IMG, error);
            throw new CustomError(ERROR_LOG.DELETE_PREV_IMG, STATUS_CODE.INTERNAL_SERVER_ERROR);
          }
        }
      }

      return updatedUser;
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_USER, error);
      throw new CustomError(ERROR_LOG.UPDATE_USER, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(id: string): Promise<IUser | null> {
    try {
      const userToDelete = await this.userRepository.findById(id);
      if (!userToDelete) {
        console.log(ERROR_LOG.USER_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }

      const fileName = userToDelete.photo.split("/").pop();
      const deletedUser = await this.userRepository.softDelete(id);

      if (!deletedUser) {
        console.log(ERROR_LOG.DELETE_USER)
        throw new CustomError(ERROR_LOG.DELETE_USER, STATUS_CODE.INTERNAL_SERVER_ERROR);
      }

      try {
        if (fileName) {
          fs.unlinkSync(`uploads/${fileName}`);
        }
      } catch (error) {
        console.error(ERROR_LOG.DELETE_IMG, error);
        throw new CustomError(ERROR_LOG.DELETE_IMG, STATUS_CODE.INTERNAL_SERVER_ERROR);
      }

      return deletedUser;
    } catch (error) {
      console.error(ERROR_LOG.DELETE_USER, error);
      throw new CustomError(ERROR_LOG.DELETE_USER, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async buyProduct(userId: string, productId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);
      const product = await this.productRepository.findById(productId);

      if (!user || !product) {
        console.log(ERROR_LOG.USER_PRODUCT_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }

      if (user.jewelsAmount < product.value) {
        console.log(ERROR_LOG.INSUFFICIENT_JEWELS)
        throw new CustomError(ERROR_LOG.INSUFFICIENT_JEWELS, STATUS_CODE.BAD_REQUEST);
      }

      if (product.amount <= 0) {
        console.log(ERROR_LOG.OUT_STOCK)
        throw new CustomError(ERROR_LOG.OUT_STOCK, STATUS_CODE.BAD_REQUEST);
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
      console.error(ERROR_LOG.BUY_PRODUCT, error);
      throw new CustomError(ERROR_LOG.BUY_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
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
        console.log(ERROR_LOG.USER_PRODUCT_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_PRODUCT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }

      if (user.favoriteProducts.includes(product._id)) {
        console.log(ERROR_LOG.ALREADY_FAVORITE)
        return user;
      }

      user.favoriteProducts.push(product._id);

      await this.userRepository.update(userId, {
        favoriteProducts: user.favoriteProducts,
      });

      return user;
    } catch (error) {
      console.error(ERROR_LOG.FAVORITE_PRODUCT, error);
      throw new CustomError(ERROR_LOG.FAVORITE_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFromFavorites(
    userId: string,
    productId: string
  ): Promise<IUser | null> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        console.log(ERROR_LOG.USER_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }

      const index = user.favoriteProducts.indexOf(productId);

      if (index === -1) {
        console.log(ERROR_LOG.EMPTY_FAVORITES)
        return user;
      }

      user.favoriteProducts.splice(index, 1);

      await this.userRepository.update(userId, {
        favoriteProducts: user.favoriteProducts,
      });

      return user;
    } catch (error) {
      console.error(ERROR_LOG.UNFAVORITE_PRODUCT, error);
      throw new CustomError(ERROR_LOG.UNFAVORITE_PRODUCT, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}

export default UserService;
