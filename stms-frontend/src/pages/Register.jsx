import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [university, setUniversity] = useState('');
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');

    const [formErrors, setFormErrors] = useState({});

    const { register, loading, error } = useAuthStore();
    const { addToast } = useToastStore();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePassword = (pwd) => {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        // Name Validation: Minimum 3 chars, letters and spaces only
        if (name.length < 3) {
            errors.name = 'Name must be at least 3 characters long.';
        } else if (!/^[A-Za-z\s]+$/.test(name)) {
            errors.name = 'Name must only contain letters and spaces (no numbers).';
        }

        // Email Validation
        if (!validateEmail(email)) {
            errors.email = 'Please enter a valid email address.';
        }

        // Academic fields validation (optional but if provided, shouldn't be numbers only or contain weird chars)
        if (university && !/^[A-Za-z\s\-',.]+$/.test(university)) {
            errors.university = 'University name should only contain letters and basic punctuation.';
        }
        if (department && !/^[A-Za-z\s\-',.]+$/.test(department)) {
            errors.department = 'Department name should only contain letters and basic punctuation.';
        }

        // Password Validation
        if (!validatePassword(password)) {
            errors.password = 'Password does not meet security requirements.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            addToast('Please correct the highlighted errors.', 'error');
            return;
        }

        setFormErrors({});

        const res = await register({ name, email, password, university, department, year });
        if (res.success) {
            addToast('Registration successful! Please verify your email.', 'success');
            navigate('/login');
        } else {
            addToast(res.message || 'Registration failed.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4 transition-colors duration-300">
            <div className="bg-card-bg rounded-card shadow-premium border border-border p-8 w-full max-w-lg transform transition-all duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-primary mb-2 tracking-tighter">ScholarFlow</h1>
                    <h2 className="text-xl font-bold text-surface-on mb-1 tracking-tight">Create an account</h2>
                    <p className="text-surface-on-variant text-sm font-medium">Join to organize your academic tasks effortlessly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-surface-on uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-surface-on-variant/50" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setFormErrors(prev => ({ ...prev, name: null })); }}
                                    className={`block w-full pl-12 pr-4 py-3 bg-surface dark:bg-slate-800/50 border ${formErrors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-border focus:ring-primary focus:border-primary'} rounded-card text-sm text-surface-on placeholder-surface-on-variant/40 transition-all`}
                                    placeholder="Alex Morgan"
                                    required
                                />
                            </div>
                            {formErrors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center">• {formErrors.name}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-surface-on uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-surface-on-variant/50" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setFormErrors(prev => ({ ...prev, email: null })); }}
                                    className={`block w-full pl-12 pr-4 py-3 bg-surface dark:bg-slate-800/50 border ${formErrors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-border focus:ring-primary focus:border-primary'} rounded-card text-sm text-surface-on placeholder-surface-on-variant/40 transition-all`}
                                    placeholder="scholar@university.edu"
                                    required
                                />
                            </div>
                            {formErrors.email && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center">• {formErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-surface-on uppercase tracking-widest mb-1.5 ml-1">University</label>
                            <input
                                type="text"
                                value={university}
                                onChange={(e) => { setUniversity(e.target.value); setFormErrors(prev => ({ ...prev, university: null })); }}
                                className={`block w-full px-4 py-3 bg-surface dark:bg-slate-800/50 border ${formErrors.university ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-border focus:ring-primary focus:border-primary'} rounded-card text-sm text-surface-on placeholder-surface-on-variant/40 transition-all`}
                                placeholder="University Name"
                            />
                            {formErrors.university && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center">• {formErrors.university}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-surface-on uppercase tracking-widest mb-1.5 ml-1">Department</label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => { setDepartment(e.target.value); setFormErrors(prev => ({ ...prev, department: null })); }}
                                className={`block w-full px-4 py-3 bg-surface dark:bg-slate-800/50 border ${formErrors.department ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-border focus:ring-primary focus:border-primary'} rounded-card text-sm text-surface-on placeholder-surface-on-variant/40 transition-all`}
                                placeholder="e.g. Computer Science"
                            />
                            {formErrors.department && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center">• {formErrors.department}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-surface-on uppercase tracking-widest mb-1.5 ml-1">Year</label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="block w-full px-4 py-3 bg-surface dark:bg-slate-800/50 border border-border rounded-card focus:ring-1 focus:ring-primary focus:border-primary text-sm text-surface-on placeholder-surface-on-variant/40 transition-all"
                                placeholder="e.g. 2nd Year"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-surface-on uppercase tracking-widest mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-surface-on-variant/50" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setFormErrors(prev => ({ ...prev, password: null })); }}
                                    className={`block w-full pl-12 pr-12 py-3 bg-surface dark:bg-slate-800/50 border ${formErrors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-border focus:ring-primary focus:border-primary'} rounded-card text-sm text-surface-on placeholder-surface-on-variant/40 transition-all`}
                                    placeholder="••••••••"
                                    required minLength={8}
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-surface-on-variant/50 hover:text-surface-on transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-surface-on-variant/50 hover:text-surface-on transition-colors" />
                                    )}
                                </div>
                            </div>
                            <div className="text-[10px] mt-2 space-y-1 font-bold">
                                <p className={`flex items-center ${password.length >= 8 ? 'text-emerald-500' : 'text-surface-on-variant/50'}`}>• At least 8 characters</p>
                                <p className={`flex items-center ${/[A-Z]/.test(password) ? 'text-emerald-500' : 'text-surface-on-variant/50'}`}>• One uppercase letter</p>
                                <p className={`flex items-center ${/\d/.test(password) ? 'text-emerald-500' : 'text-surface-on-variant/50'}`}>• One number</p>
                                <p className={`flex items-center ${/[!@#$%^&*]/.test(password) ? 'text-emerald-500' : 'text-surface-on-variant/50'}`}>• One special character (!@#$%^&*)</p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-button shadow-xl text-base font-bold text-white bg-primary hover:bg-primary-tint active:scale-95 focus:outline-none transition-all duration-150 mt-6 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Create Account →'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                        <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-card-bg px-4 text-surface-on-variant/40">Or continue with</span></div>
                    </div>

                    <div>
                        <a href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/google`} className="w-full flex justify-center items-center py-3 px-4 border border-border rounded-button shadow-sm text-sm font-bold text-surface-on bg-surface dark:bg-slate-800 hover:bg-surface-bright active:scale-95 transition-all duration-150">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-3" />
                            Google Account
                        </a>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm font-medium">
                    <span className="text-surface-on-variant">Already have an account? </span>
                    <Link to="/login" className="font-bold text-primary hover:underline">
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
