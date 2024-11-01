import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import logo from '../../assets/swift4logics.png';


const MySales = () => {
  const [VinNumber, setVinNumber] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Get the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Validate inputs
    if (!VinNumber || !image) {
      setErrorMessage('Both fields are required.');
      setLoading(false);
      return;
    }

    // Get token and user ID from local storage
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const session_id = localStorage.getItem('session_id');

    if (!token || !user_id) {
      setErrorMessage('User is not authenticated.');
      setLoading(false);
      return;
    }

    // Prepare FormData to send VinNumber and image file
    const formData = new FormData();
    formData.append('vin_number', VinNumber); // Use the correct field name
    formData.append('image', image); // Append image
    formData.append('session_id', session_id); // Use the correct method
    formData.append('user_id', user_id); // Use the correct method

    try {
      // API call to add new sales entry
      const response = await axios.post(`${import.meta.env.VITE_HOST}/user/add-sale`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token in the headers
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      });

      console.log('Sale added successfully:', response.data);
      setErrorMessage(''); // Clear error message
      // Handle success (e.g., redirect or show success message)

    } catch (error) {
      console.error('Error adding sale:', error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'> 


    <div className=" w-96 h-auto backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-900 text-white">
    <img src={logo} alt="Logo" className="mx-auto mb-4 w-60" />
      <h2 className="text-2xl font-bold text-center pb-5">Add Sale</h2>

      {errorMessage && (
        <div className="mb-4 p-2 text-red-600 text-center bg-red-100 rounded-lg">
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
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
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
            className="block w-full text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default MySales;
