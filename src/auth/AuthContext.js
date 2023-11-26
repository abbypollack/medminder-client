import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUserState] = useState(null);

  const setUserAndLogin = (userData, token = null) => {
    if (userData && token) {
      sessionStorage.setItem('token', token);
    }
    setIsLoggedIn(!!userData);
    setUserState(userData);
  };
  

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.get(`${SERVER_URL}/api/users/current`, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then((res) => {
        setUserAndLogin(res.data, token);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setUserAndLogin(null);
      });
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser: setUserAndLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
