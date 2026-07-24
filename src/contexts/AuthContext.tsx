// contexts/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import pb from '../lib/pocketbase';
import { AuthRecord, ClientResponseError } from 'pocketbase';

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

  useEffect(() => {
    const syncAuth = () => {
      const isValid = pb.authStore.isValid;
      setAuth({
        isAuthenticated: isValid,
        user: isValid ? pb.authStore.record : null,
      });
    };

    // Reacting to the store directly (rather than to route changes) means
    // login/logout are reflected the instant they happen, before any
    // navigation triggered by them runs. Deriving this from `pathname`
    // instead left a window where a just-completed login/logout hadn't been
    // picked up yet by the time a newly-mounted route's components (e.g.
    // ProtectedGuard) read `isAuthenticated`, causing spurious redirects.
    const unsubscribe = pb.authStore.onChange(syncAuth);

    // A token can be expired on arrival (e.g. after 30 days), in which case
    // authRefresh() below is never attempted and never gets a chance to clear
    // it. Without this, the stale pb_auth cookie keeps telling the proxy the
    // user is authenticated, which fights with the client's own logged-out
    // state and produces a redirect loop between "/" and "/dashboard".
    if (!pb.authStore.isValid && pb.authStore.token) {
      pb.authStore.clear();
    } else {
      syncAuth();
    }

    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch((err) => {
          // PocketBase auto-cancels a duplicate in-flight request to the
          // same endpoint when another one is made; that's not a real auth
          // failure and must not be treated as one.
          if (err instanceof ClientResponseError && err.isAbort) {
            return;
          }
          pb.authStore.clear();
        });
    }

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await pb.collection('users').authWithOAuth2({ provider: 'google' });
      router.push('/dashboard');
    } catch (err) {
      console.error('OAuth2 login failed', err);
    }
  };

  const logout = () => {
    // ProtectedGuard reacts to the resulting isAuthenticated:false and
    // navigates away; a second explicit navigation here raced with it.
    pb.authStore.clear();
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
