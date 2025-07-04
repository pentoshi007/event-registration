import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { login, isLoading, authStatus } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(credentials.email, credentials.password);
      if (success) {
        // Add a smooth transition before redirect
        setTimeout(() => {
          // Redirect based on user role
          if (credentials.email === 'admin@evently.com') {
            navigate('/admin');
          } else {
            navigate('/'); // Redirect all users to homepage
          }
        }, 500);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    setError('');
    
    const demoCredentials = {
      admin: { email: 'admin@evently.com', password: 'admin123' },
      user: { email: 'user@evently.com', password: 'user123' }
    };

    try {
      const success = await login(demoCredentials[role].email, demoCredentials[role].password);
      if (success) {
        // Add a smooth transition before redirect
        setTimeout(() => {
          // Redirect based on role
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/'); // Redirect all users to homepage
          }
        }, 500);
      } else {
        setError('Demo login failed');
      }
    } catch {
      setError('Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in-delay">
          <div className="bg-blue-600/10 backdrop-blur-sm p-3 rounded-xl w-16 h-16 mx-auto mb-4 shadow-lg border border-gray-200 flex items-center justify-center transform hover:scale-110 transition-all duration-300">
            <div className="w-10 h-10">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path 
                  clipRule="evenodd" 
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" 
                  fill="currentColor" 
                  fillRule="evenodd"
                  className="text-blue-600"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your Evently account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-8 animate-slide-in-left">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Indicators */}
            {authStatus === 'success' && (
              <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm animate-fade-in flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center animate-scale-in">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                </div>
                <span>Login successful! Redirecting...</span>
              </div>
            )}
            
            {authStatus === 'error' && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-red-600 rounded-full flex items-center justify-center animate-scale-in">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <span>{error || 'Authentication failed'}</span>
              </div>
            )}
            
            {error && authStatus === 'idle' && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading || authStatus === 'success'}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg disabled:cursor-not-allowed transform ${
                authStatus === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 scale-105' 
                  : authStatus === 'loading'
                  ? 'bg-blue-400 scale-95'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'
              } ${isLoading || authStatus === 'success' ? 'disabled:scale-100' : ''} text-white`}
            >
              {authStatus === 'loading' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : authStatus === 'success' ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center mr-2 animate-scale-in">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  Success!
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Demo Access</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading || authStatus === 'success'}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg text-white transform ${
                isLoading ? 'opacity-50 scale-95' : 'hover:scale-105'
              } ${authStatus === 'success' ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'} disabled:cursor-not-allowed`}
            >
              {authStatus === 'loading' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  <span className="text-xs">Loading...</span>
                </div>
              ) : (
                'Demo Admin'
              )}
            </button>
            <button
              onClick={() => handleDemoLogin('user')}
              disabled={isLoading || authStatus === 'success'}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg text-white transform ${
                isLoading ? 'opacity-50 scale-95' : 'hover:scale-105'
              } ${authStatus === 'success' ? 'bg-green-600' : 'bg-green-600 hover:bg-green-700'} disabled:cursor-not-allowed`}
            >
              {authStatus === 'loading' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  <span className="text-xs">Loading...</span>
                </div>
              ) : (
                'Demo User'
              )}
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <div className="text-center animate-fade-in-delay">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 