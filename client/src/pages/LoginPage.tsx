import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import loginBG from './loginBG.png';

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
    <div className="min-h-screen w-full flex flex-col md:flex-row" style={{ backgroundImage: `url(${loginBG})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Left: Login Box */}
      <div className="w-full md:w-1/2 flex items-start justify-center relative z-10 pt-0 md:pt-2 mt-0 md:mt-2">
        <div className="max-w-[25rem] w-full space-y-8 p-4 mt-4">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 drop-shadow-lg">Welcome to Eventnity</h1>
            <p className="text-gray-900 text-sm drop-shadow-md">Login to your account to continue</p>
          </div>
          {/* Logo removed as per user request */}
          {/* Login Form */}
          <div className="rounded-2xl border border-blue-100 shadow-2xl p-8 animate-slide-in-left">
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
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg disabled:cursor-not-allowed transform ${authStatus === 'success'
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
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg text-white transform ${isLoading ? 'opacity-50 scale-95' : 'hover:scale-105'
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
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg text-white transform ${isLoading ? 'opacity-50 scale-95' : 'hover:scale-105'
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
      {/* Right: Event Image */}
    </div>
  );
};

export default LoginPage; 