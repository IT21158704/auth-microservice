"use client"
import React, { useState } from 'react';
import { UserPlus, Mail, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      isVerified: boolean;
    };
  };
  error?: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post<RegisterResponse>(
        'https://auth-microservice-orpin.vercel.app/api/auth/register',
        {
          email: formData.email,
          password: formData.password
        }
      );

      if (response.data.success) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && formData.confirmPassword;

  return (
    <div className="flex items-center justify-center h-full p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="p-8 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <UserPlus className="w-12 h-12 text-green-500" />
                <div className="absolute inset-0 rounded-full bg-green-500/20 blur-md"></div>
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400">Sign up for a new account</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="flex items-center p-4 mb-6 space-x-3 border rounded-lg bg-red-500/10 border-red-500/20">
              <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center p-4 mb-6 space-x-3 border rounded-lg bg-green-500/10 border-green-500/20">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-400" />
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-10 pr-12 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-10 pr-12 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-1 text-green-500 bg-gray-800 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <a href="/terms" className="text-green-400 transition-colors hover:text-green-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-green-400 transition-colors hover:text-green-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-green-400 transition-colors hover:text-green-300">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 bg-green-500/5 blur-3xl"></div>
          <div className="absolute w-64 h-64 rounded-full bottom-1/4 right-1/4 bg-blue-500/5 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;