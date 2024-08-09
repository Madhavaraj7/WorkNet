import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react'

interface AvarageResProps {
  children: ReactNode;
}

interface AddAvarageResponseContextType {
  addAvarageResponse: string;
  setAddAvarageResponse: Dispatch<SetStateAction<string>>;
}

interface ProfileUpdateResponseContextType {
  profileUpdateResponse: string;
  setProfileUpdateResponse: Dispatch<SetStateAction<string>>;
}

interface AdminReportResponseContextType {
  adminReportResponse: any;
  setAdminReportResponse: Dispatch<SetStateAction<any>>;
}

export const addAvarageResponseContext = createContext<AddAvarageResponseContextType | undefined>(undefined);
export const profileUpdateResponseContext = createContext<ProfileUpdateResponseContextType | undefined>(undefined);
export const adminReportResponseContext = createContext<AdminReportResponseContextType | undefined>(undefined);


function AvarageRes({ children }: AvarageResProps) {
  const [addAvarageResponse, setAddAvarageResponse] = useState<string>("");
  const [profileUpdateResponse, setProfileUpdateResponse] = useState<string>("");
  const [adminReportResponse, setAdminReportResponse] = useState<any>();

  return (
    <adminReportResponseContext.Provider value={{ adminReportResponse, setAdminReportResponse }}>
      <profileUpdateResponseContext.Provider value={{ profileUpdateResponse, setProfileUpdateResponse }}>
        <addAvarageResponseContext.Provider value={{ addAvarageResponse, setAddAvarageResponse }}>
          {children}
        </addAvarageResponseContext.Provider>
      </profileUpdateResponseContext.Provider>
    </adminReportResponseContext.Provider>
  );
}


export default AvarageRes
