import React, { createContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of the context value
interface TokenAuthContextType {
  isAuthorized: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with an initial value
export const tokenAuthenticationContext = createContext<TokenAuthContextType | undefined>(undefined);

interface TokenAuthProps {
  children: ReactNode;
}

const TokenAuth: React.FC<TokenAuthProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  return (
    <tokenAuthenticationContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      {children}
    </tokenAuthenticationContext.Provider>
  );
};

export default TokenAuth;
