export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface JWTPayload {
    userId: string;
    email: string;
    type?: 'access' | 'refresh' | 'email' | 'reset';
  }
  
  export interface LoginAttempt {
    count: number;
    lastAttempt: Date;
    lockUntil?: Date;
  }