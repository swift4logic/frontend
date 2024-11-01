import React, { useState } from 'react';
import logo from '../../assets/swift4logics.png';
import { useNavigate } from 'react-router-dom'; // For redirecting users
import { HiMenuAlt3, HiX } from 'react-icons/hi'; // For hamburger and close icons

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar initially closed on small screens
  const navigate = useNavigate(); // React Router's useNavigate for redirects

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Navigation functions
  const goToCreateUser = () => navigate('/admin-dashboard/create-user');
  const goToHome = () => navigate('/admin-dashboard/home');
  const goToSettings = () => navigate('/admin-dashboard/settings');
  const goToStorefFbIds = () => navigate('/admin-dashboard/store_fb_ids'); // Assuming you have a settings route
   // Assuming you have a settings route

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } bg-[#1a202c] h-full transition-all duration-300 ease-in-out fixed z-20 md:w-64 ${
          isOpen ? 'left-0' : '-left-64'
        } md:left-0 md:relative`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="p-4 text-white">
            <img src={logo} alt="Swift4Logics" className="mb-6 w-20 md:w-auto" />
            <ul className="space-y-2">
            <li>
                <button
                  className="block px-3 py-2 rounded text-sm hover:bg-orange-900 w-full text-left transition duration-200"
                  onClick={goToHome}
                >
                  Dashoard
                </button>
              </li>
              <li>
                <button
                  className="block px-3 py-2 rounded text-sm hover:bg-orange-900 w-full text-left transition duration-200"
                  onClick={goToCreateUser}
                >
                  Create User
                </button>
              </li>
           
              <li>
                <button
                  className="block px-3 py-2 rounded text-sm hover:bg-orange-900 w-full text-left transition duration-200"
                  onClick={goToStorefFbIds}
                >
                  Store_Facebook_ids
                </button>
              </li>
              <li>
                <button
                  className="block px-3 py-2 rounded text-sm hover:bg-orange-900 w-full text-left transition duration-200"
                  onClick={goToSettings}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hamburger Menu for Small Screens */}
      <div className="md:hidden p-4 text-white fixed z-30 top-0 right-0">
        <button
          onClick={toggleSidebar}
          className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-800 text-sm transition duration-200"
        >
          {isOpen ? <HiX className="text-2xl" /> : <HiMenuAlt3 className="text-2xl" />}
        </button>
      </div>

      {/* Main Content */}
     
    </>
  );
};

export default AdminSidebar;
