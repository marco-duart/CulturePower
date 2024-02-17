import { JwtPayload, verify, VerifyErrors } from "jsonwebtoken";
import { env } from "../configs/env";
import { CustomError } from "../shared/error/CustomError";
import { ERROR_LOG } from "./enums/errorMessage";
import { STATUS_CODE } from "./enums/statusCode";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export function decodeJwt(token: string): CustomJwtPayload | null {
  const cleanedToken = token.replace("Bearer ", "");

  try {
    const decodedToken = verify(
      cleanedToken,
      env.JWT_SECRET_KEY
    ) as CustomJwtPayload;
    return decodedToken;
  } catch (error) {
    const verificationError = error as VerifyErrors;

    if (verificationError.name === "TokenExpiredError") {
      throw new CustomError(ERROR_LOG.EXPIRED_TOKEN, STATUS_CODE.UNAUTHORIZED);
    } else {
      throw new CustomError(ERROR_LOG.TOKEN_DECOD_FAIL, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}