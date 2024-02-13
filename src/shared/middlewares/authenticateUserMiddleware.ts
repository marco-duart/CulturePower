import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify, VerifyErrors } from "jsonwebtoken";
import { env } from "../../configs/env";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticateUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized - Token não fornecido ou formato inválido",
      status: 401,
    });
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const decodedToken = verify(token, env.JWT_SECRET_KEY);

    next();
  } catch (error) {
    const verificationError = error as VerifyErrors;

    if (verificationError.name === "TokenExpiredError") {
      return res.status(401).json({
        error: true,
        message: "Unauthorized - Token expirado",
        status: 401,
      });
    }

    return res.status(401).json({
      error: true,
      message: "Unauthorized - Token inválido",
      status: 401,
    });
  }
}
