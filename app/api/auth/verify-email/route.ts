import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongo';
import User from '@/models/User';
import { verifyEmailToken } from '@/lib/jwt';
import { verifyEmailSchema } from '@/lib/validation';
import { ApiResponse } from '@/types/types';


export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    console.log('📧 Email verification attempt with token');
    
    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Verification failed',
          error: 'Verification token is required'
        },
        { status: 400 }
      );
    }
    
    try {
      // Verify the token
      const decoded = verifyEmailToken(token);
      console.log('🔍 Token verified for user:', decoded.email);
      
      // Find and update user
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('❌ User not found');
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: 'Verification failed',
            error: 'User not found'
          },
          { status: 404 }
        );
      }
      
      // Check if already verified
      if (user.isVerified) {
        console.log('ℹ️ User already verified');
        return NextResponse.json<ApiResponse>(
          {
            success: true,
            message: 'Email already verified',
            data: { isVerified: true }
          },
          { status: 200 }
        );
      }
      
      // Update verification status
      user.isVerified = true;
      await user.save();
      
      console.log('✅ Email verified successfully for:', user.email);
      
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: 'Email verified successfully! You can now log in.',
          data: { isVerified: true }
        },
        { status: 200 }
      );
      
    } catch (tokenError) {
      console.error('❌ Token verification failed:', tokenError);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Verification failed',
          error: 'Invalid or expired verification token'
        },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('❌ Email verification error:', error);
    
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: 'Internal server error',
        error: 'Email verification failed due to server error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    console.log('📧 Email verification POST attempt');
    
    // Validate input
    const validatedData = verifyEmailSchema.parse(body);
    const { token } = validatedData;
    
    try {
      // Verify the token
      const decoded = verifyEmailToken(token);
      console.log('🔍 Token verified for user:', decoded.email);
      
      // Find and update user
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('❌ User not found');
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: 'Verification failed',
            error: 'User not found'
          },
          { status: 404 }
        );
      }
      
      // Check if already verified
      if (user.isVerified) {
        console.log('ℹ️ User already verified');
        return NextResponse.json<ApiResponse>(
          {
            success: true,
            message: 'Email already verified',
            data: { isVerified: true }
          },
          { status: 200 }
        );
      }
      
      // Update verification status
      user.isVerified = true;
      await user.save();
      
      console.log('✅ Email verified successfully for:', user.email);
      
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: 'Email verified successfully! You can now log in.',
          data: { isVerified: true }
        },
        { status: 200 }
      );
      
    } catch (tokenError) {
      console.error('❌ Token verification failed:', tokenError);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Verification failed',
          error: 'Invalid or expired verification token'
        },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('❌ Email verification error:', error);
    
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
        error: 'Email verification failed due to server error'
      },
      { status: 500 }
    );
  }
}