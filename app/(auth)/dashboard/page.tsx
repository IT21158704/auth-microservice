"use client"
import React, { useState, useEffect } from 'react';
import { User, Settings, Calendar, Mail, CheckCircle, AlertCircle, Loader2, Key, Shield } from 'lucide-react';
import { authUtils } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import api from '@/utils/auth';

// Type definitions
interface UserProfile {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
  };
  error?: string;
}

interface ResetPasswordFormData {
  email: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  
  // State with proper TypeScript types
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<string>('');
  const [resetError, setResetError] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        // Check if user is authenticated
        if (!authUtils.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await api.get<ApiResponse>('/auth/me');

        if (response.data.success && response.data.data) {
          setUser(response.data.data.user);
        } else {
          setError(response.data.message || 'Failed to fetch user profile');
        }
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error.response?.status === 401) {
          authUtils.logout();
        } else {
          setError('Failed to load user profile. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      // Replace with your actual reset password endpoint
      const response = await api.post<ApiResponse>('/auth/forgot-password', {
        email: resetEmail
      });

      if (response.data.success) {
        setResetSuccess('Password reset link sent to your email!');
        setResetEmail('');
        setTimeout(() => {
          setShowResetPassword(false);
          setResetSuccess('');
        }, 3000);
      } else {
        setResetError(response.data.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      setResetError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setResetEmail(e.target.value);
  };

  const handleCloseResetModal = (): void => {
    setShowResetPassword(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess('');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-xl text-white">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center p-4 space-x-3 border rounded-lg bg-red-500/10 border-red-500/20">
          <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-white">Welcome to Your Dashboard</h1>
        <p className="text-gray-400">Manage your account and settings</p>
      </div>

      {/* Reset Password Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowResetPassword(true)}
          className="flex items-center px-6 py-3 space-x-2 text-sm text-gray-300 transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
        >
          <Key className="w-4 h-4" />
          <span>Reset Password</span>
        </button>
      </div>

      {/* Profile Information Card */}
      <div className="p-6 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            user?.isVerified 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-yellow-500/10 border border-yellow-500/20'
          }`}>
            {user?.isVerified ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Verified</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">Unverified</span>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Email */}
          <div className="flex items-center p-4 space-x-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400">Email Address</p>
              <p className="font-medium text-white truncate">{user?.email}</p>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-center p-4 space-x-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400">User ID</p>
              <p className="font-mono text-sm text-white truncate">{user?.id}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center p-4 space-x-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="font-medium text-white">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center p-4 space-x-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500/10">
              <Settings className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-400">Last Updated</p>
              <p className="font-medium text-white">{user?.updatedAt ? formatDate(user.updatedAt) : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
        <h3 className="mb-4 text-xl font-bold text-white">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <button 
            type="button"
            className="flex items-center p-4 space-x-3 text-left transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
          >
            <Settings className="w-5 h-5 text-blue-400" />
            <span className="text-white">Account Settings</span>
          </button>
          <button 
            type="button"
            className="flex items-center p-4 space-x-3 text-left transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
          >
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-white">Security</span>
          </button>
          <button 
            type="button"
            className="flex items-center p-4 space-x-3 text-left transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
          >
            <User className="w-5 h-5 text-purple-400" />
            <span className="text-white">Profile</span>
          </button>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="w-full max-w-md p-6 bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Reset Password</h3>
            
            {resetError && (
              <div className="flex items-center p-3 mb-4 space-x-2 border rounded-lg bg-red-500/10 border-red-500/20">
                <AlertCircle className="flex-shrink-0 w-4 h-4 text-red-400" />
                <p className="text-sm text-red-400">{resetError}</p>
              </div>
            )}

            {resetSuccess && (
              <div className="flex items-center p-3 mb-4 space-x-2 border rounded-lg bg-green-500/10 border-green-500/20">
                <CheckCircle className="flex-shrink-0 w-4 h-4 text-green-400" />
                <p className="text-sm text-green-400">{resetSuccess}</p>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block mb-2 text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={resetLoading || !resetEmail}
                  className="flex items-center justify-center flex-1 px-4 py-2 space-x-2 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseResetModal}
                  className="px-4 py-2 font-medium text-gray-300 transition-colors bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;