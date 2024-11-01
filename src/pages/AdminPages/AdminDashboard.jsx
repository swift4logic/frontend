import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SalesPersonTable from './UserTable';
import UnAssignedFaceBookId from './UnAssignedFaceBookIds';
import EmployeSales from './EmployesSale';
// import SalesPersonTable from './UserTable';

// import FacebookIdsTable from './FacebookIdsTable'; // Example additional component
// import AnotherComponent from './AnotherComponent'; // Another example component

const AdminDashBoard = () => {
  const [VinNumber, setVinNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    todaysSales: 0,
    monthlySales: 0,
    newlyAddedSales: 0,
  });
  const [selectedComponent, setSelectedComponent] = useState('SalesPersonTable');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  

  // Fetch sales data from the backend
  useEffect(() => {
    
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_HOST}/admin/cards-data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSalesData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setErrorMessage('Failed to fetch sales data');
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Render the selected component
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'SalesPersonTable':
        return <SalesPersonTable />;
      case 'FacebookIdsTable':
        return <UnAssignedFaceBookId />;
      case 'EmployeSales':
        return <EmployeSales />;

      default:
        return <SalesPersonTable />;
    }
  };

  return (
    <div className='flex flex-col min-h-screen px-4 bg-gradient-to-b from-[#1a1f2b] to-[#232a3d] overflow-hidden'>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 text-white py-3 mb-4 shadow-lg rounded-md mt-4">
        <h1 className="uppercase tracking-wide text-center md:text-left">Sales</h1>
        <button
          className="mt-2 md:mt-0 bg-[#ff9900] text-white font-semibold py-2 px-4 md:px-6 rounded-full hover:bg-orange-700 transition duration-300 shadow-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Counter Boxes */}
      <div className='flex flex-wrap justify-around items-center gap-4 mt-4'>
        <div className='flex flex-col items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-lg shadow-xl bg-gradient-to-br from-blue-800 to-purple-800 text-white p-4 md:p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-base md:text-lg font-bold text-yellow-400'>Total Sales</p>
          <p className='text-xl md:text-2xl font-semibold mt-2'>{loading ? 'Loading...' : salesData.totalSales}</p>
        </div>
        <div className='flex flex-col items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-lg shadow-xl bg-gradient-to-br from-green-800 to-teal-800 text-white p-4 md:p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-base md:text-lg font-bold text-yellow-400'>Today's Sales</p>
          <p className='text-xl md:text-2xl font-semibold mt-2'>{loading ? 'Loading...' : salesData.todaysSales}</p>
        </div>
        <div className='flex flex-col items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-lg shadow-xl bg-gradient-to-br from-red-800 to-pink-800 text-white p-4 md:p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-base md:text-lg font-bold text-yellow-400'>Monthly Sales</p>
          <p className='text-xl md:text-2xl font-semibold mt-2'>{loading ? 'Loading...' : salesData.monthlySales}</p>
        </div>
        <div className='flex flex-col items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-gray-600 text-white p-4 md:p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-base md:text-lg font-bold text-yellow-400'>New Sale</p>
          <p className='text-xl md:text-2xl font-semibold mt-2'>{loading ? 'Loading...' : salesData.newlyAddedSales}</p>
        </div>
      </div>

      {/* Component Selector */}
      <div className='mt-6 flex items-end justify-end'>
        <select
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
          className='bg-gray-700 text-white p-2 rounded-md shadow-lg'
        >
          <option value='SalesPersonTable'>Show Sales Person</option>
          <option value='FacebookIdsTable'>Show Facebook IDs</option>
          <option value='EmployeSales'>Employe Sales</option>
        </select>
      </div>

      {/* Sales DataTable Section */}
      <div className='mt-2 flex-1 bg-white bg-opacity-5 rounded-lg p-4 shadow-lg overflow-auto'>
        <div className='w-full'>
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
