import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is user
  const [laptopNo, setLaptopNo] = useState(''); // New state for First Laptop No
  const [laptopPassword, setLaptopPassword] = useState(''); // New state for Second Laptop Password
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Check if any field is empty
    if (!email || !password || !confirmPassword || !role || !laptopNo || !laptopPassword) {
      setErrorMessage('All fields are required.');
      setLoading(false); // End loading
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false); // End loading
      return;
    }

    // Get token and user_id from local storage
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const role_id = localStorage.getItem('role_id'); // Corrected to fetch role_id

    if (!token || !user_id) {
      setErrorMessage('User is not authenticated.');
      setLoading(false); // End loading
      return;
    }

    // Set role_id based on selected role
    const newRoleId = role === 'admin' ? 1 : 2;

    // Check if the user's role is 'admin' (role_id 1) and prevent action
    if (role_id === '2') {
      alert('You do not have access to create a new user.');
      setLoading(false); // End loading
      return;
    }

    // Prepare payload for API request
    const payload = {
      user_Name: email,  // Using email as username
      email,
      password,
      role_id: newRoleId, // Use the new role_id based on selection
      user_id,
      laptop_no: laptopNo, // Add First Laptop No to payload
      laptop_password: laptopPassword, // Add Second Laptop Password to payload
    };

    try {
      // API call to create a user with token authentication
      console.log("payload", payload);
      const response = await axios.post(`${import.meta.env.VITE_HOST}/admin/create-user`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token in the headers
        },
      });

      // console.log('User created successfully:', response.data);
      navigate('/admin-dashboard/home');

      setErrorMessage(''); // Clear error message
      // Handle success here (e.g., redirect or show success message)

    } catch (error) {
      console.error('Error creating user:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#020617] ">
      <div className="w-96 h-auto backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold text-center pb-5">Create User</h1>

        {errorMessage && (
          <div className="mb-4 p-2 text-red-600 text-center bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              User Name
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="andrew@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="*********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="*********"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="laptopNo" className="block mb-2 text-sm font-medium">
              First Laptop No
            </label>
            <input
              type="text"
              id="laptopNo"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="Enter Laptop Number"
              required
              value={laptopNo}
              onChange={(e) => setLaptopNo(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="laptopPassword" className="block mb-2 text-sm font-medium">
              Second Laptop Password
            </label>
            <input
              type="password"
              id="laptopPassword"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
              placeholder="Enter Laptop Password"
              required
              value={laptopPassword}
              onChange={(e) => setLaptopPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block mb-2 text-sm font-medium">
              Select Role
            </label>
            <div className="flex items-center">
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                className="mr-2"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value)}
              />
              <label htmlFor="admin" className="mr-4">Admin</label>

              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                className="mr-2"
                checked={role === 'user'}
                onChange={(e) => setRole(e.target.value)}
              />
              <label htmlFor="user">User</label>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
