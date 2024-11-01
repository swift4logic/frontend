import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './SalesDataTable.css';

const FaceBookIds = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');
  const session_id = localStorage.getItem('session_id'); // Get session ID from localStorage

  const fetchFaceBookIds = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/user/${user_id}/facebook-ids`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'session-id': session_id, // Send session ID in the headers
        },
      });
      console.log("response 11111111111", response);
      setSalesData(response.data.users);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Error fetching sales data');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaceBooKStatusStatus = async (saleId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0; // Toggle status
    try {
      await axios.post(`${import.meta.env.VITE_HOST}/user/facebook-id-status`, {
        sale_id: saleId,
        status: newStatus,
        userId: user_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'session-id': session_id, // Send session ID in the headers
        },
      });

      // Update local state without refetching from the server
      setSalesData(prevSalesData =>
        prevSalesData.map(sale =>
          sale.id === saleId ? { ...sale, status: newStatus } : sale
        )
      );

    } catch (error) {
      console.error('Error updating sales status:', error);
      setError('Error updating sales status');
    }
  };

  useEffect(() => {
    fetchFaceBookIds();
  }, []);

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'User Name',
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: 'Password',
      selector: (row) => row.fb_password,
      sortable: true,
    },
    {
      name: '2FA',
      selector: (row) => row['2fa'], // Use string format for invalid property name
      sortable: true,
    },
    {
      name: 'Assign Date',
      selector: (row) =>
        new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(row.created_at)),
      sortable: true,
    },
    {
      name: 'Status',
      cell: (row) => (
        <button
          onClick={() => toggleSaleStatus(row.id, row.status)}
          style={{
            backgroundColor: row.status === 0 ? 'red' : 'orange',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '8px', // space between button and text
          }}
        >
          {row.status === 0 ? 'Pending' : 'Verified'}
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const customStyles = {
    header: {
      style: {
        backgroundColor: '#020617',
        color: '#ffffff',
        fontSize: '18px',
        textAlign: 'center',
      },
    },
    headCells: {
      style: {
        backgroundColor: '#020617',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        backgroundColor: '#020617',
        color: '#ffffff',
      },
    },
    rows: {
      style: {
        minHeight: '50px',
        backgroundColor: '#020617',
        '&:hover': {
          backgroundColor: '#1e293b',
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: '#020617',
        color: '#ffffff',
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto mb-4">
        <DataTable
          columns={columns}
          data={salesData}
          pagination
          customStyles={customStyles}
          responsive
          progressPending={loading}
        />
      </div>
    </div>
  );
};

export default FaceBookIds;
