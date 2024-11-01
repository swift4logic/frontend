import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './SalesDataTable.css'; // Import the custom CSS for additional styles if needed

const SalesDataTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  const session_id = localStorage.getItem('session_id');

  // Fetch sales data from the backend
  const fetchSalesData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/user/get-sale`, {
        params: {
          user_id: user_id,
          session_id: session_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSalesData(response.data.salesData);
      console.log('Fetched sales data:', response.data.salesData);
    } catch (error) {
      setError('Error fetching sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Define columns for the DataTable
  const columns = [
    {
      name: 'Sale ID',
      selector: row => row.id,
      sortable: true,
      wrap: true, // Allow text wrapping for responsiveness
    },
    {
      name: 'VIN Number',
      selector: row => row.vin_number,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Sale Date',
      selector: row => new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(row.sale_date)),
      sortable: true,
      cell: row => (
        <div className="sales-date">
          {new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(row.sale_date))}
        </div>
      ),
      wrap: true,
    },
  ];

  // Custom styles for the DataTable component
  const customStyles = {
    header: {
      style: {
        backgroundColor: '#1a1f2b', // A dark background for the header
        color: '#ffffff', // White text for better readability
        fontSize: '18px',
        textAlign: 'center',
        padding: '12px',
      },
    },
    headCells: {
      style: {
        backgroundColor: '#1a1f2b',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        padding: '10px',
        borderBottom: '1px solid #4a5568',
      },
    },
    cells: {
      style: {
        backgroundColor: '#1e293b',
        color: '#f5f5f5',
        fontSize: '14px',
        padding: '12px',
      },
    },
    rows: {
      style: {
        minHeight: '60px', // Increase row height
        backgroundColor: '#1e293b',
        '&:hover': {
          backgroundColor: '#2c3748',
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: '#1a1f2b',
        color: '#ffffff',
        padding: '8px',
      },
    },
  };
  

  return (
    <div className="bg-white bg-opacity-5 p-4 rounded-lg shadow-lg">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={salesData}
          progressPending={loading}
          pagination
          customStyles={customStyles}
          responsive
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
};

export default SalesDataTable;
