// src/component/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token'); // Correct the token key
      if (!token) {
        setIsAuthenticated(false);
        navigate('/'); // Redirect to login if no token is found
        return;
      }

      try {
        // Make an API request to verify the token
        const response = await axios.get('http://localhost:3000/api/user/verifytoken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.isValid) {
            console.log("response.data.isValid",response.data.isValid);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token'); // Clear token if invalid
          navigate('/'); // Redirect to login if the token is invalid
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('token'); // Clear token if error
        navigate('/'); // Redirect to login if there is an error verifying the token
      }
    };

    checkToken();
  }, [navigate]);

  if (isAuthenticated === null) {
    // Show a loading indicator while checking the token
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null; // If not authenticated, render nothing
};

export default PrivateRoute;
