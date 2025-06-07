import { JWTPayload } from '@/types/types';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const EMAIL_SECRET = process.env.JWT_EMAIL_SECRET!;
const RESET_SECRET = process.env.JWT_RESET_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET || !EMAIL_SECRET || !RESET_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables');
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    ACCESS_SECRET,
    { expiresIn: '1d' } // 1 day
  );
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn: '7d' } // 7 days
  );
}

export function generateEmailVerificationToken(payload: JWTPayload): string {
  return jwt.sign(
    { ...payload, type: 'email' },
    EMAIL_SECRET,
    { expiresIn: '10m' } // 10 minutes
  );
}

export function generatePasswordResetToken(payload: JWTPayload): string {
  return jwt.sign(
    { ...payload, type: 'reset' },
    RESET_SECRET,
    { expiresIn: '10m' } // 10 minutes
  );
}

export function verifyAccessToken(token: string): JWTPayload {
  console.log('recieved')
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JWTPayload;
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    console.error('❌ Access token verification failed:', error);
    throw new Error('Invalid access token');
  }
}

export function verifyRefreshToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as JWTPayload;
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    console.error('❌ Refresh token verification failed:', error);
    throw new Error('Invalid refresh token');
  }
}

export function verifyEmailToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, EMAIL_SECRET) as JWTPayload;
    if (decoded.type !== 'email') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    console.error('❌ Email token verification failed:', error);
    throw new Error('Invalid email verification token');
  }
}

export function verifyResetToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, RESET_SECRET) as JWTPayload;
    if (decoded.type !== 'reset') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    console.error('❌ Reset token verification failed:', error);
    throw new Error('Invalid password reset token');
  }
}