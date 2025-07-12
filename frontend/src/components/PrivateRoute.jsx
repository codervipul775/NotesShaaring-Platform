import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem("token");
        return token && token.length > 10;
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(token && token.length > 10);
        };
        window.addEventListener('authChange', checkAuth);
        checkAuth();

        return () => {
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    return isAuthenticated ? children : <Navigate to="/login" state={{ fromProtected: true }} />;
};

export default PrivateRoute;
