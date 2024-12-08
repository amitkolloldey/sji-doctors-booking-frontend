import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = ({ children, redirectTo }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    if (isAuthenticated) {
        return <Navigate to={redirectTo} />;
    }

    return children;
};

export default GuestRoute;