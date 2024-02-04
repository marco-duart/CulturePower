import { NextFunction, Request, Response } from "express";
import * as schema from "../../products/product-schemas";
import * as yup from "yup";

export async function createProductMiddleware(
  req: Request<{}, {}, schema.ICreateProduct>,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  try {
    const validateData: schema.ICreateProduct =
      await schema.createProductValidate.validate(req.body, { abortEarly: false });
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

export async function updateProductProductsMiddleware(
  req: Request<{}, {}, schema.IUpdateProduct>,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  try {
    const validateData: schema.IUpdateProduct =
      await schema.updateProductValidate.validate(req.body, {
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