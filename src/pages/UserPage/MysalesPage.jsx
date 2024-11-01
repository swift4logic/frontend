import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SalesDataTable from './mySalesTable';
import Modal from './alertModal';
import { useNavigate } from 'react-router-dom';
import FaceBookIds from './FaceBookIds';

const SalesDone = () => {
  const [VinNumber, setVinNumber] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState({
    salesCount: 0,
    remainingSales: 0,
    monthlyTarget: 0,
  });
  const [selectedComponent, setSelectedComponent] = useState('SalesPersonTable');
  const [personWithMostSale, setPersonWithMostSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkinInfo, setCheckinInfo] = useState(null);
  const [error, setError] = useState(null);
  const [checkinTime,setCheckinTime]= useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const session_id = localStorage.getItem('session_id');
  const user_id = localStorage.getItem('user_id');

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    localStorage.removeItem('token');
    setIsModalOpen(false);
    navigate('/');
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const fetchCheckinTime = async () => {
    try {
      setLoading(true);
      console.log('CHECKING TEST ', session_id, user_id); // Ensure these are defined
  
      const response = await axios.get(
        `${import.meta.env.VITE_HOST}/user/get-today-checkin-time`,
        {
          params: { session_id, user_id }, // Pass parameters here
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      setCheckinInfo(response.data.formattedCheckinDate);
      setCheckinTime(response.data.formattedCheckinTime); // Set the check-in time
      console.log("Fetched check-in date:", response.data.formattedCheckinDate);
      console.log("Fetched check-in time:", response.data.formattedCheckinTime); // Log the check-in time
    } catch (err) {
      console.error("Error fetching check-in time:", err);
      setError("Failed to load check-in time.");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchMonthlySales = async () => {
    try {
      setLoading(true);
      if (!user_id) {
        setErrorMessage('User is not logged in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_HOST}/user/get-monthly-sales`, {
        params: { user_id, session_id },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSalesData(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching sales data:', error.message);
      setErrorMessage('Failed to fetch monthly sales data.');
    } finally {
      setLoading(false);
    }
  };

  const getPersonWithMostSale = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/user/most-sales-person`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Session-Id': session_id,
          'User-Id': user_id,
        },
      });

      if (response.data.topSalesMan && response.data.topSalesMan.length > 0) {
        setPersonWithMostSale(response.data.topSalesMan[0]);
      } else {
        setPersonWithMostSale({ Sale_Man: 'No Sales', total_sales: 0 });
      }
    } catch (error) {
      console.error('Error fetching person with most sales:', error.message);
    }
  };

  useEffect(() => {
    fetchMonthlySales();
    getPersonWithMostSale();
    fetchCheckinTime();
  }, []);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'SalesPersonTable':
        return <SalesDataTable />;
      case 'EmployeSales':
        return <FaceBookIds />;
      default:
        return <SalesDataTable />;
    }
  };

  return (
    <div className='flex flex-col min-h-screen px-4 bg-gradient-to-b from-[#1a1f2b] to-[#232a3d] overflow-hidden'>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 text-white py-3 mb-4 shadow-lg rounded-md mt-4">
        <h1 className="uppercase tracking-wide text-center md:text-left">Sales</h1>
        {personWithMostSale && (
          <div className='flex'>
            <p className="text-center text-sm md:text-left">
              Top Salesperson: {personWithMostSale.Sale_Man}
            </p>
            <p className="ml-4 text-sm ">Total Sales: {personWithMostSale.total_sales}</p>
          </div>
        )}
        <button
          className="mt-2 md:mt-0 bg-[#ff9900] text-white font-semibold py-2 px-4 md:px-6 rounded-full hover:bg-orange-700 transition duration-300 shadow-lg"
          onClick={handleCheckout}
        >
          Logout
        </button>
      </div>

      {/* Counter Boxes */}
      <div className='flex flex-wrap justify-around items-center gap-4 mt-4'>
        <div className='flex flex-col items-center justify-center w-48 h-48 rounded-lg shadow-xl bg-gradient-to-br from-blue-800 to-purple-800 text-white p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-lg font-bold text-yellow-400'>Sales Target</p>
          <p className='text-4xl font-extrabold'>{salesData.monthlyTarget}</p>
        </div>
        <div className='flex flex-col items-center justify-center w-48 h-48 rounded-lg shadow-xl bg-gradient-to-br from-green-800 to-teal-800 text-white p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-lg font-bold text-yellow-400'>Sale Count</p>
          <p className='text-4xl font-extrabold'>{salesData.salesCount}</p>
        </div>
        <div className='flex flex-col items-center justify-center w-48 h-48 rounded-lg shadow-xl bg-gradient-to-br from-red-800 to-pink-800 text-white p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-lg font-bold text-yellow-400'>Remaining Sales</p>
          <p className='text-4xl font-extrabold'>{salesData.remainingSales}</p>
        </div>
        <div className='flex flex-col items-center justify-center w-48 h-48 rounded-lg shadow-xl bg-gradient-to-br from-gray-800 to-gray-600 text-white p-6 transform hover:scale-105 transition duration-300'>
          <p className='text-lg font-bold text-yellow-400'>Checking</p>
          <p className='text- sm font-extrabold text-center'>{checkinTime}</p>

          <p className='text- sm font-extrabold text-center'>{checkinInfo}</p>

        </div>
      </div>

      {/* Sales DataTable Section */}
      <div className='mt-6 flex items-end justify-end'>
        <select
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
          className='bg-gray-700 text-white p-2 rounded-md shadow-lg'
        >
          <option value='SalesPersonTable'>My Sales</option>
          <option value='EmployeSales'>FaceBooK Ids</option>
        </select>
      </div>
      <div className='mt-2 flex-1 bg-white bg-opacity-5 rounded-lg p-4 shadow-lg overflow-auto'>
        <div className='w-full'>
          {renderSelectedComponent()}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title="Confirm Checkout"
          message="Are you sure you want to proceed to checkout?"
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default SalesDone;
