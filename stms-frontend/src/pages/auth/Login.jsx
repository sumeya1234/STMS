import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import loginImg from '../../assets/login.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const validate = () => {
        const e = {};
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
        if (password.length < 6) e.password = 'Password must be at least 6 characters.';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({}); setLoading(true);
        try {
            const user = await login(email, password);
            showNotification('Welcome back!', 'success');
            navigate(user.role === 'Teacher' ? '/teacher' : '/student');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Invalid credentials. Please try again.', 'error');
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-background min-h-screen font-body-md text-on-background m-0 p-0 overflow-x-hidden flex items-stretch">
            <main className="flex-1 w-full flex flex-col md:flex-row h-screen">
                {/* Left Side: Hero / Brand */}
                <div className="hidden md:flex md:w-[55%] p-10 flex-col justify-between relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${loginImg})` }}>
                    <div className="absolute inset-0 bg-black/50 z-0"></div>
                    <div className="z-10 mt-8 ml-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-[42px] text-white fill-icon">school</span>
                            <h1 className="font-h1 text-h1 text-white m-0">AcadTrack</h1>
                        </div>
                        <p className="font-h3 text-h3 text-tertiary-fixed font-normal m-0 max-w-md">Your academic tasks, beautifully organized.</p>
                    </div>
                    {/* Feature Highlights Bottom */}
                    <div className="z-10 grid grid-cols-3 gap-6 border-t border-white/20 pt-8 mt-auto mx-8 mb-8">
                        <div>
                            <span className="material-symbols-outlined text-tertiary-fixed mb-2 block text-2xl">dashboard</span>
                            <h3 className="font-button-text text-button-text text-white mb-2">Unified Dashboard</h3>
                            <p className="font-body-sm text-body-sm text-tertiary-fixed-dim">All your courses and assignments in one clear view.</p>
                        </div>
                        <div>
                            <span className="material-symbols-outlined text-tertiary-fixed mb-2 block text-2xl">assignment_turned_in</span>
                            <h3 className="font-button-text text-button-text text-white mb-2">Task Tracking</h3>
                            <p className="font-body-sm text-body-sm text-tertiary-fixed-dim">Never miss a deadline with automated priority sorting.</p>
                        </div>
                        <div>
                            <span className="material-symbols-outlined text-tertiary-fixed mb-2 block text-2xl">analytics</span>
                            <h3 className="font-button-text text-button-text text-white mb-2">Performance Insights</h3>
                            <p className="font-body-sm text-body-sm text-tertiary-fixed-dim">Visual reports to help you stay on top of your grades.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-[45%] bg-surface flex flex-col justify-center items-center p-8 relative">
                    <div className="md:hidden flex items-center gap-3 mb-8 self-start w-full px-4">
                        <span className="material-symbols-outlined text-3xl text-primary fill-icon">school</span>
                        <span className="font-h3 text-h3 text-primary">AcadTrack</span>
                    </div>

                    <div className="w-full max-w-md mx-auto bg-surface-container-lowest p-8 md:p-12 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px]">
                        <div className="mb-8 text-center">
                            <h2 className="font-h2 text-h2 text-on-surface mb-2">Welcome back 👋</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Please sign in to your account.</p>
                        </div>


                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Email Address</label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-outline z-10 pointer-events-none">mail</span>
                                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                                        className={`w-full pl-12 pr-4 py-3 bg-surface border rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline/60 ${errors.email ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'}`}
                                        placeholder="you@university.edu" />
                                </div>
                                {errors.email && <p className="text-sm text-error">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Password</label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-outline z-10 pointer-events-none">lock</span>
                                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                                        className={`w-full pl-12 pr-12 py-3 bg-surface border rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors placeholder:text-outline/60 ${errors.password ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'}`}
                                        placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 flex items-center cursor-pointer text-outline hover:text-on-surface transition-colors z-10">
                                        <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-error">{errors.password}</p>}
                                <div className="text-right mt-1">
                                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full h-[48px] rounded-[50px] bg-gradient-to-r from-primary to-primary-container text-on-primary font-button-text text-button-text flex justify-center items-center gap-2 hover:opacity-90 transition-opacity mt-8 shadow-md disabled:opacity-70">
                                {loading ? 'Signing in...' : 'Login to AcadTrack'}
                                {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-button-text text-button-text text-primary hover:underline">Create one</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
