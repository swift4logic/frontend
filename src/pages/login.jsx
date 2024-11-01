// src/pages/login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import 'dotenv/config';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists when the component mounts
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/user-dashboard'); // Redirect if already logged in
    }
  }, [navigate]);

  const checkSession = async () => {
    const session_id = localStorage.getItem('session_id');

    if (!session_id) {
      navigate('/checkin');
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/user/check-session`, {
      });

      if (response.status === 200) {
        navigate('/user-dashboard/my-sales');
      }
    } catch (error) {
      if (error.response && error.response.data.redirect) {
        navigate(error.response.data.redirect);
      } else {
        console.error('Session check failed:', error);
        navigate('/checkin');
      }
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
   console.log("import.meta.env.VITE_HOST",import.meta.env.VITE_HOST);
    try {
      const response = await axios.post(`${import.meta.env.VITE_HOST}/user/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      console.log('response.data', response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('email', user.email);
      localStorage.setItem('role_id', user.role_id);

      const session_id = localStorage.getItem('session_id');

      if (token) {
        if (user.role_id === 1) {
          navigate('/admin-dashboard/home');
        } else if (user.role_id === 2) {
          if (session_id) {
            await checkSession();
          } else {
            navigate('/checkin');
          }
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#020617]">
      <div className="w-96 h-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold pb-5">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Your email
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
              Your password
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
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto"
            >
              Submit
            </button>
            <div className="flex items-center text-sm">
              <p>New here?</p>
              <p className="underline cursor-pointer ml-1">Register</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
