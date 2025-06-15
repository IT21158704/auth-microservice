import React from 'react';
import { Shield, Lock, User, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-blue-500" />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AuthGuard
                </h1>
                <p className="text-xs text-gray-500">Authentication Service</p>
              </div>
            </div>
            
            <ul className="hidden md:flex items-center space-x-6">
              <li>
                <a href="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/auth/login" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white">
                  <Lock className="w-4 h-4" />
                  <span>Login</span>
                </a>
              </li>
              <li>
                <a href="/settings" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-gray-300 hover:text-white">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg border border-red-600/20 hover:border-red-600/40 transition-all duration-200">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="w-4 h-0.5 bg-gray-400 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-400 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-400"></span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-green-500/2 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                &copy; 2025 AuthGuard Microservice. Secure by design.
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Service Online</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="/docs" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                API Docs
              </a>
              <a href="/status" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                Status
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                Privacy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                Terms
              </a>
            </div>
          </div>
          
          {/* API Status Bar */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
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
                <span className="text-xs text-gray-500 ml-2">Response Time</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;