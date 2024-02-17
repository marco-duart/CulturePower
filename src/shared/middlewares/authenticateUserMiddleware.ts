import { NextFunction, Request, Response } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";
import { env } from "../../configs/env";
import { CustomError } from "../error/CustomError";
import { STATUS_CODE } from "../../utils/enums/statusCode";
import { ERROR_LOG } from "../../utils/enums/errorMessage";

export function authenticateUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new CustomError(ERROR_LOG.MISSING_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const decodedToken = verify(token, env.JWT_SECRET_KEY);

    next();
  } catch (error) {
    console.error(error);

    const verificationError = error as VerifyErrors;
    
    if (verificationError.name === "TokenExpiredError") {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        error: true,
        message: ERROR_LOG.EXPIRED_TOKEN,
        status: STATUS_CODE.UNAUTHORIZED,
      });
    }

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
