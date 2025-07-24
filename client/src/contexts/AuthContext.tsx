import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

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
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if email already exists (mock validation)
      const existingEmails = ['admin@evently.com', 'user@evently.com'];
      if (existingEmails.includes(userData.email)) {
        throw new Error('Email already exists. Please use a different email.');
      }
      
      // Create new user
      const newUser: User = {
        _id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'user',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        location: userData.location
      };
      
      setAuthStatus('success');
      
      // Add a brief delay to show success state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoading(false);
      
      // Reset status after navigation
      setTimeout(() => setAuthStatus('idle'), 1000);
      
    } catch (error: any) {
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