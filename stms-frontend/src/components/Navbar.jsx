import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut, CheckCircle, Calendar, CalendarDays, LayoutDashboard, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useToastStore } from '../store/toastStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { addToast } = useToastStore();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: notifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/notifications');
            return res.data.data;
        },
        refetchInterval: 60000,
        refetchIntervalInBackground: false
    });

    const readMutation = useMutation({
        mutationFn: async (id) => {
            await api.patch(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        }
    });

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };


    // Initials generation
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const navLinks = [
        { path: '/', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5 mr-1.5" /> },
        { path: '/tasks', label: 'Tasks', icon: <CheckCircle className="w-5 h-5 mr-1.5" /> },
        { path: '/calendar', label: 'Calendar', icon: <CalendarDays className="w-5 h-5 mr-1.5" /> },
    ];

    return (
        <nav className="bg-card-bg border-b border-border sticky top-0 z-50 transition-colors shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side: Logo & Links */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-primary tracking-tight">ScholarFlow</Link>
                        </div>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-all ${location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-surface-on-variant hover:text-surface-on hover:border-border'
                                        }`}
                                >
                                    {React.cloneElement(link.icon, { className: 'w-4 h-4 mr-2' })}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Search, Notify, Profile */}
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-surface-on-variant" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="block w-64 pl-10 pr-3 py-1.5 bg-surface dark:bg-slate-800 border border-border rounded-card text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder-surface-on-variant/50 transition-all"
                                placeholder="Search tasks... (Enter)"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                                className="p-2 rounded-full text-surface-on-variant hover:text-primary hover:bg-surface transition-all relative active:scale-95"
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                {notifications?.some(n => !n.is_read) && (
                                    <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-card-bg"></span>
                                )}
                            </button>

                            {notifOpen && (
                                <div className="origin-top-right absolute right-0 mt-3 w-80 rounded-card shadow-premium py-1 bg-card-bg border border-border z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-surface/50 dark:bg-slate-800/50">
                                        <h3 className="text-xs font-bold text-surface-on uppercase tracking-wider">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications?.length === 0 ? (
                                            <div className="px-4 py-8 text-center">
                                                <Bell className="w-8 h-8 mx-auto text-surface-on-variant/20 mb-2" />
                                                <p className="text-sm text-surface-on-variant font-medium">Clear skies! No notifications.</p>
                                            </div>
                                        ) : (
                                            notifications?.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={`px-4 py-3 border-b border-border flex items-start space-x-3 hover:bg-surface transition-colors cursor-pointer ${!notif.is_read ? 'bg-primary/5' : ''}`}
                                                    onClick={() => {
                                                        if (!notif.is_read) readMutation.mutate(notif.id);
                                                    }}
                                                >
                                                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-surface-on font-medium line-clamp-2">{notif.message}</p>
                                                        <p className="text-[10px] text-surface-on-variant mt-1 font-bold uppercase">{new Date(notif.sent_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                                className="flex items-center group focus:outline-none"
                            >
                                <div className="h-9 w-9 rounded-full bg-primary-fixed text-primary font-black flex items-center justify-center text-sm shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all overflow-hidden bg-emerald-100 dark:bg-emerald-900/30">
                                    {getInitials(user?.name)}
                                </div>
                            </button>

                            {dropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-card shadow-premium py-1 bg-card-bg border border-border z-50">
                                    <div className="px-4 py-3 border-b border-border bg-surface/30 dark:bg-slate-800/30">
                                        <p className="text-sm font-bold text-surface-on truncate">{user?.name}</p>
                                        <p className="text-[10px] text-surface-on-variant truncate font-bold uppercase tracking-tight">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/settings"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center px-4 py-2.5 text-sm text-surface-on font-semibold hover:bg-surface transition-colors"
                                    >
                                        <Settings className="h-4 w-4 mr-3 text-surface-on-variant" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            logout();
                                        }}
                                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
