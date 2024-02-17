import { NextFunction, Request, Response } from "express";
import { ICreateUser } from "../../users/user-dto";
import { CustomError } from "../error/CustomError";
import { FIELD_MISSING } from "../../utils/enums/fieldMissing";
import { STATUS_CODE } from "../../utils/enums/statusCode";
import { ERROR_LOG } from "../../utils/enums/errorMessage";

export async function createUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body as ICreateUser;

    if (!name) {
      throw new CustomError(FIELD_MISSING.NAME, STATUS_CODE.BAD_REQUEST);
    }
    if (!email) {
      throw new CustomError(FIELD_MISSING.EMAIL, STATUS_CODE.BAD_REQUEST);
    }
    if (!password) {
      throw new CustomError(FIELD_MISSING.PASSSWORD, STATUS_CODE.BAD_REQUEST);
    }
    if (!req.file) {
      throw new CustomError(FIELD_MISSING.PHOTO, STATUS_CODE.BAD_REQUEST);
    }

    console.log("All required fields are present");
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