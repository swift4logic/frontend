import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './SalesDataTable.css';

const EmployeSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');

  const fetchSalesData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/admin/fetch-all-sale`, {
        params: { user_id: user_id },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("response", response.data.users);
      setSalesData(response.data.users);
    } catch (error) {
      setError('Error fetching sales data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSaleStatus = async (saleId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0; // Toggle status
    try {
      await axios.post(`${import.meta.env.VITE_HOST}/admin/sales-status`, {
        sale_id: saleId,
        status: newStatus,
        userId: user_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local state without refetching from the server
      setSalesData(prevSalesData =>
        prevSalesData.map(sale =>
          sale.id === saleId ? { ...sale, status: newStatus } : sale
        )
      );

    } catch (error) {
      console.error('Error updating sales status', error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'VIN Number',
      selector: (row) => row.vin_number,
      sortable: true,
    },
    {
      name: 'Picture URL',
      selector: (row) => (
        <a href={row.picture_url} target="_blank" rel="noopener noreferrer">
          View Image
        </a>
      ),
      sortable: true,
    },
    {
      name: 'Sale Man',
      selector: (row) => row.Sale_Man,
      sortable: true,
    },
    {
      name: 'Sale Date',
      selector: (row) =>
        new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(row.sale_date)),
      sortable: true,
    },
    {
      name: 'Status',
      cell: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
          <div>
            <strong>Seller:</strong> {row.Sale_Man}
          </div>
          <div>
            <strong>VIN:</strong> {row.vin_number}
          </div>
          <div>
            <strong>Date:</strong> {new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(row.sale_date))}
          </div>
        </div>
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

export default EmployeSales;
