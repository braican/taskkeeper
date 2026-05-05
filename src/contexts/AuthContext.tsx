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

type AuthState = {
  isAuthenticated: boolean;
  user: AuthRecord | null;
} | null;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isValid = pb.authStore.isValid;
    setAuth({
      isAuthenticated: isValid,
      user: isValid ? pb.authStore.record : null,
    });

    if (isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => {
          pb.authStore.clear();
          setAuth({ isAuthenticated: false, user: null });
        });
    }
  }, [pathname]);

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
    setAuth({ isAuthenticated: false, user: null });
    router.push('/');
  };

  if (auth === null) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
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
