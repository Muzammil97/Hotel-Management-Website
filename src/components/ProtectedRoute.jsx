import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;