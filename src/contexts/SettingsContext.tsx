
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  disableLandingPage: boolean;
  setDisableLandingPage: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [disableLandingPage, setDisableLandingPageState] = useState(() => {
    const saved = localStorage.getItem('disableLandingPage');
    return saved ? JSON.parse(saved) : true; // Default to true (disabled)
  });

  const setDisableLandingPage = (value: boolean) => {
    setDisableLandingPageState(value);
    localStorage.setItem('disableLandingPage', JSON.stringify(value));
  };

  return (
    <SettingsContext.Provider value={{
      disableLandingPage,
      setDisableLandingPage
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
