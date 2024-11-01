import React, { useState } from 'react';
import axios from 'axios';

const FacebookIdsForm = () => {
  const [facebookAccounts, setFacebookAccounts] = useState([{ username: '', password: '', prize: '', twoFA: '' }]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Handle input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedAccounts = [...facebookAccounts];
    updatedAccounts[index][name] = value;
    setFacebookAccounts(updatedAccounts);
  };

  // Add a new Facebook account row
  const handleAddMore = () => {
    setFacebookAccounts([...facebookAccounts, { username: '', password: '', prize: '', twoFA: '' }]);
  };

  // Remove a Facebook account row
  const handleRemove = (index) => {
    const updatedAccounts = [...facebookAccounts];
    updatedAccounts.splice(index, 1);
    setFacebookAccounts(updatedAccounts);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate that username, password, and prize are not empty
    for (const account of facebookAccounts) {
      if (!account.username || !account.password || !account.prize) {
        setMessage('Username, password, and prize are required fields.');
        return;
      }
    }

    console.log("facebookAccounts", facebookAccounts);
    try {
      const response = await axios.post('${process.env.REACT_APP_HOST}/admin/facebook-accounts', {
        facebookAccounts,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure content type is correct
        },
      });
      setMessage(response.data.message);
      setFacebookAccounts([{ username: '', password: '', prize: '', twoFA: '' }]); // Clear the form after submission
    } catch (error) {
      console.error('Error saving Facebook IDs:', error);
      setMessage('Error while saving Facebook IDs.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 border border-gray-300 rounded-lg bg-[#020617]">
      <h2 className="text-2xl font-semibold mb-4 text-white">Add Facebook IDs</h2>
      <form onSubmit={handleSubmit}>
        {facebookAccounts.map((account, index) => (
          <div key={index} className="flex items-center mb-3 space-x-3">
            <input
              type="text"
              name="username"
              placeholder="Facebook Username"
              value={account.username}
              onChange={(e) => handleInputChange(index, e)}
              required
              className="w-1/4 p-2 mb-1 border border-gray-300 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Facebook Password"
              value={account.password}
              onChange={(e) => handleInputChange(index, e)}
              required
              className="w-1/4 p-2 mb-1 border border-gray-300 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="prize"
              placeholder="Prize"
              value={account.prize}
              onChange={(e) => handleInputChange(index, e)}
              required
              className="w-1/4 p-2 mb-1 border border-gray-300 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              name="twoFA"
              placeholder="Facebook 2FA (optional)"
              value={account.twoFA}
              onChange={(e) => handleInputChange(index, e)}
              className="w-1/4 p-2 mb-1 border border-gray-300 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
              disabled={facebookAccounts.length === 1}
            >
              X
            </button>
          </div>
        ))}
        <div className='flex items-center justify-between'>
          <button
            type="button"
            onClick={handleAddMore}
            className="py-2 px-4 bg-orange-600 text-white rounded hover:bg-orange-700 mb-3"
          >
            Add More
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Submit
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-center text-white">{message}</p>}
    </div>
  );
};

export default FacebookIdsForm;
