import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginToSocialHub } from '../services/socialhubAuth';

const VALID_USERS = [
  { email: 'david.neuhaus@maloon.de', password: 'rtecPPp337!' },
  { email: 'matthias.gerer@maloon.de', password: 'rtecPPp337!' }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback(async (email, password, authType) => {
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}