import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../../configs/env";
import { CustomError } from "../error/CustomError";
import { STATUS_CODE } from "../../utils/enums/statusCode";
import { ERROR_LOG } from "../../utils/enums/errorMessage";

export function authorizeAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    throw new CustomError(ERROR_LOG.MISSING_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const decodedToken: any = verify(token, env.JWT_SECRET_KEY);

    if (
      !decodedToken ||
      !decodedToken.hasOwnProperty("role") ||
      decodedToken.role !== "admin"
    ) {
      throw new CustomError(ERROR_LOG.NOT_AN_ADMIN, STATUS_CODE.FORBIDDEN);
    }
    next();
  } catch (error) {
    console.error(error);
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
