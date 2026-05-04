import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== requiredRole) {
        // Redirect to their respective dashboard if they try to access the wrong view
        return <Navigate to={user.role === 'Teacher' ? '/teacher' : '/student'} replace />;
    }

    return children;
};

export default RoleGuard;
