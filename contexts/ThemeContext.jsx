import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const lightTheme = {
  background: '#ffffff',
  surface: '#f5f5f5',
  primary: '#e74c3c',
  secondary: '#f39c12',
  text: '#333333',
  textSecondary: '#666666',
  border: '#dddddd',
  card: '#ffffff',
  success: '#27ae60',
  error: '#e74c3c',
  warning: '#f39c12',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme = {
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#e74c3c',
  secondary: '#f39c12',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#333333',
  card: '#1e1e1e',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setIsDarkMode(storedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (!themeLoaded) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
