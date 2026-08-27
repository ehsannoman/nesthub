import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import { setAuthToken } from '../api/apiClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App খোলার সময় আগের session আছে কিনা চেক করছি
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('nesthub_token');
        const userJson = await SecureStore.getItemAsync('nesthub_user');
        if (token && userJson) {
          setAuthToken(token);
          setUser(JSON.parse(userJson));
        }
      } catch (err) {
        console.log('Failed to restore session', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (userData: User, token: string) => {
    setAuthToken(token);
    setUser(userData);
    await SecureStore.setItemAsync('nesthub_token', token);
    await SecureStore.setItemAsync('nesthub_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync('nesthub_token');
    await SecureStore.deleteItemAsync('nesthub_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}