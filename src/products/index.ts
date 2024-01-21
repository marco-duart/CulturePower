import { Product } from "./product-domain";
import ProductRepository from "./product-repository";
import ProductService from "./product-service";
import ProductController from "./product-controller";

export class ProductModule {
  static make() {
    const repository = new ProductRepository(Product)
    const service = new ProductService(repository)
    const controller = new ProductController(service)

    return { controller, service, repository }
  }
}