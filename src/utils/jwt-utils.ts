import { JwtPayload, verify, VerifyErrors } from 'jsonwebtoken';
import { env } from '../configs/env';

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export function decodeJwt(token: string): CustomJwtPayload | null {
  const cleanedToken = token.replace("Bearer ", "");

  try {
    const decodedToken = verify(cleanedToken, env.JWT_SECRET_KEY) as CustomJwtPayload;
    return decodedToken;
  } catch (error) {
    const verificationError = error as VerifyErrors;

    if (verificationError.name === 'TokenExpiredError') {
      //Vou fazer um retorno pro front entender a necessidade de redirect to login?
    }

    return null;
  }
}
