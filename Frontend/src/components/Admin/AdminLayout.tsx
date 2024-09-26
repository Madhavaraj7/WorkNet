import React from 'react';
import { Outlet } from 'react-router-dom';
import AdHeader from './AdHeader'; 

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdHeader />
      <main className="flex-1 ml-60 p-14 bg-gray-200">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
