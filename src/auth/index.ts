import { UserModule } from "../users";
import { AdminModule } from "../admins";
import { AuthService } from "./auth-service";
import { AuthController } from "./auth-controller";

export class AuthModule {
  static adminLogin() {
    const { adminRepository } = AdminModule.make();
    const service = new AuthService(adminRepository);
    const adminLoginController = new AuthController(service);
    return { adminLoginController };
  }
  static userLogin() {
    const { userRepository } = UserModule.make();
    const service = new AuthService(userRepository);
    const userLoginController = new AuthController(service);
    return { userLoginController };
  }
}
