'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthorized: boolean;
  signInWithCredentials: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded admin credentials (in production, this should be in a secure database)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  user: {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@crs-system.com',
    displayName: 'Administrator',
    role: 'admin'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('crs_admin_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('crs_admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const isAuthorized = user?.role === 'admin';

  const signInWithCredentials = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminUser = ADMIN_CREDENTIALS.user;
        setUser(adminUser);
        
        // Save to localStorage for persistence
        localStorage.setItem('crs_admin_user', JSON.stringify(adminUser));
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('crs_admin_user');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthorized,
    signInWithCredentials,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 