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
  export interface StorageInterface {
    setItem: (key: string, value: string) => void;
    getItem: (key: string) => string | null;
    removeItem: (key: string) => void;
  }

  export interface User {
    id: string;
    email: string;
    isVerified: boolean;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
    };
  }