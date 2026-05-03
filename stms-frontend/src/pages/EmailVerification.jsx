import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToastStore } from '../store/toastStore';
import { Mail, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { addToast } = useToastStore();

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const hasRun = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }
        // Guard against React Strict Mode double-invocation
        if (hasRun.current) return;
        hasRun.current = true;

        const verifyToken = async () => {
            try {
                await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
                addToast('Email verified successfully!', 'success');
            } catch (error) {
                setStatus('error');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4 selection:bg-primary/30">
            <div className="bg-card-bg border border-border rounded-feature shadow-premium p-10 w-full max-w-md text-center transform transition-all animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-primary mb-2 tracking-tighter">ScholarFlow</h1>
                <div className="h-1 w-12 bg-primary/20 rounded-full mx-auto mb-8"></div>

                {status === 'verifying' && (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                        <h2 className="text-xl font-bold text-surface-on">Confirming Authentication</h2>
                        <p className="text-surface-on-variant text-sm font-medium">Securing your scholarly identity. Please hold tight...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-feature flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-surface-on mb-3">Verification Successful</h2>
                        <p className="text-surface-on-variant text-sm font-medium mb-8 leading-relaxed">
                            Excellent! Your academic account is now fully active and ready for use.
                        </p>
                        <Link
                            to="/login"
                            className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-primary text-white text-sm font-bold rounded-button shadow-lg shadow-primary/20 hover:bg-primary-tint active:scale-95 transition-all group"
                        >
                            Sign In to Workspace
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-feature flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="h-8 w-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-surface-on mb-3">Link Invalidation</h2>
                        <p className="text-surface-on-variant text-sm font-medium mb-8 leading-relaxed">
                            The security token has expired or is invalid. This typically happens if you've already verified or the link timed out.
                        </p>
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/login"
                                className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-primary text-white text-sm font-bold rounded-button shadow-lg shadow-primary/20 hover:bg-primary-tint active:scale-95 transition-all"
                            >
                                Continue to Login
                            </Link>
                            <Link to="/register" className="text-xs font-bold text-surface-on-variant uppercase tracking-widest hover:text-primary transition-colors">
                                New Registration
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
