// /app/api/reset-password/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongo';
import User from '@/models/User';
import { verifyResetToken } from '@/lib/jwt';
import { hashPassword } from '@/lib/auth';
import { resetForgotPasswordSchema } from '@/lib/validation';
import { ApiResponse } from '@/types/types';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Extract token from URL query params
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Password reset failed',
          error: 'Reset token is required in the URL query parameter',
        },
        { status: 400 }
      );
    }

    // Validate password from body
    const body = await request.json();
    const validatedData = resetForgotPasswordSchema.parse(body);
    const { password } = validatedData;

    // Verify the reset token
    let decoded;
    try {
      decoded = verifyResetToken(token);
      console.log('🔍 Reset token verified for user:', decoded.email);
    } catch (tokenError) {
      console.error('❌ Reset token verification failed:', tokenError);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Password reset failed',
          error: 'Invalid or expired reset token',
        },
        { status: 400 }
      );
    }

    // Find user by decoded userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Password reset failed',
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      console.log('❌ Password reset blocked: Email not verified');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Password reset failed',
          error: 'Please verify your email address first',
        },
        { status: 403 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and reset failed attempts
    user.password = hashedPassword;
    await user.resetFailedAttempts?.(); // in case resetFailedAttempts exists
    await user.save();

    console.log('✅ Password reset successfully for:', user.email);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Password reset successfully. You can now log in with your new password.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Password reset error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: error.errors[0]?.message || 'Invalid input data',
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: 'Internal server error',
        error: 'Password reset failed due to server error',
      },
      { status: 500 }
    );
  }
}
