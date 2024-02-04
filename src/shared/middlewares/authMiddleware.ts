import { NextFunction, Request, Response } from "express";
import { userLoginValidate, IUserLogin } from "../../auth/auth-schemas";
import * as yup from "yup";

export async function authValidateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  try {
    const validateData: IUserLogin =
      await userLoginValidate.validate(req.body, {
        abortEarly: false,
      });
    console.log("All required fields are present!");
    next();
  } catch (error) {
    const yupError = error as yup.ValidationError;
    return res.status(400).json({
      errors: {
        default: yupError.message,
      },
    });
  }
}
