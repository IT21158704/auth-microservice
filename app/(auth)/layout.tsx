"use client"
import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, Settings, LogOut, LogIn } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mock authentication check (replace with actual localStorage in your project)
  useEffect(() => {
    const checkAuth = (): void => {
      // In your actual project, use: authUtils.isAuthenticated()
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          setIsAuthenticated(true);
          try {
            const user: User = JSON.parse(userStr);
            setCurrentUser(user);
          } catch (error) {
            console.error('Error parsing user data:', error);
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (): void => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = (): void => {
    // In your actual project, use: authUtils.logout()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setCurrentUser(null);
      window.location.href = '/login';
    }
  };
  return (
    <div className="flex flex-col min-h-screen text-white bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-2xl">
        <div className="container px-4 py-4 mx-auto">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-blue-500" />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  AuthGuard
                </h1>
                <p className="text-xs text-gray-500">Authentication Service</p>
              </div>
            </div>

            <ul className="items-center hidden space-x-6 md:flex">
              {isAuthenticated ? (
                <>
                  <li>
                    <a href="/dashboard" className="flex items-center px-3 py-2 space-x-2 text-gray-300 transition-all duration-200 rounded-lg hover:bg-gray-800 hover:text-white">
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </a>
                  </li>
                  <li>
                    <a href="/settings" className="flex items-center px-3 py-2 space-x-2 text-gray-300 transition-all duration-200 rounded-lg hover:bg-gray-800 hover:text-white">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-300">{currentUser?.email}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.isVerified ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 space-x-2 text-red-400 transition-all duration-200 border rounded-lg bg-red-600/10 hover:bg-red-600/20 border-red-600/20 hover:border-red-600/40"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/login" className="flex items-center px-4 py-2 space-x-2 text-blue-400 transition-all duration-200 border rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/20 hover:border-blue-600/40">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </a>
                  </li>
                  <li>
                    <a href="/register" className="flex items-center px-3 py-2 space-x-2 text-gray-300 transition-all duration-200 rounded-lg hover:bg-gray-800 hover:text-white">
                      <User className="w-4 h-4" />
                      <span>Register</span>
                    </a>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile menu button */}
            <button className="p-2 transition-colors rounded-lg md:hidden hover:bg-gray-800">
              <div className="flex flex-col items-center justify-center w-6 h-6">
                <span className="w-4 h-0.5 bg-gray-400 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-400 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-400"></span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-grow">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 blur-3xl"></div>
          <div className="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/3 blur-3xl"></div>
          <div className="absolute w-64 h-64 rounded-full top-3/4 left-3/4 bg-green-500/2 blur-3xl"></div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-400">
                &copy; 2025 AuthGuard Microservice. Secure by design.
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Service Online</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <a href="/docs" className="text-sm text-gray-400 transition-colors hover:text-gray-300">
                API Docs
              </a>
              <a href="/status" className="text-sm text-gray-400 transition-colors hover:text-gray-300">
                Status
              </a>
              <a href="/privacy" className="text-sm text-gray-400 transition-colors hover:text-gray-300">
                Privacy
              </a>
              <a href="/terms" className="text-sm text-gray-400 transition-colors hover:text-gray-300">
                Terms
              </a>
            </div>
          </div>

          {/* API Status Bar */}
          <div className="pt-4 mt-4 border-t border-gray-800">
            <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>API Version: v1.2.0</span>
                <span>•</span>
                <span>Region: US-East</span>
                <span>•</span>
                <span>Uptime: 99.9%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="ml-2 text-xs text-gray-500">Response Time</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;