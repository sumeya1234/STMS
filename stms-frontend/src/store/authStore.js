import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                loading: false,
                isAuthenticated: false
            });
            return { success: false, error: error.response?.data?.message };
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/auth/register', userData);
            set({ loading: false });
            return { success: true, message: response.data.message };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Registration failed';
            set({ error: errorMsg, loading: false });
            return { success: false, message: errorMsg };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    fetchProfile: async () => {
        try {
            const response = await api.get('/users/me');
            set({ user: response.data.data, isAuthenticated: true });
        } catch (error) {
            console.warn('Stale token detected, clearing session.');
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    setDarkMode: (darkMode) => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        set((state) => ({
            user: state.user ? { ...state.user, dark_mode: darkMode } : null
        }));
    }
}));
