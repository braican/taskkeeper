// contexts/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import pb from '../lib/pocketbase';
import { AuthRecord } from 'pocketbase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthRecord | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means loading.
  const [user, setUser] = useState<AuthRecord | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthenticated(pb.authStore.isValid);
      setUser(pb.authStore.isValid ? pb.authStore.record : null);
    };

    checkAuth();
  }, [pathname, router]);

  // While checking auth status, show loading state
  if (isAuthenticated === null) {
    return;
  }

  const login = async () => {
    try {
      await pb.collection('users').authWithOAuth2({ provider: 'google' });
      router.push('/dashboard');
    } catch (err) {
      console.error('OAuth2 login failed', err);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
