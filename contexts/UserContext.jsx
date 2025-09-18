import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin } from '../api/products';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try { 
        const storedAuth = await AsyncStorage.getItem('isAuthenticated');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedAuth === 'true') {
          setIsAuthenticated(true);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      setIsAuthenticated(true);
      setUser(data);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
