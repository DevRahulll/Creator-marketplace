import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type JWTPayload = { userId: string };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(userPassword: string, Password: string) {
  return bcrypt.compare(userPassword, Password);
}

export function signJwt(payload: jwt.JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyJwt(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
