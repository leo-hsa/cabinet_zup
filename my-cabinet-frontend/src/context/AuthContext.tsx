import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import api from '../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  iin: string | null;
  login: (iin: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('access_token'),
  );
  const [iin, setIin] = useState<string | null>(
    () => localStorage.getItem('user_iin'),
  );

  const login = useCallback(async (iin: string, password: string) => {
    const { data } = await api.post('/auth/login', { iin, password });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user_iin', iin);
    setIsAuthenticated(true);
    setIin(iin);
  }, []);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      api.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {});
    }
    localStorage.clear();
    setIsAuthenticated(false);
    setIin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, iin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
