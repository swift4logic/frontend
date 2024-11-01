import React, { useState } from 'react';
import axios from 'axios';
import logo from '../../assets/swift4logics.png';
import { useNavigate } from 'react-router-dom';

const AddSales = () => {
  const [VinNumber, setVinNumber] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMessage('File size exceeds 5MB.');
      setImage(null);
    } else {
      setImage(file);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!VinNumber || !image) {
      setErrorMessage('Both fields are required.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const session_id = localStorage.getItem('session_id');

    if (!token || !user_id) {
      setErrorMessage('User is not authenticated.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('vin_number', VinNumber);
    formData.append('image', image);
    formData.append('session_id', session_id);
    formData.append('user_id', user_id);

    try {
      const response = await axios.post(`${import.meta.env.VITE_HOST}/user/add-sale`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Sale added successfully:', response.data);
      navigate('/user-dashboard/my-sales');
    } catch (error) {
      console.error('Error adding sale:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-900 text-white">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-60" />
        <h2 className="text-2xl font-bold text-center pb-5">Add Sale</h2>

        {errorMessage && (
          <div className="mb-4 p-3 text-red-700 text-center bg-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="vin" className="block mb-2 text-sm font-medium">
              Vin Number
            </label>
            <input
              type="text"
              id="vin"
              className="bg-gray-200 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 w-full py-2 px-3"
              placeholder="Enter Vin Number"
              required
              value={VinNumber}
              onChange={(e) => setVinNumber(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-sm font-medium">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="block w-full text-sm text-gray-900 bg-gray-200 border border-gray-400 rounded-lg cursor-pointer focus:outline-none"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="flex items-center justify-center mb-4">
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSales;
