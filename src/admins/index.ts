import { Admin } from "./admin-domain";
import AdminRepository from "./admin-repository";
import AdminService from "./admin-service";
import AdminController from "./admin-controller";
import UserRepository from "../users/user-repository";
import { User } from "../users/user-domain";

export class AdminModule {
  static make() {
    const adminRepository = new AdminRepository(Admin);
    const userRepository = new UserRepository(User);
    const service = new AdminService(adminRepository, userRepository);
    const controller = new AdminController(service);

    return { controller, service, adminRepository };
  }
}
