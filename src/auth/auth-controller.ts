import { Request, Response } from "express";
import { AuthService } from "./auth-service";
import { AuthDTO } from "./auth-dto";
import { CustomError } from "../shared/error/CustomError";
import { ERROR_LOG } from "../utils/enums/errorMessage";
import { STATUS_CODE } from "../utils/enums/statusCode";

export class AuthController {
  constructor(private service: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: AuthDTO = req.body;
      const result = await this.service.login(data);
      res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
      console.error(ERROR_LOG.LOGIN_FAIL, error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: ERROR_LOG.INTERNAL_SERVER_ERROR,
        code: STATUS_CODE.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getUserInfo(req: Request, res: Response): Promise<void> {
    try {
      const authorization = req.headers["authorization"];

      if (!authorization) {
        console.log(ERROR_LOG.UNAUTHORIZED)
        throw new CustomError(ERROR_LOG.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
      }

      const userInfo = await this.service.getUserInfo(authorization);

      if (!userInfo) {
        console.log(ERROR_LOG.UNAUTHORIZED)
        throw new CustomError(ERROR_LOG.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
      }

      res.status(STATUS_CODE.OK).json(userInfo);
    } catch (error) {
      console.error(ERROR_LOG.USER_INFO, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }
}
