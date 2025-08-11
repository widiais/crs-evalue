'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  firstName: string;
  lastName: string;
  clientId: string;
  userType: string;
  jobTitle: string;
  roleId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Prevent multiple initialization
    if (initialized) return;
    
    const checkAuth = async () => {
      try {
        // Skip auth check if not in browser environment
        if (typeof window === 'undefined') {
          setLoading(false);
          setInitialized(true);
          return;
        }

        const token = authService.getToken();
        const userData = authService.getUser();
        
        if (token && userData) {
          const isValid = await authService.validateToken();
          
          if (isValid) {
            setUser(userData);
          } else {
            authService.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    // Delay auth check to avoid hydration mismatch
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [initialized]);

  const login = async (email: string, password: string) => {
    try {
      // console.log('Attempting login...');
      const response = await authService.login({ email, password });
      // console.log('Login response:', response);
      
      if (response.success && response.user) {
        // console.log('Setting user:', response.user.name);
        setUser(response.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login gagal' 
        };
      }
    } catch (error) {
      console.error('Login error in context:', error);
      return { 
        success: false, 
        message: 'Terjadi kesalahan saat login' 
      };
    }
  };

  const loginAdmin = async (username: string, password: string) => {
    try {
      const response = await authService.loginAsAdmin(username, password);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login admin gagal' };
    } catch (error) {
      return { success: false, message: 'Terjadi kesalahan saat login admin' };
    }
  };

  const logout = () => {
    // console.log('Logging out...');
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    loading,
    login,
    loginAdmin,
    logout,
    isAuthenticated: !!user && !loading,
  };

  // console.log('AuthContext state:', { 
  //   user: !!user, 
  //   loading, 
  //   isAuthenticated: !!user && !loading,
  //   initialized 
  // });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Jangan lempar error di production. Berikan fallback aman agar halaman tidak 500
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      login: async () => ({ success: false, message: 'Auth belum siap' }),
      loginAdmin: async () => ({ success: false, message: 'Auth belum siap' }),
      logout: () => {},
      isAuthenticated: false,
    };
  }
  return context;
}