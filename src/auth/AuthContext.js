import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const setUserAndLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  useEffect(() => {
    axios.get(`${SERVER_URL}/auth/profile`, { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(true);
        setUser(res.data);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser: setUserAndLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
