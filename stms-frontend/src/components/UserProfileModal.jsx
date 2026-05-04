import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const UserProfileModal = ({ onClose }) => {
    const { user, login } = useAuth();
    const { showNotification } = useNotification();

    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        department: user?.department || '',
        study_year: user?.study_year || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', form);
            localStorage.setItem('stms_token', res.data.token);
            login(res.data.token, res.data.user);
            showNotification('Profile updated successfully!', 'success');
            onClose();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error updating profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 p-4 backdrop-blur-md shadow-2xl overflow-y-auto pt-20 pb-20">
            <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[32px] shadow-2xl animate-fade-in-up overflow-hidden relative border border-outline-variant/30">

                {/* Banner Header */}
                <div className="h-40 bg-gradient-to-br from-primary to-primary-container relative">
                    <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors backdrop-blur-md">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="absolute -bottom-12 left-10">
                        <div className="w-28 h-28 rounded-full border-4 border-surface-container-lowest overflow-hidden shadow-xl bg-white relative group">
                            <div className="w-full h-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-4xl font-bold">
                                {user?.full_name?.charAt(0)}
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="material-symbols-outlined text-white">photo_camera</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-10 pt-16 pb-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-h2 font-h2 text-on-surface mb-1">{user?.full_name}</h2>
                            <p className="text-body-md text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                {user?.role} Profile • {user?.department}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center px-4 border-r border-outline-variant">
                                <div className="text-h3 font-h3 text-primary">12</div>
                                <div className="text-label-caps text-on-surface-variant">Active</div>
                            </div>
                            <div className="text-center px-4 border-r border-outline-variant">
                                <div className="text-h3 font-h3 text-tertiary-container">84%</div>
                                <div className="text-label-caps text-on-surface-variant">GPA</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-h3 font-h3 text-secondary-container">5</div>
                                <div className="text-label-caps text-on-surface-variant">Courses</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Personal Info */}
                        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                            <h3 className="text-label-caps text-primary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-label-caps text-on-surface-variant">Full Name</label>
                                    <input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-label-caps text-on-surface-variant">Email Address</label>
                                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Academic Profile */}
                        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container"></div>
                            <h3 className="text-label-caps text-tertiary-container mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">school</span>
                                Academic Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-label-caps text-on-surface-variant">Department</label>
                                    <input required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-all" />
                                </div>
                                {user?.role === 'Student' && (
                                    <div className="space-y-2">
                                        <label className="text-label-caps text-on-surface-variant">Study Year</label>
                                        <select required value={form.study_year} onChange={e => setForm({ ...form, study_year: e.target.value })}
                                            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-on-surface focus:border-primary outline-none transition-all">
                                            {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="px-8 py-3 rounded-full font-button-text text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-3 rounded-full bg-primary text-on-primary font-button-text hover:shadow-lg transform active:scale-95 transition-all">
                                {loading ? 'Saving Changes...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
