import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongo';
import User from '@/models/User';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { ApiResponse } from '@/types/types';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { refreshToken } = body;
    
    console.log('🔄 Token refresh attempt');
    
    if (!refreshToken) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Token refresh failed',
          error: 'Refresh token is required'
        },
        { status: 400 }
      );
    }
    
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      console.log('🔍 Refresh token verified for user:', decoded.email);
      
      // Find user to ensure they still exist and are verified
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('❌ User not found');
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: 'Token refresh failed',
            error: 'User not found'
          },
          { status: 404 }
        );
      }
      
      if (!user.isVerified) {
        console.log('❌ User not verified');
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: 'Token refresh failed',
            error: 'User email not verified'
          },
          { status: 403 }
        );
      }
      
      // Generate new tokens
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
      };
      
      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);
      
      console.log('✅ Tokens refreshed successfully for:', user.email);
      
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: 'Tokens refreshed successfully',
          data: {
            tokens: {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            }
          }
        },
        { status: 200 }
      );
      
    } catch (tokenError) {
      console.error('❌ Refresh token verification failed:', tokenError);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Token refresh failed',
          error: 'Invalid or expired refresh token'
        },
        { status: 401 }
      );
    }
    
  } catch (error: any) {
    console.error('❌ Token refresh error:', error);
    
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: 'Internal server error',
        error: 'Token refresh failed due to server error'
      },
      { status: 500 }
    );
  }
}