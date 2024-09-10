import React, { useState, ReactNode, createContext, FC } from 'react';

// Define the shape of the context value
interface NewMessageContextType {
  newMessageArrivedResp: boolean;
  setNewMessageArrivedResp: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value
export const NewMessageResContext = createContext<NewMessageContextType | undefined>(undefined);

interface NewMessageArrivedRespProps {
  children: ReactNode;
}

const NewMessageArrivedResp: FC<NewMessageArrivedRespProps> = ({ children }) => {
  const [newMessageArrivedResp, setNewMessageArrivedResp] = useState<boolean>(false);

  return (
    <NewMessageResContext.Provider value={{ newMessageArrivedResp, setNewMessageArrivedResp }}>
      {children}
    </NewMessageResContext.Provider>
  );
};

export default NewMessageArrivedResp;
