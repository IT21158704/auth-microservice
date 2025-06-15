"use client"
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL parameters
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

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
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/auth/reset-password-token?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password: formData.password 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || 'Password reset successfully!');
        
        // Redirect to login page after successful reset
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || result.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.password && formData.confirmPassword && token;

  // Show error if no token
  if (!token && searchParams.toString()) {
    return (
      <div className="flex items-center justify-center h-full p-4 bg-black">
        <div className="w-full max-w-md">
          <div className="p-8 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                  <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md"></div>
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">Invalid Reset Link</h1>
              <p className="text-gray-400">This password reset link is invalid or has expired.</p>
            </div>
            
            <button
              onClick={() => router.push('/forgot-password')}
              className="w-full px-4 py-3 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="p-8 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-blue-500" />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"></div>
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Reset Your Password</h1>
            <p className="text-gray-400">Enter your new password below</p>
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

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-10 pr-12 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-10 pr-12 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Confirm your new password"
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className={formData.password.length >= 8 ? 'text-green-400' : 'text-gray-400'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className={formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-400' : 'text-gray-400'}>
                    Passwords match
                  </span>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Remember your password?{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 bg-blue-500/5 blur-3xl"></div>
          <div className="absolute w-64 h-64 rounded-full bottom-1/4 right-1/4 bg-purple-500/5 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;