import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongo';
import User from '@/models/User';
import { generatePasswordResetToken } from '@/lib/jwt';
import { sendPasswordResetEmail } from '@/lib/email';
import { forgotPasswordSchema } from '@/lib/validation';
import { ApiResponse } from '@/types/types';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    console.log('🔑 Password reset request for:', body.email);
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found for password reset');
      // Don't reveal whether user exists or not for security
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.',
        },
        { status: 200 }
      );
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      console.log('❌ Password reset blocked: Email not verified');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Password reset failed',
          error: 'Please verify your email address first'
        },
        { status: 403 }
      );
    }
    
    // Generate password reset token
    const resetToken = generatePasswordResetToken({
      userId: user._id.toString(),
      email: user.email,
    });

    console.log('resetTKN', resetToken)
    
    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);
    
    console.log('✅ Password reset email sent to:', email);
    
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('❌ Forgot password error:', error);
    
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
        error: 'Password reset request failed due to server error'
      },
      { status: 500 }
    );
  }
}