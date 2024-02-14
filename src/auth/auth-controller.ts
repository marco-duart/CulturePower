import { Request, Response } from "express";
import { AuthService } from "./auth-service";
import { AuthDTO } from "./auth-dto";
import { CustomError } from "../shared/errors/CustomError";
import { StatusCode } from "../utils/enums/statusCode";

export class AuthController {
  constructor(private service: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: AuthDTO = req.body;
      const result = await this.service.login(data);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error during login:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: "Internal server error",
        code: StatusCode.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getUserInfo(req: Request, res: Response): Promise<void> {
    try {
      const authorization = req.headers["authorization"];

      if (!authorization) {
        throw new CustomError("Unauthorized", StatusCode.UNAUTHORIZED);
      }

      const userInfo = await this.service.getUserInfo(authorization);

      if (!userInfo) {
        throw new CustomError("Unauthorized", StatusCode.UNAUTHORIZED);
      }

      res.json(userInfo);
    } catch (error) {
      console.error("Error getting user info:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }
}
