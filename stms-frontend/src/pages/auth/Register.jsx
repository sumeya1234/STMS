import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import registerImg from '../../assets/registratoin.png';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [f, setF] = useState({ full_name: '', email: '', password: '', confirm_password: '', role: 'Student', department: '', study_year: '' });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validate = () => {
        const e = {};
        if (!f.full_name?.trim()) e.full_name = 'Full name is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.';
        if (f.password.length < 6) e.password = 'Password must be at least 6 characters.';
        if (f.password !== f.confirm_password) e.confirm_password = 'Passwords must match.';
        if (!f.department?.trim()) e.department = 'Department is required.';
        if (f.role === 'Student' && !f.study_year) e.study_year = 'Select a year.';
        return e;
    };

    const h = (e) => { setF(p => ({ ...p, [e.target.name]: e.target.value })); setErrors(p => ({ ...p, [e.target.name]: '' })); };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({}); setLoading(true);
        try {
            const res = await register(f);
            showNotification('Check your email for the verification code!', 'success');
            navigate('/verify-otp', { state: { email: res.email || f.email } });
        } catch (err) {
            showNotification(err.response?.data?.message || 'Registration failed.', 'error');
        }
        finally { setLoading(false); }
    };

    return (
        <div className="bg-background min-h-screen flex w-full font-body-md text-on-background">
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${registerImg})` }}>
                <div className="absolute inset-0 bg-black/50 z-10 transition-colors"></div>
                <div className="absolute inset-0 z-10 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="relative z-20 flex flex-col justify-end p-xxl h-full w-full">
                    <div className="max-w-lg bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-xl border border-on-primary/20 mb-8 ml-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-h2 font-h2 text-on-primary fill-icon">school</span>
                            <span className="text-h3 font-h3 text-on-primary tracking-tight">AcadTrack</span>
                        </div>
                        <p className="text-body-lg font-body-lg text-on-primary/90">
                            Empowering your academic journey through seamless task distribution and intelligent clarity.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-16 py-12 bg-surface-container-lowest overflow-y-auto">
                <div className="w-full max-w-[480px] mx-auto flex flex-col gap-8">
                    <div className="flex lg:hidden items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-h3 font-h3 text-primary fill-icon">school</span>
                        <span className="text-h3 font-h3 text-on-background tracking-tight">AcadTrack</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-h2 font-h2 text-on-background">Create your account</h1>
                        <p className="text-body-md font-body-md text-on-surface-variant">Join us to master your academic workflow.</p>
                    </div>


                    <div className="bg-surface-container p-2 rounded-full flex items-center shadow-sm">
                        {['Student', 'Teacher'].map(r => (
                            <button key={r} type="button" onClick={() => setF({ ...f, role: r })}
                                className={`flex-1 py-2 px-4 rounded-full font-button-text text-button-text transition-all text-center ${f.role === r ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'}`}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-label-caps font-label-caps text-on-surface uppercase tracking-wider">Full Name</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-outline-variant">person</span>
                                <input name="full_name" value={f.full_name} onChange={h} className={`w-full pl-12 pr-4 py-4 bg-surface border rounded-lg text-body-md outline-none transition-colors ${errors.full_name ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'}`} placeholder="Jane Doe" />
                            </div>
                            {errors.full_name && <p className="text-error text-xs ml-1">{errors.full_name}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-label-caps font-label-caps text-on-surface uppercase tracking-wider">Email Address</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-outline-variant">mail</span>
                                <input name="email" type="email" value={f.email} onChange={h} className={`w-full pl-12 pr-4 py-4 bg-surface border rounded-lg text-body-md outline-none transition-colors ${errors.email ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'}`} placeholder="jane.doe@university.edu" />
                            </div>
                            {errors.email && <p className="text-error text-xs ml-1">{errors.email}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-label-caps font-label-caps text-on-surface uppercase tracking-wider">Password</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-outline-variant">lock</span>
                                <input name="password" type={showPassword ? 'text' : 'password'} value={f.password} onChange={h} className={`w-full pl-12 pr-12 py-4 bg-surface border rounded-lg text-body-md outline-none transition-colors ${errors.password ? 'border-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'}`} placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-outline-variant hover:text-on-surface-variant focus:outline-none flex items-center justify-center">
                                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {errors.password && <p className="text-error text-xs ml-1">{errors.password}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-label-caps font-label-caps text-on-surface uppercase tracking-wider">Confirm Password</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-outline-variant">lock_reset</span>
                                <input name="confirm_password" type={showConfirmPassword ? 'text' : 'password'} value={f.confirm_password} onChange={h} className={`w-full pl-12 pr-12 py-4 bg-surface border rounded-lg text-body-md outline-none transition-colors ${errors.confirm_password ? 'border-error ring-1 ring-error' : (f.confirm_password && f.password === f.confirm_password ? 'border-emerald-500 focus:ring-emerald-500' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary')}`} placeholder="••••••••" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 text-outline-variant hover:text-on-surface-variant focus:outline-none flex items-center justify-center">
                                    <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {errors.confirm_password && <p className="text-error text-xs ml-1">{errors.confirm_password}</p>}
                            {!errors.confirm_password && f.confirm_password && f.password === f.confirm_password && <p className="text-emerald-500 text-xs ml-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Passwords match</p>}
                        </div>

                        <div className={`grid gap-4 ${f.role === 'Student' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            <div className="flex flex-col gap-2">
                                <label className="text-label-caps font-label-caps text-on-surface uppercase tracking-wider">{f.role === 'Teacher' ? 'Faculty' : 'Department'}</label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-outline-variant">badge</span>
                                    <input name="department" value={f.department} onChange={h} className={`w-full pl-12 pr-4 py-4 bg-surface border rounded-lg text-body-md outline-none transition-colors ${errors.department ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'}`} placeholder="CS" />
                                </div>
                                {errors.department && <p className="text-error text-xs ml-1">{errors.department}</p>}
                            </div>
                            {f.role === 'Student' && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-label-caps font-label-caps text-on-surface uppercase tracking-wider">Study Year</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-4 text-outline-variant">calendar_today</span>
                                        <select name="study_year" value={f.study_year} onChange={h} className={`w-full pl-12 pr-10 py-4 bg-surface border rounded-lg text-body-md outline-none transition-colors appearance-none ${errors.study_year ? 'border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary'}`}>
                                            <option value="">Select</option>
                                            {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 text-outline-variant pointer-events-none">expand_more</span>
                                    </div>
                                    {errors.study_year && <p className="text-error text-xs ml-1">{errors.study_year}</p>}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-none">
                            <button type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-button-text text-button-text py-4 px-6 rounded-[50px] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex justify-center items-center gap-2 group disabled:opacity-70">
                                {loading ? 'Creating...' : 'Create Account'}
                                {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform border-none">arrow_forward</span>}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-2 border-none">
                        <p className="text-body-sm font-body-sm text-on-surface-variant">
                            Already have an account?{' '}
                            <Link to="/login" className="border-none text-primary font-semibold hover:text-primary-fixed-dim transition-colors underline decoration-primary/30 underline-offset-4">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
