import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

import UserRepository from "../users/user-repository";
import AdminRepository from "../admins/admin-repository";
import { Admin } from "../admins/admin-domain";
import { User } from "../users/user-domain";
import { AuthDTO } from "./auth-dto";
import { env } from "../configs/env";
import { CustomError } from "../shared/error/CustomError";
import { STATUS_CODE } from "../utils/enums/statusCode";
import { ERROR_LOG } from "../utils/enums/errorMessage";
export class AuthService {
  constructor(private userRepository: UserRepository | AdminRepository) {}

  async login(data: AuthDTO) {
    try {
      const user = await this.userRepository.findByEmail(data.email);
      if (!user) {
        console.log(ERROR_LOG.USER_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }

      const password = data.password ?? "";
      const passwordIsValid = await compare(password, user.password);
      if (!passwordIsValid) {
        console.log(ERROR_LOG.INVALID_PASS)
        throw new CustomError(ERROR_LOG.INVALID_PASS, STATUS_CODE.BAD_REQUEST);
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user instanceof Admin ? "admin" : "user",
        photo: user instanceof User ? user.photo : null,
      };
      const secretKey = env.JWT_SECRET_KEY;
      const options = { expiresIn: "5h" };

      const token = sign(payload, secretKey, options);

      return { token };
    } catch (error) {
      console.error(ERROR_LOG.LOGIN_FAIL, error);
      throw new CustomError(ERROR_LOG.LOGIN_FAIL, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserInfo(authorization: string): Promise<any> {
    try {
      const token = authorization.replace("Bearer ", "");
      const decodedToken: any = verify(token, env.JWT_SECRET_KEY);

      return {
        userId: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
        photo: decodedToken.photo,
      };
    } catch (error) {
      console.error(ERROR_LOG.TOKEN_DECOD_FAIL, error);
      throw new CustomError(ERROR_LOG.TOKEN_DECOD_FAIL, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}
