import React, { useState } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const EditTaskModal = ({ task, onClose, onSave }) => {
    const { showNotification } = useNotification();
    const formatDt = (dt) => {
        if (!dt) return '';
        const d = new Date(dt);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const [form, setForm] = useState({
        title: task.title || '',
        description: task.description || '',
        course_info: task.course_info || '',
        due_date: formatDt(task.due_date),
        priority: task.priority || 'Medium',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const isBroadcast = !task.is_personal;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBroadcast) return;
        const errs = {};
        if (!form.title.trim()) errs.title = 'A task title is required.';
        if (!form.due_date) errs.due_date = 'Please set a due date.';

        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/tasks/${task.id}`, form);
            showNotification('Task updated.', 'success');
            onSave();
        } catch (error) {
            console.error('Update failed:', error);
            showNotification('Failed to update task.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm shadow-2xl">
            <div className="bg-surface-container-lowest w-full max-w-lg rounded-[24px] p-6 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="font-h2 text-h2 text-on-surface">{isBroadcast ? 'Assignment Details' : 'Edit Task'}</h2>
                        <p className="font-body-sm text-on-surface-variant">
                            {isBroadcast ? 'This assignment was broadcasted by your teacher.' : 'Update your task details and deadlines.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                    <div className="space-y-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Task Title</label>
                        <input value={form.title} readOnly={isBroadcast} onChange={e => { setForm({ ...form, title: e.target.value }); setErrors(p => ({ ...p, title: '' })); }}
                            className={`w-full px-4 py-2 bg-surface border rounded-lg font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${isBroadcast ? 'bg-surface-container-low cursor-not-allowed opacity-80' : ''} ${errors.title ? 'border-error focus:border-error focus:ring-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'}`} />
                        {errors.title && <p className="text-error text-xs">{errors.title}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Description / Notes</label>
                        <textarea rows="3" value={form.description} readOnly={isBroadcast} onChange={e => setForm({ ...form, description: e.target.value })}
                            className={`w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary outline-none ${isBroadcast ? 'bg-surface-container-low cursor-not-allowed opacity-80' : ''}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Course</label>
                            <input value={form.course_info} readOnly={isBroadcast} onChange={e => setForm({ ...form, course_info: e.target.value })}
                                className={`w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary outline-none ${isBroadcast ? 'bg-surface-container-low cursor-not-allowed opacity-80' : ''}`} />
                        </div>
                        <div className="space-y-1">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Priority</label>
                            <select value={form.priority} disabled={isBroadcast} onChange={e => setForm({ ...form, priority: e.target.value })}
                                className={`w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary outline-none ${isBroadcast ? 'bg-surface-container-low cursor-not-allowed opacity-80 appearance-none' : ''}`}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Due Date</label>
                        <input type="datetime-local" value={form.due_date} readOnly={isBroadcast} onChange={e => { setForm({ ...form, due_date: e.target.value }); setErrors(p => ({ ...p, due_date: '' })); }}
                            className={`w-full px-4 py-2 bg-surface border rounded-lg font-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors ${isBroadcast ? 'bg-surface-container-low cursor-not-allowed opacity-80' : ''} ${errors.due_date ? 'border-error focus:border-error focus:ring-error ring-1 ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'}`} />
                        {errors.due_date && <p className="text-error text-xs">{errors.due_date}</p>}
                    </div>

                    <div className="pt-4 border-t border-outline-variant mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-full font-button-text text-on-surface-variant border border-outline-variant hover:bg-surface-container-low transition-colors">
                            {isBroadcast ? 'Close' : 'Cancel'}
                        </button>
                        {!isBroadcast && (
                            <button type="submit" disabled={loading} className="px-6 py-2 rounded-full bg-primary text-on-primary font-button-text hover:opacity-90 transition-opacity">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
