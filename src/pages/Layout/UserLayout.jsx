// src/components/Layout.jsx
import React from 'react';

import { Outlet } from 'react-router-dom'; // Import Outlet for nested routing
import UserSidebar from '../sidebar/sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 text-white overflow-y-auto w-screen h-screen ">
        <Outlet /> {/* This will render the content of the child routes */}
      </div>
    </div>
  );
};

export default Layout;
