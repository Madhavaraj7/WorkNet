import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenAuthenticationContext } from '../ContextAPI/AdminAuth'; // Adjust the import path as needed
import { ThreeDots } from 'react-loader-spinner'; // Example spinner from react-loader-spinner

const AdminPrivateRoute: React.FC = () => {
  const authContext = useContext(tokenAuthenticationContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authContext === undefined) {
      console.log('Auth context is undefined');
      setIsLoading(false);
    } else {
      const { isAuthorized } = authContext;
      console.log("hello",{ isAuthorized });
      setIsLoading(false);
    }
  }, [authContext]);

  if (isLoading) {
    return <ThreeDots height="80" width="80" color="#3498db" ariaLabel="loading" />;
  }

  if (authContext === undefined || !authContext.isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
