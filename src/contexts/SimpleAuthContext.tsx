
import React, { createContext, useContext, ReactNode } from 'react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

type SimpleAuthContextType = ReturnType<typeof useSimpleAuth>;

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('🔄 SimpleAuthProvider rendering');
  
  let auth;
  try {
    auth = useSimpleAuth();
    console.log('✅ useSimpleAuth hook executed successfully');
  } catch (error) {
    console.error('❌ Error in useSimpleAuth:', error);
    throw error;
  }

  return (
    <SimpleAuthContext.Provider value={auth}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    console.error('❌ useAuth called outside of SimpleAuthProvider');
    console.trace('Call stack:');
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
};
