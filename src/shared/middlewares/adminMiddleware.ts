import { NextFunction, Request, Response } from "express";
import { ICreateAdmin, createAdminValidate } from "../../admins/admin-schemas";
import * as yup from "yup";

export async function createAdminMiddleware(
  req: Request<{}, {}, ICreateAdmin>,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  try {
    const validateData: ICreateAdmin =
      await createAdminValidate.validate(req.body, { abortEarly: false });
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