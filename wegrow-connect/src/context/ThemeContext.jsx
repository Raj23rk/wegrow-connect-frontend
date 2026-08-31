import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('wegrow_theme_mode');
      if (saved) return saved === 'dark';
      // Default to light or check system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('wegrow_theme_mode', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('wegrow_theme_mode', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
