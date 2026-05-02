import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('success');
        } catch (error) {
            setStatus(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
            <div className="bg-white rounded-card shadow-ambient p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-primary mb-2 tracking-tight">ScholarFlow</h1>
                    <h2 className="text-xl font-semibold text-surface-on mb-1">Reset Password</h2>
                    <p className="text-surface-on-variant text-sm">Enter your email and we'll send you a reset link.</p>
                </div>

                {status === 'success' && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-card text-sm">
                        Password reset link has been sent to your email.
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
                            <label className="block text-sm font-semibold text-surface-on mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-card focus:ring-primary focus:border-primary sm:text-sm text-surface-on placeholder-gray-400"
                                    placeholder="scholar@university.edu"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-button shadow-sm text-sm font-semibold text-white bg-secondary hover:bg-secondary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition duration-150 ease-in-out mt-6"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                    </form>
                ) : null}

                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="font-semibold text-secondary hover:text-secondary-container transition duration-150 ease-in-out">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
