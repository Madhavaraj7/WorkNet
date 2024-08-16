import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface Admin {
  profileImage?: string;
  username?: string;
  email?: string;
  role?: string;
}

interface TokenAuthContextType {
  isAuthorized: boolean;
  admin?: Admin;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  setAdmin: React.Dispatch<React.SetStateAction<Admin | undefined>>;
}

export const tokenAuthenticationContext = createContext<TokenAuthContextType | undefined>(undefined);

interface TokenAuthProps {
  children: ReactNode;
}

const AdminAuth: React.FC<TokenAuthProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [admin, setAdmin] = useState<Admin | undefined>(undefined);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    console.log(storedAdmin);
    
    if (storedAdmin) {
      setIsAuthorized(true);
      setAdmin(JSON.parse(storedAdmin));
    } else {
      setIsAuthorized(false);
      setAdmin(undefined);
    }
  }, []);

  return (
    <tokenAuthenticationContext.Provider value={{ isAuthorized, admin, setIsAuthorized, setAdmin }}>
      {children}
    </tokenAuthenticationContext.Provider>
  );
};

export default AdminAuth;
