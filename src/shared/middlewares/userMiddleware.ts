import { NextFunction, Request, Response } from "express";
import * as schema from "../../users/user-schemas";
import * as yup from "yup";

export async function createUserMiddleware(
  req: Request<{}, {}, schema.ICreateUser>,
  res: Response,
  next: NextFunction
) {
  try {
    const validateData: schema.ICreateUser =
      await schema.createUserValidate.validate(req.body, { abortEarly: false });
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
