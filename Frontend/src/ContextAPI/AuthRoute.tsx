import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenAuthenticationContext } from './TokenAuth';

const AuthRoute: React.FC = () => {
  const authContext = useContext(tokenAuthenticationContext);
  console.log(authContext);
  
  
  if (!authContext || authContext.isAuthorized) {
    // If the user is authenticated, redirect them away from login/signup
    return <Navigate to="/" />;
  }

  // If the user is not authenticated, allow them to access the current route (login, signup, etc.)
  return <Outlet />;
};

export default AuthRoute;
