import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('clarivex_theme');
    return saved !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
    localStorage.setItem('clarivex_theme', isDark ? 'dark' : 'light');
    localStorage.setItem('clarivex_workspace_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
