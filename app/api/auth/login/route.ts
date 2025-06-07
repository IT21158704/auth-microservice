import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongo';
import User, { IUser } from '@/models/User';
import { comparePassword } from '@/lib/auth';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validation';
import { ApiResponse } from '@/types/types';


export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    console.log('🔑 Login attempt for:', body.email);
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    
    // Find user by email
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      console.log('❌ Login failed: User not found');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Login failed',
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }
    
    // Check if account is locked
    if (user.isLocked) {
      console.log('🔒 Login blocked: Account is locked');
      const lockTimeRemaining = Math.ceil((user.lockUntil!.getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Account temporarily locked',
          error: `Account is locked due to too many failed login attempts. Please try again in ${lockTimeRemaining} minutes.`
        },
        { status: 423 }
      );
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      
      // Increment failed login attempts
      await user.incrementFailedAttempts();
      
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Login failed',
          error: 'Invalid email or password'
        },
        { status: 401 }
      );
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      console.log('❌ Login blocked: Email not verified');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Email verification required',
          error: 'Please verify your email address before logging in'
        },
        { status: 403 }
      );
    }
    
    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await user.resetFailedAttempts();
    }
    
    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    console.log('✅ Login successful for:', user.email);
    
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            isVerified: user.isVerified,
          },
          tokens: {
            accessToken,
            refreshToken,
          }
        }
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: error.errors[0]?.message || 'Invalid input data'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: 'Internal server error',
        error: 'Login failed due to server error'
      },
      { status: 500 }
    );
  }
}