import React, { useState } from 'react';
import axios from 'axios'; // For making API requests
import logo from '../assets/swift4logics.png';
import { useNavigate } from 'react-router-dom'; // For redirecting users


const CheckIn = () => {
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate(); // React Router's useNavigate for redirects


  // Get user info from localStorage
  const Token = localStorage.getItem('token'); // Assuming JWT token
  const user_id = localStorage.getItem('user_id');
  const User_email = localStorage.getItem('email');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the API request to the backend check-in endpoint with token in the header
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/user/user-checkin`,
        {
          user_id,
          User_email,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`, // Send the JWT token in the Authorization header
          },
        }
      );

      const { session_id } = response.data;
      console.log('response.data', response.data);
      localStorage.setItem('session_id', session_id);
      if(session_id){
        navigate('/user-dashboard/my-sales');
      }
     
        
   
    } catch (error) {
      console.error('Error during check-in:', error);
      setError('Check-in failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#020617]">
      <div className="flex flex-col justify-between w-96 min-h-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-6 bg-gray-700 text-white">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <img src={logo} alt="Logo" className="mx-auto mb-4 w-60" />

        <p className="text-center font-bold text-orange-600 mb-4">
          Keep pushing forward. Hard work always pays off!
        </p>

        <div className="flex items-center justify-center">
          <button className="bg-orange-700 hover:bg-orange-600 text-white h-10 w-24 rounded-lg" onClick={handleSubmit}>
            CHECK IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
