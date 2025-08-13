import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../api';

// AuthContext provides authentication state and logic for the app
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    location: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  authStatus: 'idle' | 'loading' | 'success' | 'error';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Store token separately if it exists in user object
      if ((user as any).token) {
        localStorage.setItem('token', (user as any).token);
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthStatus('loading');

    try {
      const data = await api.authLogin(email, password);

      if (data.success && data.user) {
        setAuthStatus('success');

        // Add a brief delay to show success state
        await new Promise(resolve => setTimeout(resolve, 800));

        // Store token separately
        if (data.user.token) {
          localStorage.setItem('token', data.user.token);
        }

        setUser(data.user);
        setIsLoading(false);

        // Reset status after navigation
        setTimeout(() => setAuthStatus('idle'), 1000);

        return true;
      } else {
        setAuthStatus('error');
        setIsLoading(false);

        // Reset error status after delay
        setTimeout(() => setAuthStatus('idle'), 3000);

        return false;
      }
    } catch (error) {
      console.error('Login error:', error);

      // Fallback for demo users if API fails
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'Admin User',
          email: 'admin@evently.com',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1-555-0001',
          dateOfBirth: '1990-01-01',
          location: 'San Francisco, CA'
        },
        {
          _id: '2',
          name: 'Demo User',
          email: 'user@evently.com',
          role: 'user',
          avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          phone: '+1-555-0002',
          dateOfBirth: '1995-05-15',
          location: 'New York, NY'
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && (password === 'admin123' || password === 'user123')) {
        console.log('Using fallback demo user login');
        setAuthStatus('success');

        // Add a brief delay to show success state
        await new Promise(resolve => setTimeout(resolve, 800));

        // For demo users, create a mock token
        const mockToken = `demo-token-${foundUser._id}-${Date.now()}`;
        localStorage.setItem('token', mockToken);

        setUser(foundUser);
        setIsLoading(false);

        // Reset status after navigation
        setTimeout(() => setAuthStatus('idle'), 1000);

        return true;
      }

      setAuthStatus('error');
      setIsLoading(false);
      setTimeout(() => setAuthStatus('idle'), 3000);
      return false;
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth: string;
    location: string;
  }) => {
    setIsLoading(true);
    setAuthStatus('loading');

    try {
      const data = await api.authRegister(userData);

      if (data.success) {
        setAuthStatus('success');

        // Store token if provided
        if (data.user && data.user.token) {
          localStorage.setItem('token', data.user.token);
        }

        // Add a brief delay to show success state
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsLoading(false);

        // Reset status after navigation
        setTimeout(() => setAuthStatus('idle'), 1000);
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      setAuthStatus('error');
      setIsLoading(false);

      // Reset error status after delay
      setTimeout(() => setAuthStatus('idle'), 3000);

      throw error;
    }
  };

  const logout = () => {
    setIsLoading(true);
    setAuthStatus('loading');

    // Add a brief animation delay for logout
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsLoading(false);
      setAuthStatus('idle');
    }, 500);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // The useEffect will automatically update localStorage
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      authStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 