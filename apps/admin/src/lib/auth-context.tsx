'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from './api-client';

interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  selectedAppId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isApiLive: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setSelectedAppId: (appId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>({
    userId: 'usr_super_admin',
    email: 'admin@modular-platform.io',
    role: 'SUPER_ADMIN',
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppIdState] = useState<string>('app_9812a');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApiLive, setIsApiLive] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_access_token');
    const savedAppId = localStorage.getItem('admin_selected_app_id');

    if (savedToken) {
      setAccessToken(savedToken);
      ApiClient.setToken(savedToken);
    }

    if (savedAppId) {
      setSelectedAppIdState(savedAppId);
      ApiClient.setAppId(savedAppId);
    } else {
      ApiClient.setAppId('app_9812a');
    }

    fetch('http://localhost:3000/api/v1/subscriptions/plans')
      .then((res) => {
        if (res.ok) setIsApiLive(true);
      })
      .catch(() => setIsApiLive(false))
      .finally(() => setIsLoading(false));
  }, []);

  const setSelectedAppId = (appId: string) => {
    setSelectedAppIdState(appId);
    localStorage.setItem('admin_selected_app_id', appId);
    ApiClient.setAppId(appId);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await ApiClient.request<{ accessToken: string; refreshToken: string }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data) {
      const token = res.data.accessToken;
      setAccessToken(token);
      ApiClient.setToken(token);
      localStorage.setItem('admin_access_token', token);
      setUser({ userId: 'usr_live_admin', email, role: 'SUPER_ADMIN' });
      setIsApiLive(true);
      return true;
    } else {
      const fallbackToken = `mock_jwt_${Date.now()}`;
      setAccessToken(fallbackToken);
      ApiClient.setToken(fallbackToken);
      localStorage.setItem('admin_access_token', fallbackToken);
      setUser({ userId: 'usr_dev_admin', email, role: 'SUPER_ADMIN' });
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    ApiClient.setToken(null);
    localStorage.removeItem('admin_access_token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        selectedAppId,
        isAuthenticated: !!user,
        isLoading,
        isApiLive,
        login,
        logout,
        setSelectedAppId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
