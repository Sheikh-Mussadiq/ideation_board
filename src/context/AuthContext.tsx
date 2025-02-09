import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginToSocialHub } from '../services/socialhubAuth';

interface User {
  email: string;
  authType: 'local' | 'socialhub';
  accessToken?: string;
}

const VALID_USERS: { email: string; password: string }[] = [
  { email: 'david.neuhaus@maloon.de', password: 'rtecPPp337!' },
  { email: 'matthias.gerer@maloon.de', password: 'rtecPPp337!' }
];

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string, authType: 'local' | 'socialhub') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string, authType: 'local' | 'socialhub') => {
    try {
      if (authType === 'local') {
        const user = VALID_USERS.find(u => u.email === email && u.password === password);
        if (user) {
          setCurrentUser({ email, authType: 'local' });
          setIsAuthenticated(true);
          return true;
        }
      } else {
        const response = await loginToSocialHub(email, password);
        if (response?.accessToken) {
          setCurrentUser({
            email,
            authType: 'socialhub',
            accessToken: response.accessToken
          });
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
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