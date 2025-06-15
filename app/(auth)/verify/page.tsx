"use client"
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';

const EmailVerificationPage = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('error');
          setMessage('No verification token found in the URL.');
          return;
        }

        // Make GET request to verification API
        const response = await fetch(
          `https://auth-microservice-orpin.vercel.app/api/auth/verify-email?token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Redirect to login or dashboard after 3 seconds
          setTimeout(() => {
            window.location.href = '/login'; // Change this to your desired redirect URL
          }, 3000);
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.message || 'Email verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Mail className="w-16 h-16 text-blue-500" />
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold text-white">Verifying Your Email</h1>
            <p className="text-gray-400 text-center max-w-md">
              Please wait while we verify your email address. This should only take a moment.
            </p>
            <div className="flex space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="absolute inset-0 animate-ping">
                <CheckCircle className="w-16 h-16 text-green-500 opacity-75" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Email Verified!</h1>
            <p className="text-gray-400 text-center max-w-md">
              {message}
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
              <p className="text-green-400 text-sm text-center">
                Redirecting you to login page in a few seconds...
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-2xl font-bold text-white">Verification Failed</h1>
            <p className="text-gray-400 text-center max-w-md">
              {message}
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
              <p className="text-red-400 text-sm text-center">
                Please check your email for a new verification link or contact support.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 border border-gray-600"
            >
              Go to Homepage
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-black flex items-center justify-center p-4">
      <div className="h-full w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {renderContent()}
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage