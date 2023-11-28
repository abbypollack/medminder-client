import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUserState] = useState(null);

  const setUserAndLogin = (userData, token = null) => {
    console.log('Setting user data:', userData);
    if (userData && token) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }
    setIsLoggedIn(!!userData);
    setUserState(userData);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedUserData = sessionStorage.getItem('userData');
    console.log('savedUserData',savedUserData)

    if (token && savedUserData) {
      const userData = JSON.parse(savedUserData);
      setUserAndLogin(userData, token);
    } else if (token) {
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

