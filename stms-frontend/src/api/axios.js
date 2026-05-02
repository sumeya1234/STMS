import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Ideally use import.meta.env.VITE_API_URL
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle unauthorized access
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Hard reload to clear all state and redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
