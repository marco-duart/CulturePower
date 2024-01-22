import { UserModule } from "../users";
import { AdminModule } from "../admins";
import { AuthService } from "./auth-service";
import { AuthController } from "./auth-controller";

export class AuthModule {
    static adminLogin() {
        const { repository } = AdminModule.make()
        const service = new AuthService(repository)
        const adminLoginController = new AuthController(service)
        return { adminLoginController }
    }
    static userLogin() {
        const { repository } = UserModule.make()
        const service = new AuthService(repository)
        const userLoginController = new AuthController(service)
        return { userLoginController }
    }
}