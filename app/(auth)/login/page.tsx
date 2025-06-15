"use client"
import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { authUtils } from '@/utils/auth';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authUtils.login(formData.email, formData.password);

      if (result.success && result.data) {
        setSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError(result.message || result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="flex items-center justify-center h-full p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="p-8 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Lock className="w-12 h-12 text-blue-500" />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"></div>
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
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

          {/* Login Form */}
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
                  className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
                  className="w-full py-3 pl-10 pr-12 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Enter your password"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-blue-400 transition-colors hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
                Sign up
              </a>
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

export default LoginPage;