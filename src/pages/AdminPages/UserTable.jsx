import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './SalesDataTable.css';

const SalesPersonTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [AddIDsModal, setIDsModal] = useState(false);
  const [facebookIds, setFacebookIds] = useState([]);
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [expandedRowData, setExpandedRowData] = useState({}); // Store expanded row data

  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');

  const fetchSalesData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/admin/all-user`, {
        params: { user_id: user_id },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSalesData(response.data.users);
    } catch (error) {
      setError('Error fetching sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const toggleRow = async (row) => {
    const rowId = row.id;

    if (expandedRows.includes(rowId)) {
        // Collapse the row
        setExpandedRows(expandedRows.filter((id) => id !== rowId));
    } else {
        // Expand the row and fetch data if not already fetched
        setExpandedRows([...expandedRows, rowId]);
        if (!expandedRowData[rowId]) {
            try {
                console.log("Fetching data for row:", rowId);
                const response = await axios.get(`${import.meta.env.VITE_HOST}/admin/${rowId}/fetch-sales-per`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Fetched data:", response.data.data);
                
                // Transform the data into a format suitable for card display
                const cardData = [
                    { title: "Total Sales", details: response.data.data.totalSales },
                    { title: "Today's Sales", details: response.data.data.todaysSales },
                    { title: "Monthly Sales", details: response.data.data.monthlySales },
                    { title: "Newly Added Sales", details: response.data.data.newlyAddedSales },
                    { title: "Attendance", details: response.data.data.attendance },
                    { title: "Active_Accoutn_Total_prize", details: response.data.data.Active_Accoutn_Total_prize },
                    { title: "active_accounts", details: response.data.data.active_accounts },
                    { title: "Non_Active_Accoutn_Total_prize", details: response.data.data.Non_Active_Accoutn_Total_prize },
                    { title: "Non_Active_accounts", details: response.data.data.Non_Active_accounts },
                    { title: "Non_Active_accounts", details: response.data.data.checkinMessage  },

                      
];
                
                setExpandedRowData((prevData) => ({
                    ...prevData,
                    [rowId]: { cards: cardData }, // Save as cards array
                }));
            } catch (error) {
                console.error('Error fetching data for expanded row:', error);
            }
        }
    }
};


  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Username',
      selector: (row) => row.username,
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
        }).format(new Date(row.createdAt)),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="rounded bg-orange-500 text-white"
            onClick={() => openModal(row.id)}
          >
            Facebook Ids
          </button>
          <button
            className="rounded bg-orange-500 text-white"
            onClick={() => openAddIDsModal(row.id)}
          >
            Assign Ids
          </button>
        </div>
      ),
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

  const ExpandableComponent = ({ data }) => {
    const rowData = expandedRowData[data.id] || {};
    return (
        <div className="p-4">
            <h3 className="font-bold">Additional Information for {data.username}</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
                {rowData.cards ? rowData.cards.map((card, index) => (
                    <div key={index} className="bg-gray-800 text-white rounded-lg p-4 shadow-lg">
                        <h4 className="font-bold">{card.title}</h4>
                        <p>{card.details}</p>
                    </div>
                )) : <p>No additional data available.</p>}
            </div>
        </div>
    );
};


  const openModal = async (id) => {
    setSelectedRowId(id);
    setShowModal(true);
    console.log("");

    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST}/admin/${id}/facebook-ids`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFacebookIds(response.data);
    } catch (error) {
      console.error('Error fetching Facebook IDs:', error);
    }
  };

  const openAddIDsModal = (id) => {
    setSelectedRowId(id);
    setIDsModal(true);
    setUserIdInput('');
    setPasswordInput('');
  };

  const handleAddIDsSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_HOST}/admin/assign-fb-id`, {
        user_id: selectedRowId,
        facebook_id: userIdInput,
        password: passwordInput,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
      setIDsModal(false);
      fetchSalesData();
    } catch (error) {
      console.error('Error assigning Facebook ID:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto mb-4">
        <DataTable
          columns={columns}
          data={salesData}
          expandableRows
          expandableRowsComponent={ExpandableComponent}
          onRowExpandToggled={(expanded, row) => toggleRow(row)}
          expandableRowExpanded={(row) => expandedRows.includes(row.id)}
          pagination
          customStyles={customStyles}
          responsive
          progressPending={loading}
        />
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="font-bold">Facebook IDs for User {selectedRowId}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {facebookIds.map((facebookId, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col"
                  style={{ minWidth: '200px' }}
                >
                  <h3 className="font-semibold text-lg text-white truncate">User ID: {index + 1}</h3>
                  <div className="text-white mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium truncate">{facebookId.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium truncate">{facebookId.fb_password}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium truncate">{facebookId.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                className="bg-orange-500 text-white rounded px-4 py-2"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {AddIDsModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="font-bold">Add Facebook ID for User {selectedRowId}</h2>
            <form onSubmit={handleAddIDsSubmit}>
              <div className="mb-4">
                <label className="block text-white" htmlFor="userId">User ID</label>
                <input
                  className="bg-gray-800 text-white rounded px-4 py-2 mt-2 w-full"
                  type="text"
                  id="userId"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white" htmlFor="password">Password</label>
                <input
                  className="bg-gray-800 text-white rounded px-4 py-2 mt-2 w-full"
                  type="text"
                  id="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>
              <button
                className="bg-orange-500 text-white rounded px-4 py-2"
                type="submit"
              >
                Add
              </button>
              <button
                className="bg-orange-500 text-white rounded px-4 py-2 ml-2"
                onClick={() => setIDsModal(false)}
                type="button"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPersonTable;
