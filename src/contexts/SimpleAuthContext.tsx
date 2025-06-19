import React, { createContext, useContext, ReactNode } from "react";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

type SimpleAuthContextType = ReturnType<typeof useSimpleAuth>;

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(
  undefined,
);

export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useSimpleAuth();

  return (
    <SimpleAuthContext.Provider value={auth}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SimpleAuthProvider");
  }
  return context;
};
