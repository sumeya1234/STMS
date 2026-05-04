import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('stms_user');
        const token = localStorage.getItem('stms_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user: userData } = response.data;
        localStorage.setItem('stms_token', token);
        localStorage.setItem('stms_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const loginDirect = (token, userData) => {
        localStorage.setItem('stms_token', token);
        localStorage.setItem('stms_user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data; // returns { message, email } — no token yet until OTP
    };

    const logout = () => {
        localStorage.removeItem('stms_token');
        localStorage.removeItem('stms_user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        loginDirect,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
