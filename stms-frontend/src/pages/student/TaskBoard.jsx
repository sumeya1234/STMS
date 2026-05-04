import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { useSearch } from '../../context/SearchContext';
import EditTaskModal from './EditTaskModal';

const TaskBoard = () => {
    const { showNotification } = useNotification();
    const { searchQuery } = useSearch();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [nt, setNt] = useState({ title: '', course_info: '', due_date: '', priority: 'Medium', description: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => { fetchTasks(); }, []);
    const fetchTasks = async () => {
        try { const r = await api.get('/tasks'); setTasks(r.data.tasks || []); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!nt.title.trim()) errs.title = 'A task title is required.';
        if (!nt.due_date) errs.due_date = 'Please set a due date.';

        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        try {
            await api.post('/tasks', { ...nt, is_personal: true });
            showNotification('New task created!', 'success');
            setShowForm(false);
            setNt({ title: '', course_info: '', due_date: '', priority: 'Medium', description: '' });
            setErrors({});
            fetchTasks();
        } catch (e) { showNotification(e.response?.data?.message || 'Error creating task', 'error'); }
    };

    const toggle = async (id, status) => {
        const next = status === 'Completed' ? 'Pending' : 'Completed';
        setTasks(t => t.map(x => x.id === id ? { ...x, status: next } : x));
        try { await api.patch(`/tasks/${id}`, { status: next }); } catch { fetchTasks(); }
    };

    const del = async (id) => {
        if (!confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            showNotification('Task deleted', 'info');
            setTasks(t => t.filter(x => x.id !== id));
        } catch (e) { console.error(e); }
    };

    const filteredByState = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);
    const shown = searchQuery.trim() === ''
        ? filteredByState
        : filteredByState.filter(t =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.course_info && t.course_info.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    const totals = {
        total: tasks.length,
        done: tasks.filter(t => t.status === 'Completed').length,
        pending: tasks.filter(t => t.status !== 'Completed').length,
        overdue: tasks.filter(t => t.status !== 'Completed' && new Date(t.due_date) < new Date()).length,
    };

    // Calculate progress for ring
    const totalCount = totals.total || 1;
    const completionPct = Math.round((totals.done / totalCount) * 100);
    const dashOffset = 251.2 - (251.2 * completionPct) / 100;

    if (loading) return <div className="text-on-surface-variant text-center py-16">Loading your tasks…</div>;

    return (
        <div>
            {/* Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h2 className="font-h2 text-h2 text-on-surface mb-2">My Overview</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Here is your academic overview for today.</p>
                </div>
                <button onClick={() => setShowForm(true)} className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-button-text shadow-[rgba(0,0,0,0.1)_0px_4px_16px] transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Add Personal Task
                </button>
            </div>

            {/* Stats Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {/* Total */}
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[rgba(0,0,0,0.06)_0px_4px_16px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-surface-container-low rounded-lg text-primary-container">
                            <span className="material-symbols-outlined">format_list_bulleted</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Total Tasks</p>
                        <p className="font-h2 text-h2 text-on-surface">{totals.total}</p>
                    </div>
                </div>
                {/* Pending */}
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[rgba(0,0,0,0.06)_0px_4px_16px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary-container"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-surface-container-low rounded-lg text-secondary-container">
                            <span className="material-symbols-outlined">hourglass_empty</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Pending Tasks</p>
                        <p className="font-h2 text-h2 text-on-surface">{totals.pending}</p>
                    </div>
                </div>
                {/* Done */}
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[rgba(0,0,0,0.06)_0px_4px_16px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-surface-container-low rounded-lg text-primary">
                            <span className="material-symbols-outlined fill-icon">check_circle</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Completed</p>
                        <p className="font-h2 text-h2 text-on-surface">{totals.done}</p>
                    </div>
                </div>
                {/* Overdue */}
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[rgba(0,0,0,0.06)_0px_4px_16px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-surface-container-low rounded-lg text-error">
                            <span className="material-symbols-outlined fill-icon">warning</span>
                        </div>
                    </div>
                    <div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Overdue</p>
                        <p className="font-h2 text-h2 text-on-surface">{totals.overdue}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Task List */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-surface-container-lowest rounded-xl shadow-[rgba(0,0,0,0.06)_0px_4px_16px] p-6 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-h3 text-h3 text-on-surface">My Tasks</h3>
                            <div className="flex gap-2">
                                {['All', 'Pending', 'Completed'].map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`px-4 py-2 font-button-text text-button-text rounded-full shadow-sm transition-colors ${filter === f ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {shown.length === 0 ? (
                                <p className="text-center py-8 text-on-surface-variant">No tasks match this filter.</p>
                            ) : shown.map(t => {
                                const done = t.status === 'Completed';
                                const overdue = !done && new Date(t.due_date) < new Date();

                                let statusColor = 'border-outline-variant';
                                let badgeColor = 'bg-surface-variant text-on-surface-variant';
                                let label = t.status;

                                if (done) {
                                    statusColor = 'border-primary';
                                    badgeColor = 'bg-primary-container text-on-primary-container';
                                    label = 'Done';
                                } else if (overdue) {
                                    statusColor = 'border-error';
                                    badgeColor = 'bg-error-container text-on-error-container';
                                    label = 'Overdue';
                                } else {
                                    label = `${t.priority} Prio`;
                                    if (t.priority === 'High') {
                                        statusColor = 'border-secondary-container';
                                        badgeColor = 'bg-secondary-fixed text-on-secondary-fixed';
                                    } else if (t.priority === 'Medium') {
                                        statusColor = 'border-primary-container';
                                        badgeColor = 'bg-primary-container text-on-primary-container';
                                    } else {
                                        statusColor = 'border-outline-variant';
                                        badgeColor = 'bg-surface-variant text-on-surface-variant';
                                    }
                                }

                                return (
                                    <div key={t.id}
                                        onClick={() => setEditingTask(t)}
                                        className={`group bg-surface border-l-4 p-4 rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer border-r border-t border-b border-transparent hover:border-outline-variant ${statusColor}`}>
                                        <div className="flex items-center gap-4 flex-1 pr-4">
                                            <button onClick={(e) => { e.stopPropagation(); toggle(t.id, t.status); }} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${done ? 'bg-primary border-primary text-white' : 'border-outline text-transparent hover:border-primary hover:text-primary'}`}>
                                                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    {t.course_info && <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-label-caps text-label-caps whitespace-nowrap">{t.course_info}</span>}
                                                    {t.course_info && <div className={`w-2 h-2 rounded-full ${overdue ? 'bg-error' : 'bg-secondary-container'}`}></div>}
                                                    <h4 className={`font-button-text text-button-text truncate ${done ? 'text-outline line-through' : 'text-on-surface'}`}>{t.title}</h4>
                                                </div>
                                                <div className={`flex items-center gap-4 font-body-sm text-body-sm ${overdue ? 'text-error font-medium' : 'text-on-surface-variant'}`}>
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                        <span>{new Date(t.due_date).toLocaleDateString()}</span>
                                                    </div>
                                                    {!t.is_personal && (
                                                        <div className="flex items-center gap-1 text-tertiary">
                                                            <span className="material-symbols-outlined text-[16px]">campaign</span>
                                                            <span>Broadcast</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps whitespace-nowrap ${badgeColor}`}>{label}</span>
                                            <button onClick={(e) => { e.stopPropagation(); del(t.id); }} className="text-outline hover:text-error transition-colors p-1 md:hidden group-hover:block">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar Widgets */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Weekly Progress Ring */}
                    <div className="bg-surface-container-lowest rounded-xl shadow-[rgba(0,0,0,0.06)_0px_4px_16px] p-6">
                        <h3 className="font-h3 text-h3 text-on-surface mb-6">Task Progress</h3>
                        <div className="flex items-center justify-center relative w-48 h-48 mx-auto mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                                <circle className="text-primary transition-all duration-1000" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={dashOffset} strokeLinecap="round" strokeWidth="8"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-h2 text-h2 text-on-surface">{completionPct}%</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <form onSubmit={handleCreate} noValidate className="bg-surface-container-lowest w-full max-w-lg rounded-[24px] p-8 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-h2 text-h2">New Task</h2>
                            <button type="button" onClick={() => { setShowForm(false); setErrors({}); }} className="text-outline hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="space-y-1">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Task Title</label>
                                <input value={nt.title} onChange={e => { setNt({ ...nt, title: e.target.value }); setErrors(p => ({ ...p, title: '' })); }} className={`w-full pl-4 pr-4 py-3 bg-surface border rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${errors.title ? 'border-error focus:border-error focus:ring-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'}`} placeholder="Read Chapter 4" />
                                {errors.title && <p className="text-error text-xs">{errors.title}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Course</label>
                                    <input value={nt.course_info} onChange={e => setNt({ ...nt, course_info: e.target.value })} className="w-full pl-4 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-primary outline-none" placeholder="CS-101" />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Priority</label>
                                    <select value={nt.priority} onChange={e => setNt({ ...nt, priority: e.target.value })} className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-body-md outline-none focus:border-primary">
                                        <option value="Low">Low</option>
                                        <option selected value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Due Date</label>
                                <input type="datetime-local" value={nt.due_date} onChange={e => { setNt({ ...nt, due_date: e.target.value }); setErrors(p => ({ ...p, due_date: '' })); }} className={`w-full pl-4 pr-4 py-3 bg-surface border rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${errors.due_date ? 'border-error focus:border-error focus:ring-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'}`} />
                                {errors.due_date && <p className="text-error text-xs">{errors.due_date}</p>}
                            </div>
                        </div>
                        <button type="submit" className="w-full py-4 rounded-[50px] bg-gradient-to-r from-primary to-primary-container text-on-primary font-button-text text-button-text flex justify-center items-center shadow-md hover:-translate-y-0.5 transition-all">
                            Save Task
                        </button>
                    </form>
                </div>
            )}

            {/* Edit Task Modal */}
            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={() => {
                        setEditingTask(null);
                        fetchTasks();
                    }}
                />
            )}
        </div>
    );
};

export default TaskBoard;
