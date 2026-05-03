import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Clock, Plus, Filter, Circle, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TaskModal from '../components/TaskModal';
import AlertModal from '../components/AlertModal';
import { useToastStore } from '../store/toastStore';

const Tasks = () => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('deadline');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // Alert Modal State
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, taskId: null });

    const openAddModal = useCallback(() => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    }, []);

    React.useEffect(() => {
        if (searchParams.get('action') === 'new') {
            openAddModal();
            // Clear the param so the modal doesn't reopen after task creation
            navigate('/tasks', { replace: true });
        }
    }, [searchParams, openAddModal, navigate]);

    const searchTerm = searchParams.get('search') || '';

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks', filter, sort, searchTerm],
        queryFn: async () => {
            const statusFilter = filter !== 'all' ? `&status=${filter}` : '';
            const searchFilter = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
            const res = await api.get(`/tasks?sortby=${sort}${statusFilter}${searchFilter}`);
            return res.data.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            await api.patch(`/tasks/${id}/status`, { status });
        },
        onSuccess: (_, variables) => {
            addToast(`Task marked as ${variables.status === 'completed' ? 'done' : 'pending'}`, 'success');
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['dashStats']);
            queryClient.invalidateQueries(['dashUpcoming']);
        },
        onError: () => {
            addToast('Failed to update task status.', 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            addToast('Task removed from your schedule.', 'info');
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['dashStats']);
        },
        onError: () => {
            addToast('Could not delete task. Try again later.', 'error');
        }
    });

    const toggleStatus = (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        statusMutation.mutate({ id: task.id, status: newStatus });
    };


    const openEditModal = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-surface-on tracking-tight">Tasks</h1>
                    <p className="text-surface-on-variant mt-1">Manage your coursework and assignments.</p>
                </div>
                <button
                    onClick={openAddModal}
                    aria-label="Add new task"
                    className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-button shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-tint active:scale-95 focus:outline-none transition-all duration-150"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    New Task
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 px-6 py-4 rounded-card border border-surface-variant shadow-ambient mb-6 space-y-4 sm:space-y-0">
                <div className="flex space-x-2">
                    {['all', 'pending', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            aria-label={`Filter by ${f}`}
                            className={`px-4 py-1.5 rounded-button text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'text-surface-on-variant hover:bg-surface'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-surface-on-variant" />
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        aria-label="Sort tasks"
                        className="block w-full sm:w-48 pl-3 pr-10 py-2 text-sm border-surface-variant dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-primary focus:border-primary rounded-card"
                    >
                        <option value="deadline">Sort by Deadline</option>
                        <option value="priority">Sort by Priority</option>
                        <option value="created_at">Sort by Newest</option>
                    </select>
                </div>
            </div>

            {/* Task List */}
            <div className="bg-white dark:bg-slate-900 shadow-ambient rounded-card border border-surface-variant overflow-hidden">
                <ul className="divide-y divide-surface-variant">
                    {isLoading && <li className="p-12 text-center text-surface-on-variant font-medium">Fetching your tasks...</li>}

                    {!isLoading && tasks?.length === 0 && (
                        <li className="p-16 text-center">
                            <div className="mx-auto w-20 h-20 bg-surface dark:bg-slate-800 flex items-center justify-center rounded-full mb-4">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-surface-on mb-1 tracking-tight">Focus on the path ahead</h3>
                            <p className="text-surface-on-variant text-sm">No tasks found. Take a deep breath and relax!</p>
                        </li>
                    )}

                    {tasks?.map(task => (
                        <li key={task.id} className={`p-5 transition flex flex-col sm:flex-row hover:bg-surface-bright dark:hover:bg-slate-800/50 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
                            <div className="flex flex-1 items-start">
                                <button
                                    onClick={() => toggleStatus(task)}
                                    aria-label={task.status === 'completed' ? 'Mark task as pending' : 'Mark task as completed'}
                                    className="mt-0.5 flex-shrink-0 text-surface-on-variant hover:text-primary transition-all active:scale-125"
                                >
                                    {task.status === 'completed' ? (
                                        <CheckCircle2 className="w-6 h-6 text-primary" aria-hidden="true" />
                                    ) : (
                                        <Circle className="w-6 h-6" aria-hidden="true" />
                                    )}
                                </button>

                                <div className="ml-4 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h4 className={`text-base font-bold tracking-tight ${task.status === 'completed' ? 'line-through text-surface-on-variant' : 'text-surface-on'}`}>
                                            {task.title}
                                        </h4>
                                        <span aria-label={`Priority: ${task.priority}`} className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full 
                                            ${task.priority === 'high' ? 'bg-red-500 text-white' :
                                                task.priority === 'medium' ? 'bg-amber-500 text-white' :
                                                    'bg-primary text-white'}`}>
                                            {task.priority}
                                        </span>
                                        {task.category_name && (
                                            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-secondary-container text-secondary">
                                                {task.category_name}
                                            </span>
                                        )}
                                    </div>

                                    {task.description && (
                                        <p className="mt-1 text-sm text-surface-on-variant line-clamp-2 max-w-2xl">
                                            {task.description}
                                        </p>
                                    )}

                                    <div className="mt-3 flex items-center text-xs font-semibold text-surface-on-variant">
                                        <Clock className="w-4 h-4 mr-1.5 text-primary" />
                                        Due {format(new Date(task.deadline), 'MMM d, yyyy • h:mm a')}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => openEditModal(task)}
                                    aria-label="Edit Task"
                                    className="p-2.5 text-surface-on-variant hover:text-primary hover:bg-surface-variant rounded-full transition-all active:scale-95"
                                    title="Edit Task"
                                >
                                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => {
                                        setAlertConfig({ isOpen: true, taskId: task.id });
                                    }}
                                    aria-label="Delete Task"
                                    className="p-2.5 text-surface-on-variant hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-95"
                                    title="Delete Task"
                                >
                                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} taskToEdit={taskToEdit} />

            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ isOpen: false, taskId: null })}
                onConfirm={() => deleteMutation.mutate(alertConfig.taskId)}
                title="Delete Task?"
                message="This will permanently remove this task from your academic schedule. This action cannot be undone."
                confirmText="Delete permanently"
                type="danger"
            />
        </Layout>
    );
};

export default Tasks;
