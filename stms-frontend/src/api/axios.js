import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Match the backend port in .env
});

// Intercept requests to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('stms_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
