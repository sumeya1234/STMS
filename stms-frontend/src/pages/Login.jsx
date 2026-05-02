import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading } = useAuthStore();
    const { addToast } = useToastStore();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            addToast('Please enter a valid academic email address.', 'error');
            return;
        }

        const res = await login(email, password);
        if (res.success) {
            addToast('Welcome back!', 'success');
            navigate('/');
        } else {
            addToast(res.message || 'Login failed.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4 transition-colors duration-300">
            <div className="bg-card-bg rounded-card shadow-premium border border-border p-8 w-full max-w-md transform transition-all duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-primary mb-2 tracking-tighter">ScholarFlow</h1>
                    <h2 className="text-xl font-bold text-surface-on mb-1 tracking-tight">Welcome back!</h2>
                    <p className="text-surface-on-variant text-sm font-medium">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-surface-on uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-surface-on-variant/50" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3 bg-surface dark:bg-slate-800/50 border border-border rounded-card focus:ring-1 focus:ring-primary focus:border-primary text-sm text-surface-on placeholder-surface-on-variant/40 transition-all"
                                placeholder="scholar@university.edu"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5 ml-1">
                            <label className="block text-xs font-bold text-surface-on uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" name="forgot-password" id="forgot-password" className="text-[11px] font-bold text-primary hover:underline uppercase tracking-tight">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-surface-on-variant/50" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-12 pr-12 py-3 bg-surface dark:bg-slate-800/50 border border-border rounded-card focus:ring-1 focus:ring-primary focus:border-primary text-sm text-surface-on placeholder-surface-on-variant/40 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-surface-on-variant/50 hover:text-surface-on" />
                                ) : (
                                    <Eye className="h-5 w-5 text-surface-on-variant/50 hover:text-surface-on" />
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-button shadow-xl text-sm font-bold text-white bg-primary hover:bg-primary-tint active:scale-95 focus:outline-none disabled:opacity-50 transition-all duration-150 mt-6"
                    >
                        {loading ? 'Authenticating...' : 'Sign In →'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                        <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-card-bg px-4 text-surface-on-variant/40">Or continue with</span></div>
                    </div>

                    <div>
                        <a href="http://localhost:5000/api/auth/google" className="w-full flex justify-center items-center py-3 px-4 border border-border rounded-button shadow-sm text-sm font-bold text-surface-on bg-surface dark:bg-slate-800 hover:bg-surface-bright active:scale-95 transition-all duration-150">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-3" />
                            Google Account
                        </a>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm font-medium">
                    <span className="text-surface-on-variant">Don't have an account? </span>
                    <Link to="/register" className="font-bold text-primary hover:underline">
                        Create one free
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
