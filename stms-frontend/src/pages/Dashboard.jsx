import React from 'react';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { AlertCircle, CheckCircle, Clock, ListTodo, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuthStore();

    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['dashStats'],
        queryFn: async () => {
            const res = await api.get('/dashboard/stats');
            return res.data.data;
        }
    });

    const { data: upcomingTasks, isLoading: upcomingLoading } = useQuery({
        queryKey: ['dashUpcoming'],
        queryFn: async () => {
            const res = await api.get('/dashboard/upcoming');
            return res.data.data; // Tasks array
        }
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const firstName = user?.name?.split(' ')[0] || 'Student';

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-surface-on tracking-tight">
                    {getGreeting()}, {firstName} 👋
                </h1>
                <p className="text-surface-on-variant mt-2">Here's an overview of your academic tasks.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Total */}
                <div className="bg-card-bg overflow-hidden shadow-ambient rounded-card border border-border p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary/10 dark:bg-primary/20 p-3 rounded-feature">
                            <ListTodo className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-xs font-bold text-surface-on-variant uppercase tracking-wider">Total Tasks</dt>
                                <dd className="text-2xl font-bold text-surface-on">{statsLoading ? '...' : statsData?.total}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* To Do */}
                <div className="bg-card-bg overflow-hidden shadow-ambient rounded-card border border-border p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-amber-500/10 dark:bg-amber-500/20 p-3 rounded-feature">
                            <Clock className="h-6 w-6 text-amber-500" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-xs font-bold text-surface-on-variant uppercase tracking-wider">Pending</dt>
                                <dd className="text-2xl font-bold text-surface-on">{statsLoading ? '...' : statsData?.pending}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Overdue */}
                <div className="bg-red-50 dark:bg-red-950/20 overflow-hidden shadow-ambient rounded-card border border-red-200 dark:border-red-900/30 p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500/10 dark:bg-red-500/20 p-3 rounded-feature">
                            <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">Overdue</dt>
                                <dd className="text-2xl font-bold text-red-600 dark:text-red-400">{statsLoading ? '...' : statsData?.overdue}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Done */}
                <div className="bg-card-bg overflow-hidden shadow-ambient rounded-card border border-border p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-emerald-500/10 dark:bg-emerald-500/20 p-3 rounded-feature">
                            <CheckCircle className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-xs font-bold text-surface-on-variant uppercase tracking-wider">Completed</dt>
                                <dd className="text-2xl font-bold text-surface-on">{statsLoading ? '...' : statsData?.done}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-card-bg shadow-ambient rounded-card border border-border overflow-hidden">
                <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-surface/30 dark:bg-slate-800/30">
                    <h3 className="text-lg leading-6 font-bold text-surface-on tracking-tight">Upcoming This Week</h3>
                    <Link to="/tasks" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">View all</Link>
                </div>
                <ul className="divide-y divide-border">
                    {upcomingLoading && <li className="px-6 py-12 text-center text-surface-on-variant font-medium">Scanning for upcoming items...</li>}
                    {!upcomingLoading && upcomingTasks?.length === 0 && (
                        <li className="px-6 py-16 text-center">
                            <CheckCircle className="w-12 h-12 mx-auto text-primary/20 mb-4" />
                            <p className="text-sm font-medium text-surface-on-variant">No immediate deadlines. Smooth sailing!</p>
                        </li>
                    )}
                    {!upcomingLoading && upcomingTasks?.map((task) => (
                        <li key={task.id} className="px-6 py-5 hover:bg-surface/50 dark:hover:bg-slate-800/50 transition-colors group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center min-w-0">
                                    <div className="h-5 w-5 rounded-full border-2 border-border mr-4 flex items-center justify-center group-hover:border-primary transition-colors">
                                        <span className="h-2 w-2 rounded-full bg-transparent group-hover:bg-primary/30" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-surface-on truncate tracking-tight">{task.title}</p>
                                        <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-wider mt-0.5">
                                            {task.subject || 'Academic'}
                                        </p>
                                    </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <span aria-label={`Priority: ${task.priority}`} className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded-full 
                                        ${task.priority === 'high' ? 'bg-red-500 text-white' :
                                            task.priority === 'medium' ? 'bg-amber-500 text-white' :
                                                'bg-primary text-white'}`}>
                                        {task.priority}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between ml-9">
                                <div className="flex items-center text-[11px] font-bold text-primary-fixed uppercase tracking-tighter bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded">
                                    {task.category_name || 'General'}
                                </div>
                                <div className="flex items-center text-xs font-semibold text-surface-on-variant">
                                    <Clock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-primary" />
                                    <span>Due {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Quick Add FAB */}
            <Link
                to="/tasks?action=new"
                title="Add New Task"
                aria-label="Create a new task"
                className="fixed bottom-8 right-8 h-14 w-14 bg-primary text-white rounded-full shadow-premium flex items-center justify-center hover:bg-primary-tint focus:outline-none transform hover:scale-110 active:scale-95 transition-all z-40 border-4 border-card-bg"
            >
                <Plus className="w-8 h-8" />
            </Link>
        </Layout>
    );
};

export default Dashboard;
