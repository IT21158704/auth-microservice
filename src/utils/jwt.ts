import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types';

// Fix: Use actual environment variables instead of string literals
const accessTokenSecret = 'process.env.JWT_SECRET';
const refreshTokenSecret = 'process.env.JWT_REFRESH_SECRET';
const accessTokenExpire = process.env.JWT_EXPIRE || '15m';
const refreshTokenExpire = process.env.JWT_REFRESH_EXPIRE || '7d';

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error('JWT_SECRET or JWT_REFRESH_SECRET is missing');
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpire,
  } as SignOptions);
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpire,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, accessTokenSecret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, refreshTokenSecret) as JWTPayload;
};