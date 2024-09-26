import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { tokenAuthenticationContext } from "./TokenAuth";

const AuthRoute: React.FC = () => {
  const authContext = useContext(tokenAuthenticationContext);
  console.log(authContext);

  if (!authContext || authContext.isAuthorized) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AuthRoute;
