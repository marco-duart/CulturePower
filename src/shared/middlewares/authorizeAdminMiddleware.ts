import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { env } from "../../configs/env";

export function authorizeAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  const autorization = req.headers["authorization"];
  if (!autorization) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
      status: 401
    })
  }

  const token = autorization.replace("Bearer ", "")

  try {
    const decodedToken = verify(token, env.JWT_SECRET_KEY)
    if(decodedToken && decodedToken.hasOwnProperty("userType")) {
      
    }
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
      status: 401
    })
  }

  next()
}
