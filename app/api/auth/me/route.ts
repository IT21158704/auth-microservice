import connectToDatabase from '@/lib/mongo';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
        error: 'User ID not found in token',
      }, { status: 401 });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        error: 'Invalid user',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
   
  } catch (error) {
    console.error('User Fetch Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: 'Something went wrong',
    }, { status: 500 });
  }
}