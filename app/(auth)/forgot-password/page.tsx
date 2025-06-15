"use client"
import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || 'Password reset link sent successfully!');
        setEmail(''); // Clear the email field
      } else {
        setError(result.error || result.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== '';

  return (
    <div className="flex items-center justify-center h-full p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="p-8 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Mail className="w-12 h-12 text-blue-500" />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"></div>
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-gray-400">Enter your email to receive a reset link</p>
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

          {/* Forgot Password Form */}
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
                  value={email}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center space-x-2 font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
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

export default ForgotPasswordPage;