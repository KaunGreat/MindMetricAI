
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../utils/api.ts';

const MOCK_AUTH = true;

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        if (MOCK_AUTH) {
          // Simulate fetching mock user from local token
          setUser({ id: 1, email: 'mock@mindmetric.ai' });
        } else {
          try {
            const userData = await getCurrentUser(token);
            setUser(userData);
          } catch (error) {
            console.error("Session expired or invalid token");
            logout();
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    if (MOCK_AUTH) {
      await new Promise(r => setTimeout(r, 1000));
      const fakeToken = 'mock-jwt-token';
      const fakeUser = { id: 1, email };
      
      localStorage.setItem('token', fakeToken);
      setToken(fakeToken);
      setUser(fakeUser);
      return;
    }

    const data = await loginUser(email, password);
    const newToken = data.access_token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const userData = await getCurrentUser(newToken);
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    if (MOCK_AUTH) {
      await new Promise(r => setTimeout(r, 1000));
      return;
    }
    await registerUser(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
