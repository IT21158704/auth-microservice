import { JWTPayload } from '@/types/types';
import jwt from 'jsonwebtoken';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function generateAccessToken(payload: JWTPayload): string {
  const secret = getEnvVar('JWT_ACCESS_SECRET');
  return jwt.sign({ ...payload, type: 'access' }, secret, { expiresIn: '1d' });
}

export function generateRefreshToken(payload: JWTPayload): string {
  const secret = getEnvVar('JWT_REFRESH_SECRET');
  return jwt.sign({ ...payload, type: 'refresh' }, secret, { expiresIn: '7d' });
}

export function generateEmailVerificationToken(payload: JWTPayload): string {
  const secret = getEnvVar('JWT_EMAIL_SECRET');
  return jwt.sign({ ...payload, type: 'email' }, secret, { expiresIn: '10m' });
}

export function generatePasswordResetToken(payload: JWTPayload): string {
  const secret = getEnvVar('JWT_RESET_SECRET');
  return jwt.sign({ ...payload, type: 'reset' }, secret, { expiresIn: '10m' });
}

export function verifyAccessToken(token: string): JWTPayload {
  const secret = getEnvVar('JWT_ACCESS_SECRET');
  const decoded = jwt.verify(token, secret) as JWTPayload;
  if (decoded.type !== 'access') throw new Error('Invalid token type');
  return decoded;
}

export function verifyRefreshToken(token: string): JWTPayload {
  const secret = getEnvVar('JWT_REFRESH_SECRET');
  const decoded = jwt.verify(token, secret) as JWTPayload;
  if (decoded.type !== 'refresh') throw new Error('Invalid token type');
  return decoded;
}

export function verifyEmailToken(token: string): JWTPayload {
  const secret = getEnvVar('JWT_EMAIL_SECRET');
  const decoded = jwt.verify(token, secret) as JWTPayload;
  if (decoded.type !== 'email') throw new Error('Invalid token type');
  return decoded;
}

export function verifyResetToken(token: string): JWTPayload {
  const secret = getEnvVar('JWT_RESET_SECRET');
  const decoded = jwt.verify(token, secret) as JWTPayload;
  if (decoded.type !== 'reset') throw new Error('Invalid token type');
  return decoded;
}
