import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setStatus('');
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
                <div className="bg-white rounded-card shadow-ambient p-8 w-full max-w-md text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid Link</h2>
                    <p className="text-surface-on-variant text-sm">No reset token provided in the URL.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
            <div className="bg-white rounded-card shadow-ambient p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-primary mb-2 tracking-tight">ScholarFlow</h1>
                    <h2 className="text-xl font-semibold text-surface-on mb-1">Create New Password</h2>
                    <p className="text-surface-on-variant text-sm">Please enter your new password below.</p>
                </div>

                {status === 'success' && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-card text-sm">
                        Password has been reset successfully. Redirecting to login...
                    </div>
                )}
                {status && status !== 'success' && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-card text-sm">
                        {status}
                    </div>
                )}

                {!status || status !== 'success' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-surface-on mb-1">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-card focus:ring-primary focus:border-primary sm:text-sm text-surface-on placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-button shadow-sm text-sm font-semibold text-white bg-secondary hover:bg-secondary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition duration-150 ease-in-out mt-6"
                        >
                            {loading ? 'Saving...' : 'Reset Password'}
                        </button>

                    </form>
                ) : null}
            </div>
        </div>
    );
};

export default ResetPassword;
