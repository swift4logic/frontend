// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateUser from './pages/createUSER.JSX';
import SignIn from './pages/login';
import CheckIn from './pages/checkIn';
import Layout from './pages/Layout/UserLayout';
import AddSales from './pages/UserPage/addSales';
import AdminLayout from './pages/Layout/AdminDashboard';
import SalesDone from './pages/UserPage/MysalesPage';
import AdminDashBoard from './pages/AdminPages/AdminDashboard';
import PrivateRoute from './Private';
import FacebookIdsForm from './pages/AdminPages/StoreFbIds';
// import 'dotenv/config';

function App() {
  return (
    <Routes>
      {/* Public Routes (e.g., login) */}
      <Route path="/" element={<SignIn />} />
      <Route path="/checkin" element={<CheckIn />} />
     

      {/* User Dashboard Routes */}
      <Route
        path="/user-dashboard"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="my-sales" element={<SalesDone />} />
        <Route path="add-sales" element={<AddSales />} />
       


       
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="home" element={<AdminDashBoard />} />
        <Route path="store_fb_ids" element={< FacebookIdsForm />} />
        <Route path="create-user" element={<CreateUser />} />
      </Route>
    </Routes>
  );
}

export default App;
