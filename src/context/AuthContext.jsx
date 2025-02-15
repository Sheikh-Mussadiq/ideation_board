// import React, { createContext, useContext, useState, useCallback } from 'react';
// import { loginToSocialHub } from '../services/socialhubAuth';

// const VALID_USERS = [
//   { email: 'david.neuhaus@maloon.de', password: 'rtecPPp337!' },
//   { email: 'matthias.gerer@maloon.de', password: 'rtecPPp337!' }
// ];

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   const login = useCallback(async (email, password, authType) => {
//     try {
//       if (authType === 'local') {
//         const user = VALID_USERS.find(u => u.email === email && u.password === password);
//         if (user) {
//           setCurrentUser({ email, authType: 'local' });
//           setIsAuthenticated(true);
//           return true;
//         }
//       } else {
//         const response = await loginToSocialHub(email, password);
//         if (response?.accessToken) {
//           setCurrentUser({
//             email,
//             authType: 'socialhub',
//             accessToken: response.accessToken
//           });
//           setIsAuthenticated(true);
//           return true;
//         }
//       }
//       return false;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   }, []);

//   const logout = useCallback(() => {
//     setIsAuthenticated(false);
//     setCurrentUser(null);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginToSocialHub } from '../services/socialhubAuth';

const VALID_USERS = [
  { email: 'david.neuhaus@maloon.de', password: 'rtecPPp337!' },
  { email: 'matthias.gerer@maloon.de', password: 'rtecPPp337!' }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const cookies = localStorage.getItem('cookies');
    
    if(!localStorage.getItem('accessToken')) return;
      try {
       const response = await fetch('http://localhost:5000/api/user/userDataSocialHub', {
  method: 'POST', // Change this to 'GET' if it's a GET request
  headers: {
    'Content-Type': 'application/json', // Ensure proper content type
    'Accept': 'application/json',
  },
  body: JSON.stringify({ accessToken, cookieHeader:cookies }) // Remove if using GET request
});

      
        console.log("from auth context for userData: ", response);
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    
    setIsLoading(false);
  }
  useEffect(() => {
    console.log("herherer")
    
    setCurrentUser({firstName: "Mukarram Nawaz", email: "asdasd@gma.com", accountId :"67a1fdfaff275daed5015bb4"  });
    setIsAuthenticated(true);
    setIsLoading(false);
      // getUserData();
    
  }, []);



  const login = useCallback(async (email, password) => {
    try {
    
      const response = await loginToSocialHub(email, password);
      if (response?.accessToken) {

        console.log("from auth context: ", response);
        setCurrentUser(response.userData );
        setIsAuthenticated(true);
        return true;
      } 
      
    return false;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("accessToken");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, isLoading }}>
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