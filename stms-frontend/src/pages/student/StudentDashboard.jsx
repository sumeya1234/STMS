import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AssignmentInbox from './AssignmentInbox';
import TaskBoard from './TaskBoard';
import MySubmissions from './MySubmissions';
import ProfilePage from '../../components/ProfilePage';
import { useSearch } from '../../context/SearchContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();

    const handleLogout = () => { logout(); navigate('/login'); };
    const isActive = (path, exact = false) => exact ? location.pathname === path || location.pathname === path + '/' : location.pathname.startsWith(path) && path !== '/student';

    useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

    return (
        <div className="bg-surface-bright text-on-background font-body-md min-h-screen flex">
            {/* SideNavBar (AcadTrack Pattern) */}
            <nav className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-emerald-950 border-r border-emerald-900 shadow-2xl flex flex-col pt-6 transform transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {mobileMenuOpen && (
                    <button onClick={() => setMobileMenuOpen(false)} className="md:hidden absolute top-4 right-4 text-emerald-100/70 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
                <div className="px-8 mb-8 flex items-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-primary-fixed-dim fill-icon">school</span>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight font-h3">AcadTrack</h1>
                        <p className="text-emerald-500 font-sans antialiased text-sm font-medium">Student Portal</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto w-full px-2">
                    <ul className="space-y-2">
                        <li>
                            <Link to="/student" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/student', true) ? 'bg-emerald-900/50 text-white scale-[0.98]' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/30'}`}>
                                <span className={`material-symbols-outlined ${isActive('/student', true) ? 'fill-icon' : ''}`}>dashboard</span>
                                <span className="font-sans antialiased text-sm font-medium">My Tasks</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/student/inbox" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/student/inbox') ? 'bg-emerald-900/50 text-white scale-[0.98]' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/30'}`}>
                                <span className={`material-symbols-outlined ${isActive('/student/inbox') ? 'fill-icon' : ''}`}>assignment</span>
                                <span className="font-sans antialiased text-sm font-medium">Assignments Inbox</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/student/submissions" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/student/submissions') ? 'bg-emerald-900/50 text-white scale-[0.98]' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/30'}`}>
                                <span className={`material-symbols-outlined ${isActive('/student/submissions') ? 'fill-icon' : ''}`}>cloud_upload</span>
                                <span className="font-sans antialiased text-sm font-medium">My Submissions</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/student/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/student/profile') ? 'bg-emerald-900/50 text-white scale-[0.98]' : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/30'}`}>
                                <span className={`material-symbols-outlined ${isActive('/student/profile') ? 'fill-icon' : ''}`}>person</span>
                                <span className="font-sans antialiased text-sm font-medium">Profile</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="p-4 border-t border-emerald-900/50">
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-emerald-100/70 hover:text-error hover:bg-error-container/10 transition-colors duration-200 rounded-lg">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-sans antialiased text-sm font-medium">Logout</span>
                    </button>
                </div>
            </nav>

            {/* Mobile backdrop */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            )}

            {/* TopNavBar */}
            <header className="flex justify-between items-center px-4 md:px-8 w-full bg-white/80 backdrop-blur-md fixed top-0 right-0 md:w-[calc(100%-260px)] h-16 z-40 border-b border-emerald-50 shadow-sm transition-all md:ml-[260px]">
                <div className="flex items-center gap-4">
                    <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="hidden md:flex relative w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline">search</span>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tasks, courses..." className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-body-sm font-body-sm text-on-surface outline-none transition-all" />
                    </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6 cursor-pointer group" onClick={() => navigate('/student/profile')}>
                    <div className="flex flex-col text-right hidden sm:flex">
                        <span className="text-body-sm font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{user?.full_name}</span>
                        <span className="text-caption text-on-surface-variant">{user?.department} — Year {user?.study_year}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex justify-center items-center font-bold shadow-sm group-hover:ring-2 group-hover:ring-primary transition-all">
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-1 md:ml-[260px] pt-[100px] px-6 pb-12 min-h-screen">
                <div className="max-w-[1400px] mx-auto w-full">
                    <Routes>
                        <Route path="/" element={<TaskBoard />} />
                        <Route path="/inbox" element={<AssignmentInbox />} />
                        <Route path="/submissions" element={<MySubmissions />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
