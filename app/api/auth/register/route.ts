import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongo';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { generateEmailVerificationToken } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';
import { registerSchema } from '@/lib/validation';
import { ApiResponse } from '@/types/types';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    console.log('📝 Registration attempt for:', body.email);
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password } = validatedData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Registration failed: User already exists');
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Registration failed',
          error: 'User with this email already exists'
        },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      isVerified: false,
    });
    
    const savedUser = await newUser.save();
    console.log('✅ User created successfully:', savedUser._id);
    
    // Generate email verification token
    const emailToken = generateEmailVerificationToken({
      userId: savedUser._id.toString(),
      email: savedUser.email,
    });
    
    // Send verification email
    await sendVerificationEmail(email, emailToken);
    
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        data: {
          userId: savedUser._id,
          email: savedUser.email,
          isVerified: savedUser.isVerified,
        }
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
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
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: 'Registration failed',
          error: 'User with this email already exists'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: 'Internal server error',
        error: 'Registration failed due to server error'
      },
      { status: 500 }
    );
  }
}