import { User } from "./user-domain";
import UserRepository from "./user-repository";
import UserService from "./user-service";
import UserController from "./user-controller";

export class UserModule {
  static make() {
    const repository = new UserRepository(User)
    const service = new UserService(repository)
    const controller = new UserController(service)

    return { controller, service, repository }
  }
}
