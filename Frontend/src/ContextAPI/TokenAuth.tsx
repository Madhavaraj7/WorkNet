import React, { createContext, useEffect, useState, ReactNode } from "react";
import { ClipLoader } from "react-spinners";

interface User {
  _id: string;
  profileImage?: string;
}

interface TokenAuthContextType {
  isAuthorized: boolean;
  user?: User;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const tokenAuthenticationContext = createContext<
  TokenAuthContextType | undefined
>(undefined);

interface TokenAuthProps {
  children: ReactNode;
}

const TokenAuth: React.FC<TokenAuthProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      setUser(undefined);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader size={50} color="#09f" loading={loading} />
      </div>
    );
  }

  return (
    <tokenAuthenticationContext.Provider
      value={{ isAuthorized, user, setIsAuthorized, setUser }}
    >
      {children}
    </tokenAuthenticationContext.Provider>
  );
};

export default TokenAuth;
