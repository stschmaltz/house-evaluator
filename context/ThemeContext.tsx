import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): string => {
  try {
    return localStorage?.getItem('house-evaluator-theme') || 'light';
  } catch (error) {
    return 'light';
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  // const [theme, setThemeState] = useState<string>(getInitialTheme);
  const [theme, setThemeState] = useState<string>('light');

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('house-evaluator-theme', theme);
    } catch (error) {
      console.error('Failed to apply theme to DOM/localStorage', error);
    }
  }, [theme]);

  const setTheme = (newTheme: string): void => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
