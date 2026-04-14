import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, role, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Could be a Spinner component
    }

    if (!token) {
        // Not logged in
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Logged in but insufficient role
        if (role === 'admin' || role === 'superAdmin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />; // Passenger default fallback
    }

    return <Outlet />;
};

export default ProtectedRoute;
