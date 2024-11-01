// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
    // Get the token and session_id from localStorage
    const token = localStorage.getItem('token');
    const session_id = localStorage.getItem('session_id');

    // If there's no token or session_id, redirect to the login or check-in page
    if (!token) {
        return <Navigate to="/" replace />; // Redirect to login if no token
    }

    if (!session_id) {
        return <Navigate to="/checkin" replace />; // Redirect to check-in if no session
    }

    // If the token and session_id exist, allow access to the route
    return children;
};

export default UserProtectedRoute;
