import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenAuthenticationContext } from '../ContextAPI/TokenAuth'; // Adjust the import path as needed

const AdminPrivateRoute: React.FC = () => {
  const authContext = useContext(tokenAuthenticationContext);

  if (authContext === undefined) {
    return <Navigate to="/admin" />;
  }

  const { isAuthorized } = authContext;
//   console.log(isAuthorized);
  

  


  return isAuthorized ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminPrivateRoute;
