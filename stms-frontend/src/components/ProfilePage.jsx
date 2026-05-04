import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ProfilePage = () => {
    const { user, loginDirect, logout } = useAuth();
    const { showNotification } = useNotification();

    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        department: user?.department || '',
        study_year: user?.study_year || '',
    });
    const [loading, setLoading] = useState(false);
    const [passForm, setPassForm] = useState({ old_password: '', new_password: '' });
    const [passErrors, setPassErrors] = useState({});
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', form);
            loginDirect(res.data.token, res.data.user);
            showNotification('Profile details updated.', 'success');
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error updating profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePassUpdate = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!passForm.old_password.trim()) errs.old_password = 'Current password is required.';
        if (!passForm.new_password.trim()) errs.new_password = 'New password is required.';
        else if (passForm.new_password.length < 6) errs.new_password = 'New password must be at least 6 characters.';

        if (Object.keys(errs).length > 0) {
            setPassErrors(errs);
            return;
        }

        try {
            await api.put('/auth/update-password', passForm);
            showNotification('Password changed successfully.', 'success');
            setPassForm({ old_password: '', new_password: '' });
            setPassErrors({});
        } catch (error) {
            showNotification(error.response?.data?.message || 'Failed to update password', 'error');
        }
    };

    const handleDelete = async () => {
        if (!confirm('EXTREME CAUTION: This will permanently delete your account. Proceed?')) return;
        try {
            await api.delete('/auth/account');
            showNotification('Account deleted.', 'info');
            logout();
        } catch (e) { showNotification('Deletion failed', 'error'); }
    };

    const isTeacher = user?.role === 'Teacher';

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface">Account Settings</h1>
                    <p className="text-on-surface-variant text-sm">Manage your security and profile information.</p>
                </div>
            </div>

            <div className="space-y-6 pb-20">
                {/* Profile Card */}
                <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-emerald-900 to-emerald-800 relative">
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-20 h-20 rounded-full border-4 border-surface-container-lowest bg-secondary-container text-on-secondary-container flex items-center justify-center text-3xl font-bold shadow-md">
                                {user?.full_name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 px-8 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-on-surface">{user?.full_name}</h2>
                                <p className="text-on-surface-variant text-sm flex items-center gap-1.5 mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                    {user?.role} • {isTeacher ? user?.department + ' Faculty' : user?.department}
                                </p>
                            </div>
                            <div className="h-10 w-px bg-outline-variant hidden sm:block"></div>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-primary">{user?.department}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">Department</div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Full Name</label>
                                <input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Email Address</label>
                                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">{isTeacher ? 'Faculty' : 'Department'}</label>
                                <input required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary outline-none transition-all" />
                            </div>
                            {!isTeacher && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tight">Study Year</label>
                                    <select required value={form.study_year} onChange={e => setForm({ ...form, study_year: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary outline-none transition-all">
                                        {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                                    </select>
                                </div>
                            )}
                            <div className="md:col-span-2 pt-2">
                                <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold shadow-sm hover:translate-y-[-1px] transition-all active:scale-95">
                                    {loading ? 'Saving...' : 'Update Details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant">
                        <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">lock</span>
                            Security Keys
                        </h3>
                        <form onSubmit={handlePassUpdate} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase">Current Password</label>
                                <div className="relative flex items-center">
                                    <input type={showOldPassword ? 'text' : 'password'} value={passForm.old_password} onChange={e => { setPassForm({ ...passForm, old_password: e.target.value }); setPassErrors(p => ({ ...p, old_password: '' })); }}
                                        className={`w-full px-4 pr-10 py-2 bg-surface border rounded-lg text-sm outline-none focus:outline-none transition-colors ${passErrors.old_password ? 'border-error focus:border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'}`} placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 text-outline-variant hover:text-on-surface-variant focus:outline-none flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">{showOldPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                {passErrors.old_password && <p className="text-error text-xs mt-1">{passErrors.old_password}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-on-surface-variant uppercase">New Password</label>
                                <div className="relative flex items-center">
                                    <input type={showNewPassword ? 'text' : 'password'} value={passForm.new_password} onChange={e => { setPassForm({ ...passForm, new_password: e.target.value }); setPassErrors(p => ({ ...p, new_password: '' })); }}
                                        className={`w-full px-4 pr-10 py-2 bg-surface border rounded-lg text-sm outline-none focus:outline-none transition-colors ${passErrors.new_password ? 'border-error focus:border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'}`} placeholder="Minimum 6 characters" />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 text-outline-variant hover:text-on-surface-variant focus:outline-none flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                                {passErrors.new_password && <p className="text-error text-xs mt-1">{passErrors.new_password}</p>}
                            </div>
                            <button type="submit" className="w-full py-2 bg-on-surface text-surface rounded-full text-sm font-bold mt-2 hover:opacity-90">
                                Refresh Password
                            </button>
                        </form>
                    </div>

                    <div className="bg-error-container/10 p-8 rounded-2xl border border-error/20 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-error flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined">dangerous</span>
                                Danger Zone
                            </h3>
                            <p className="text-sm text-on-surface-variant mb-6">
                                Once you delete your account, there is no going back. All your tasks, submissions, and course data will be permanently removed.
                            </p>
                        </div>
                        <button onClick={handleDelete} className="w-full py-2 bg-error text-on-error rounded-full text-sm font-bold hover:bg-error/90 transition-colors">
                            Close Account Forever
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
