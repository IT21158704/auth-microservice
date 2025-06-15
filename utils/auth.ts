// utils/auth.ts
import { LoginResponse, User, ApiResponse } from '@/types/types';
import axios, { AxiosResponse } from 'axios';

// Define the AuthResult type to match your API response structure
interface AuthResult {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  error?: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://auth-microservice-orpin.vercel.app/api',
  timeout: 10000,
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Fixed: Use AxiosResponse instead of LoginResponse
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const response = await axios.post<LoginResponse>(
              'https://auth-microservice-orpin.vercel.app/api/auth/refresh',
              { refreshToken }
            );

            if (response.data.success && response.data.data) {
              const { accessToken } = response.data.data.tokens;
              localStorage.setItem('accessToken', accessToken);

              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return api(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authUtils.logout();
      }
    }

    return Promise.reject(error);
  }
);

// Authentication helper functions
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user data
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get access token
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('accessToken');
  },

  // Login function
  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await axios.post<LoginResponse>(
        'https://auth-microservice-orpin.vercel.app/api/auth/login',
        { email, password }
      );

      if (response.data.success && response.data.data) {
        const { user, tokens } = response.data.data;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Login failed',
        error: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data?.error || error.message
      };
    }
  },

  // Logout function
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  // Check token expiration
  isTokenExpired: (): boolean => {
    if (typeof window === 'undefined') return true;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
};

// Export the AuthResult type for use in other files
export type { AuthResult };

// Export configured axios instance
export default api;

// Usage examples:

// In your components:
// import api, { authUtils, AuthResult } from '@/utils/auth';

// Making authenticated requests:
// const fetchUserData = async () => {
//   try {
//     const response = await api.get('/user/profile');
//     console.log(response.data);
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//   }
// };

// Using login function:
// const handleLogin = async (email: string, password: string) => {
//   const result: AuthResult = await authUtils.login(email, password);
//   if (result.success) {
//     console.log('Login successful:', result.message);
//     console.log('User:', result.data?.user);
//     console.log('Access token:', result.data?.tokens.accessToken);
//   } else {
//     console.error('Login failed:', result.message || result.error);
//   }
// };

// Check authentication status:
// const isLoggedIn = authUtils.isAuthenticated();
// const currentUser = authUtils.getCurrentUser();