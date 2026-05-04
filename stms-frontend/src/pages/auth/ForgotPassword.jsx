import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [step, setStep] = useState(1); // 1: enter email, 2: enter code + new pass
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPass, setNewPass] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            showNotification('Reset code sent! Check your email.', 'success');
            setStep(2);
        } catch (err) {
            showNotification(err.response?.data?.message || 'Failed to send code', 'error');
        } finally { setLoading(false); }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPass.length < 6) { showNotification('New password must be at least 6 characters.', 'info'); return; }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp: code, new_password: newPass });
            showNotification('Password reset! Please log in.', 'success');
            navigate('/login');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Reset failed', 'error');
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-background min-h-screen flex items-center justify-center p-4 font-body-md">
            <div className="w-full max-w-md">
                <div className="bg-surface-container-lowest rounded-[24px] p-10 shadow-xl border border-outline-variant/30">
                    <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-3xl text-error fill-icon">key</span>
                    </div>
                    <h1 className="text-2xl font-bold text-on-surface mb-2">
                        {step === 1 ? 'Forgot your password?' : 'Enter reset code'}
                    </h1>
                    <p className="text-on-surface-variant text-sm mb-8">
                        {step === 1
                            ? "No worries. Enter your email and we'll send you a reset code."
                            : `Enter the 6-digit code sent to ${email} along with your new password.`}
                    </p>

                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Email Address</label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-outline pointer-events-none">mail</span>
                                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none transition-all"
                                        placeholder="you@university.edu" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mt-2">
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Reset Code</label>
                                <input type="text" required value={code} onChange={e => setCode(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm text-center font-bold tracking-widest focus:border-primary outline-none"
                                    placeholder="000000" maxLength={6} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">New Password</label>
                                <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none"
                                    placeholder="Min. 6 characters" />
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-3 rounded-full bg-error text-on-error font-bold text-sm shadow-md hover:bg-error/90 transition-all mt-2">
                                {loading ? 'Resetting...' : 'Set New Password'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
                        <Link to="/login" className="text-sm text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
