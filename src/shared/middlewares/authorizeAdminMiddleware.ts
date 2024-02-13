import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../../configs/env";

export function authorizeAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
      status: 401,
    });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const decodedToken: any = verify(token, env.JWT_SECRET_KEY);

    if (
      !decodedToken ||
      !decodedToken.hasOwnProperty("role") ||
      decodedToken.role !== "admin"
    ) {
      return res.status(403).json({
        error: true,
        message: "Forbidden - Not an admin",
        status: 403,
      });
    }
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
      status: 401,
    });
  }

  next();
}
