import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SettingsContextType {
  disableLandingPage: boolean;
  setDisableLandingPage: (value: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [disableLandingPage, setDisableLandingPageState] = useState(() => {
    const saved = localStorage.getItem("disableLandingPage");
    return saved ? JSON.parse(saved) : true; // Default to true (disabled)
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    // Default to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const setDisableLandingPage = (value: boolean) => {
    setDisableLandingPageState(value);
    localStorage.setItem("disableLandingPage", JSON.stringify(value));
  };

  return (
    <SettingsContext.Provider
      value={{
        disableLandingPage,
        setDisableLandingPage,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useTheme must be used within a SettingsProvider");
  return { theme: context.theme, toggleTheme: context.toggleTheme };
};
