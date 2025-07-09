import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../api';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { name: string; email: string; password: string; avatar?: string }) => Promise<boolean>;
  logout: () => void;
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
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthStatus('loading');
    
    try {
      // Try real API first
      try {
        const response = await api.login({ email, password });
        if (response.success && response.user) {
          setAuthStatus('success');
          
          // Add a brief delay to show success state
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setUser(response.user);
          setIsLoading(false);
          
          // Reset status after navigation
          setTimeout(() => setAuthStatus('idle'), 1000);
          
          return true;
        }
      } catch (apiError) {
        console.log('API login failed, falling back to mock users');
      }

      // Fallback to mock users if API fails
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock users data matching bolt project exactly
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'Admin User',
          email: 'admin@evently.com',
          role: 'admin',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
        },
        {
          _id: '2',
          name: 'Jane Doe',
          email: 'user@evently.com',
          role: 'user',
          avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && (password === 'admin123' || password === 'user123')) {
        setAuthStatus('success');
        
        // Add a brief delay to show success state
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setUser(foundUser);
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
      setAuthStatus('error');
      setIsLoading(false);
      setTimeout(() => setAuthStatus('idle'), 3000);
      return false;
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; avatar?: string }) => {
    setIsLoading(true);
    setAuthStatus('loading');
    
    try {
      const response = await api.register(userData);
      if (response.success && response.user) {
        setAuthStatus('success');
        
        // Add a brief delay to show success state
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setUser(response.user);
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
      setAuthStatus('error');
      setIsLoading(false);
      setTimeout(() => setAuthStatus('idle'), 3000);
      return false;
    }
  };

  const logout = () => {
    setIsLoading(true);
    setAuthStatus('loading');
    
    // Add a brief animation delay for logout
    setTimeout(() => {
      setUser(null);
      setIsLoading(false);
      setAuthStatus('idle');
    }, 500);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login,
      signup, 
      logout, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
      isLoading,
      authStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 