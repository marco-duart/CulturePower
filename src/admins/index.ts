import { Admin } from "./admin-domain";
import AdminRepository from "./admin-repository";
import AdminService from "./admin-service";
import AdminController from "./admin-controller";

export class AdminModule {
  static make() {
    const repository = new AdminRepository(Admin)
    const service = new AdminService(repository)
    const controller = new AdminController(service)

    return { controller, service, repository }
  }
}
