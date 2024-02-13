import { User } from "./user-domain";
import UserRepository from "./user-repository";
import UserService from "./user-service";
import UserController from "./user-controller";

import { Product } from "../products/product-domain";
import ProductRepository from "../products/product-repository";

export class UserModule {
  static make() {
    const userRepository = new UserRepository(User);
    const productRepository = new ProductRepository(Product);

    const service = new UserService(userRepository, productRepository);
    const controller = new UserController(service);

    return { controller, service, userRepository };
  }
}
