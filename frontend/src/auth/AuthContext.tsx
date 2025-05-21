import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await api.get<User>('/users/me');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('alya_token');
    if (token) fetchMe();
    else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('alya_token', data.accessToken);
    setUser(data.user);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const { data } = await api.post('/auth/register', { email, password, fullName });
    localStorage.setItem('alya_token', data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('alya_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
