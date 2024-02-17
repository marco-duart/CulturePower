import { NextFunction, Request, Response } from "express";
import { ICreateProduct } from "../../products/product-dto";
import { CustomError } from "../error/CustomError";
import { FIELD_MISSING } from "../../utils/enums/fieldMissing";
import { STATUS_CODE } from "../../utils/enums/statusCode";
import { ERROR_LOG } from "../../utils/enums/errorMessage";

export async function createProductMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, value, amount, description } = req.body as ICreateProduct;

    if (!name) {
      throw new CustomError(FIELD_MISSING.NAME, STATUS_CODE.BAD_REQUEST);
    }
    if (!value) {
      throw new CustomError(FIELD_MISSING.VALUE, STATUS_CODE.BAD_REQUEST);
    }
    if (!amount) {
      throw new CustomError(FIELD_MISSING.AMOUNT, STATUS_CODE.BAD_REQUEST);
    }
    if (!description) {
      throw new CustomError(FIELD_MISSING.DESCRIPTION, STATUS_CODE.BAD_REQUEST);
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
