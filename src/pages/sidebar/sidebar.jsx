import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/swift4logics.png';
import { HiMenuAlt3, HiX } from 'react-icons/hi'; // Optional: for sidebar toggle icon

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar state
  const [showModal, setShowModal] = useState(false); // Modal state
  const navigate = useNavigate();

  // Toggle Sidebar for smaller screens
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Navigation functions
  const goToSales = () => navigate('/user-dashboard/my-sales');
  const goToAddSales = () => navigate('/user-dashboard/add-sales');

  // Handle checkout button click to show modal
  const handleCheckoutClick = () => {
    setShowModal(true);
  };

  // Confirm checkout, remove session ID, and navigate
  const confirmCheckout = async () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const session_id = localStorage.getItem('session_id');

    try {
      // API call to check out the user
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/user/user-checkout`,
        { session_id, user_id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        console.log(response.data.message); // Success message

        // Clear session-related data from local storage
        localStorage.removeItem('session_id');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');

        // Close modal and navigate to another route
        setShowModal(false);
        navigate('/'); // Redirect to home or login route
      }
    } catch (error) {
      console.error("Error during checkout:", error.response?.data?.message || error.message);
    }
  };

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
            <ul>
              <li className="mb-2">
                <button
                  className="block px-3 py-2 rounded text-sm hover:bg-orange-900 w-full text-left"
                  onClick={goToSales}
                >
                  My Sales
                </button>
              </li>
              <li className="mb-2">
                <button
                  className="block px-3 py-2 rounded text-sm hover:bg-orange-900 w-full text-left"
                  onClick={goToAddSales}
                >
                  Add New Sales
                </button>
              </li>
              <li className="mb-2">
                <button
                  className="block px-3 py-2 rounded text-sm hover:bg-orange-900 w-full text-left"
                  onClick={handleCheckoutClick}
                >
                  Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">Checkout Confirmation</h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to check out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmCheckout}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Yes, Check Out
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;
