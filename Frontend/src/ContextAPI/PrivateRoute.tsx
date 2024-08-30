import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenAuthenticationContext } from './TokenAuth';

const PrivateRoute: React.FC = () => {
  const authContext = useContext(tokenAuthenticationContext);

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { isAuthorized } = authContext;

  // Redirect to login if not authorized
  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
