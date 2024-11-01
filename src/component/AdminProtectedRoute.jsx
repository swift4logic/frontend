// src/components/AdminProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    // Get token and role_id from localStorage
    const token = localStorage.getItem('token');
    const role_id = localStorage.getItem('role_id');

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // If role_id is not 1 (not an admin), show "Access Denied" or redirect
    if (role_id !== '1') {
        return <div>Access Denied: You do not have permission to view this page.</div>;
        // Alternatively, you could redirect to a different page like this:
        // return <Navigate to="/user-dashboard" replace />;
    }

    // If role_id is 1 (admin), allow access to the route
    return children;
};

export default AdminProtectedRoute;
