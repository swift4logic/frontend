import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './SalesDataTable.css';

const UnAssignedFaceBookId = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');

  const fetchUnassignedFacebookIds = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/admin/available_facebook_id`, {
        params: { user_id: user_id },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSalesData(response.data.data.unassignedIds);
    } catch (error) {
      setError('Error fetching unassigned Facebook IDs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnassignedFacebookIds();
  }, []);

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Facebook ID',
      selector: (row) => row.facebook_id,
      sortable: true,
    },
    {
      name: 'Password',
      selector: (row) => row.Password,
      sortable: true,
    },
    {
      name: 'Prize',
      selector: (row) => row.prize,
      sortable: true,
    },
    {
      name: '2FA',
      selector: (row) => row['2fa'],
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) =>
        new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(row['Created _at'])),
      sortable: true,
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

export default UnAssignedFaceBookId;
