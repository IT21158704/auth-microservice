import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date; // Added this field
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshTokens: string[];
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number; // issued at
  exp?: number; // expires at
}

export interface AuthRequest extends Request {
  user?: IUser & Document & { _id: Types.ObjectId };
}