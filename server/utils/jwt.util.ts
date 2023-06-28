import { decode, sign, verify } from 'jsonwebtoken';
import { VerifiedToken } from 'server/models/App.model';
const SECRET = process.env['JWT_SECRET'];
const ISSUER = process.env['JWT_ISSUER'];

export const signToken = (payload: any, expires: string) => {
  return sign(payload, SECRET as string, {
    expiresIn: expires,
    issuer: ISSUER,
  });
};

export const verifyToken = (token: string) => {
  let verified: VerifiedToken;
  try {
    verified = new VerifiedToken(
      verify(token, SECRET as string, { issuer: ISSUER }),
      false
    );
  } catch (error) {
    verified = new VerifiedToken(null, true);
  }
  return verified;
};
