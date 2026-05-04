import React, { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginDirect } = useAuth();
    const { showNotification } = useNotification();

    const email = location.state?.email || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const inputs = useRef([]);

    const handleChange = (i, val) => {
        if (val.length > 1) return;
        const arr = [...otp];
        arr[i] = val;
        setOtp(arr);
        if (val && i < 5) inputs.current[i + 1]?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            inputs.current[i - 1]?.focus();
            const arr = [...otp];
            arr[i - 1] = '';
            setOtp(arr);
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 6) { showNotification('Please enter the full 6-digit code.', 'info'); return; }
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { email, otp: code });
            loginDirect(res.data.token, res.data.user);
            showNotification('Account verified! Welcome 🎉', 'success');
            navigate(res.data.user.role === 'Teacher' ? '/teacher' : '/student');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Verification failed', 'error');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            await api.post('/auth/resend-otp', { email });
            showNotification('A new code has been sent.', 'success');
        } catch (err) {
            showNotification('Could not resend code.', 'error');
        } finally { setResendLoading(false); }
    };

    return (
        <div className="bg-background min-h-screen flex items-center justify-center p-4 font-body-md">
            <div className="w-full max-w-md">
                <div className="bg-surface-container-lowest rounded-[24px] p-10 shadow-xl border border-outline-variant/30 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-primary fill-icon">mark_email_read</span>
                    </div>
                    <h1 className="text-2xl font-bold text-on-surface mb-2">Check your email</h1>
                    <p className="text-on-surface-variant text-sm mb-8">
                        We sent a 6-digit code to <strong className="text-on-surface">{email}</strong>. Enter it below to verify your account.
                    </p>

                    <div className="flex justify-center gap-3 mb-8">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => inputs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className="w-12 h-14 text-center text-xl font-bold bg-surface border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        ))}
                    </div>

                    <button onClick={handleVerify} disabled={loading}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all mb-4">
                        {loading ? 'Verifying...' : 'Confirm & Login'}
                    </button>

                    <p className="text-sm text-on-surface-variant">
                        Didn't get it?{' '}
                        <button onClick={handleResend} disabled={resendLoading} className="text-primary font-semibold hover:underline">
                            {resendLoading ? 'Sending...' : 'Resend code'}
                        </button>
                    </p>

                    <div className="mt-8 pt-6 border-t border-outline-variant/30">
                        <Link to="/login" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
