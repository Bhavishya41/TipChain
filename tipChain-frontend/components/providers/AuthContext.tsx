'use client';

// components/providers/AuthContext.tsx
// JWT auth context — stores the creator JWT from the OAuth claim flow in localStorage.
// Dashboard is hidden/locked unless a valid token is present.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const JWT_KEY = 'tipchain_creator_jwt';

interface AuthPayload {
  handle: string;
  youtubeChannelId: string | null;
  wallet: string | null;
}

interface AuthContextValue {
  token: string | null;
  user: AuthPayload | null;
  isAuthenticated: boolean;
  login: (jwt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

/** Decode JWT payload without verifying signature (client-side display only). */
function decodeJWT(token: string): AuthPayload | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);
    return {
      handle: payload.sub ?? '',
      youtubeChannelId: payload.youtubeChannelId ?? null,
      wallet: payload.wallet ?? null,
    };
  } catch {
    return null;
  }
}

/** Check if a decoded JWT is expired (exp field is in seconds). */
function isExpired(token: string): boolean {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json);
    if (!exp) return false;
    return Date.now() / 1000 > exp;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthPayload | null>(null);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(JWT_KEY);
    if (stored && !isExpired(stored)) {
      setToken(stored);
      setUser(decodeJWT(stored));
    } else if (stored) {
      localStorage.removeItem(JWT_KEY); // evict expired token
    }
  }, []);

  function login(jwt: string) {
    localStorage.setItem(JWT_KEY, jwt);
    setToken(jwt);
    setUser(decodeJWT(jwt));
  }

  function logout() {
    localStorage.removeItem(JWT_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
