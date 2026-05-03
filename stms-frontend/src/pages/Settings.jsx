import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import Layout from '../components/Layout';
import { User, Moon, LogOut } from 'lucide-react';
import AlertModal from '../components/AlertModal';

const Settings = () => {
    const { user, fetchProfile, logout } = useAuthStore();
    const { addToast } = useToastStore();
    const queryClient = useQueryClient();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [university, setUniversity] = useState(user?.university || '');
    const [department, setDepartment] = useState(user?.department || '');
    const [year, setYear] = useState(user?.year || '');

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setUniversity(user.university || '');
            setDepartment(user.department || '');
            setYear(user.year || '');
        }
    }, [user]);

    // Profile Validation
    const validateProfile = () => {
        if (name.trim().length < 2) {
            addToast('Name is too short.', 'error');
            return false;
        }
        if (university && university.length > 100) {
            addToast('University name is too long.', 'error');
            return false;
        }
        return true;
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        try {
            await api.put('/users/me', { name, university, department, year });
            await fetchProfile();
            addToast('Profile updated successfully!', 'success');
        } catch (error) {
            addToast('Failed to update profile.', 'error');
        }
    };

    // Prefs State
    const [prefs, setPrefs] = useState({
        dark_mode: false,
        task_reminders: true,
        weekly_digest: false,
        auto_focus_mode: false
    });

    const { data: userPrefs } = useQuery({
        queryKey: ['preferences'],
        queryFn: async () => {
            const res = await api.get('/users/me/preferences');
            return res.data.data;
        }
    });

    useEffect(() => {
        if (userPrefs) {
            setPrefs({
                dark_mode: !!userPrefs.dark_mode,
                task_reminders: !!userPrefs.task_reminders,
                weekly_digest: !!userPrefs.weekly_digest,
                auto_focus_mode: !!userPrefs.auto_focus_mode
            });
        }
    }, [userPrefs]);

    const updatePrefMutation = useMutation({
        mutationFn: async (newPrefs) => {
            await api.put('/users/me/preferences', newPrefs);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['preferences']);
            addToast('Preferences saved!', 'success');
        },
        onError: () => {
            addToast('Failed to update preferences.', 'error');
        }
    });

    const handlePrefChange = (key, value) => {
        const updated = { ...prefs, [key]: value };
        setPrefs(updated);
        updatePrefMutation.mutate(updated);

        // Real-time theme switch
        if (key === 'dark_mode') {
            useAuthStore.getState().setDarkMode(value);
        }
    };

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-surface-on tracking-tight">Settings</h1>
                <p className="text-surface-on-variant mt-1">Manage your account and customize your experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Profile Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card-bg shadow-ambient rounded-card border border-border p-6">
                        <div className="flex items-center mb-6 border-b border-border pb-4">
                            <User className="h-5 w-5 text-primary mr-2" />
                            <h2 className="text-xl font-bold text-surface-on tracking-tight">Public Profile</h2>
                        </div>

                        <form onSubmit={updateProfile} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-surface-on mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="mt-1 block w-full border border-border bg-surface dark:bg-slate-800 rounded-card shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-on mb-1">Email Address <span className="text-[10px] text-primary px-1.5 py-0.5 bg-primary-fixed rounded-full ml-2">Verified</span></label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="mt-1 block w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-card shadow-sm py-2 px-3 text-sm text-surface-on-variant cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-on mb-1">University</label>
                                    <input
                                        type="text"
                                        value={university}
                                        onChange={e => setUniversity(e.target.value)}
                                        className="mt-1 block w-full border border-border bg-surface dark:bg-slate-800 rounded-card shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                        placeholder="e.g. Stanford University"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-on mb-1">Department / Major</label>
                                    <input
                                        type="text"
                                        value={department}
                                        onChange={e => setDepartment(e.target.value)}
                                        className="mt-1 block w-full border border-border bg-surface dark:bg-slate-800 rounded-card shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                        placeholder="e.g. Software Engineering"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-on mb-1">Academic Year</label>
                                    <select
                                        value={year}
                                        onChange={e => setYear(e.target.value)}
                                        className="mt-1 block w-full bg-surface dark:bg-slate-800 border border-border rounded-card shadow-sm py-2.5 px-3 focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                    >
                                        <option value="">Select Year...</option>
                                        <option value="Freshman">Freshman</option>
                                        <option value="Sophomore">Sophomore</option>
                                        <option value="Junior">Junior</option>
                                        <option value="Senior">Senior</option>
                                        <option value="Graduate">Graduate</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border mt-6">
                                <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-button text-white bg-primary hover:bg-primary-tint active:scale-95 transition-all">
                                    Save Profile
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* App Preferences */}
                    <div className="bg-card-bg shadow-ambient rounded-card border border-border p-6">
                        <div className="flex items-center mb-6 border-b border-border pb-4">
                            <Moon className="h-5 w-5 text-secondary mr-2" />
                            <h2 className="text-xl font-bold text-surface-on tracking-tight">App Preferences</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-surface-on">Dark Mode</h4>
                                    <p className="text-xs text-surface-on-variant">Toggle dark styling across the entire interface.</p>
                                </div>
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={prefs.dark_mode} onChange={(e) => handlePrefChange('dark_mode', e.target.checked)} />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="border-t border-border pt-6 flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-surface-on">Task Reminders</h4>
                                    <p className="text-xs text-surface-on-variant">Receive email and in-app alerts for upcoming deadlines.</p>
                                </div>
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={prefs.task_reminders} onChange={(e) => handlePrefChange('task_reminders', e.target.checked)} />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="border-t border-border pt-6 flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-surface-on">Auto-Focus Mode</h4>
                                    <p className="text-xs text-surface-on-variant">Automatically hide completed tasks from the dashboard.</p>
                                </div>
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={prefs.auto_focus_mode} onChange={(e) => handlePrefChange('auto_focus_mode', e.target.checked)} />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="border-t border-border pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-surface-on">Setup Defaults</h4>
                                        <p className="text-xs text-surface-on-variant">Restore missing assignment/exam categories if your list is empty.</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.get('/categories'); // The GET request itself triggers self-healing seeding
                                                queryClient.invalidateQueries(['categories']);
                                                addToast('Default categories restored!', 'success');
                                            } catch (e) {
                                                addToast('Failed to restore categories.', 'error');
                                            }
                                        }}
                                        className="text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-button hover:bg-primary/10 transition-all"
                                    >
                                        Restore Defaults
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Account Management */}
                <div className="space-y-6">
                    <div className="bg-card-bg shadow-ambient rounded-card border border-border p-6">
                        <h2 className="text-lg font-bold text-surface-on tracking-tight mb-4">Connected Accounts</h2>
                        <div className="flex items-center justify-between p-3 border border-border rounded-md bg-surface dark:bg-slate-800">
                            <div className="flex items-center text-sm font-semibold text-surface-on">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-3" alt="Google" />
                                Google
                            </div>
                            {user?.google_id ? (
                                <span className="text-[10px] text-primary bg-primary-fixed px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Linked</span>
                            ) : (
                                <a href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/google`} className="text-xs text-primary hover:underline font-bold">Link Account</a>
                            )}
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-card border border-red-100 dark:border-red-900/30 p-6">
                        <h2 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">Danger Zone</h2>
                        <p className="text-xs text-red-600 dark:text-red-300 mb-4 font-medium">Once you delete your account, there is no going back. Please be certain.</p>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full inline-flex justify-center items-center py-2 px-4 border border-red-200 dark:border-red-800 shadow-sm text-sm font-bold rounded-button text-red-700 dark:text-red-400 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900 transition-all active:scale-95"
                        >
                            Delete Account
                        </button>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-button shadow-sm text-sm font-bold text-white bg-slate-700 hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                    </button>
                </div>

            </div>

            <AlertModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => {
                    try {
                        await api.delete('/users/me');
                        addToast('Account deleted. We hope to see you again.', 'info');
                        logout();
                    } catch (error) {
                        addToast('Failed to delete account.', 'error');
                    }
                }}
                title="Permanently Delete Account?"
                message="All your tasks, preferences, and data will be permanently erased. This cannot be undone."
                confirmText="Yes, delete everything"
                type="danger"
            />
        </Layout>
    );
};

export default Settings;
