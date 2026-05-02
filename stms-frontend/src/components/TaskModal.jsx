import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { X } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
    const queryClient = useQueryClient();
    const { addToast } = useToastStore();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (taskToEdit) {
            const dateStr = new Date(taskToEdit.deadline).toISOString().slice(0, 16);
            reset({
                ...taskToEdit,
                deadline: dateStr
            });
        } else {
            reset({
                title: '',
                description: '',
                subject: '',
                deadline: '',
                priority: 'medium',
                category_id: ''
            });
        }
    }, [taskToEdit, isOpen, reset]);

    const validate = (data) => {
        const title = data.title || '';
        const subject = data.subject || '';
        const description = data.description || '';
        const deadline = data.deadline || '';

        if (title.length < 3 || title.length > 50) {
            addToast('Title must be between 3 and 50 characters.', 'error');
            return false;
        }
        if (subject.length < 2 || subject.length > 30) {
            addToast('Subject must be between 2 and 30 characters.', 'error');
            return false;
        }
        if (description.length > 500) {
            addToast('Description cannot exceed 500 characters.', 'error');
            return false;
        }
        if (!deadline) {
            addToast('Please select a deadline.', 'error');
            return false;
        }
        return true;
    };

    const mutation = useMutation({
        mutationFn: async (data) => {
            const dateObj = new Date(data.deadline);
            const year = dateObj.getFullYear();

            if (year < 2024 || year > 2100) {
                throw new Error('Deadline must be between 2024 and 2100');
            }

            const payload = {
                ...data,
                priority: data.priority || 'medium',
                deadline: dateObj.toISOString(),
                category_id: data.category_id === '' ? null : data.category_id
            };

            if (taskToEdit) {
                await api.put(`/tasks/${taskToEdit.id}`, payload);
            } else {
                await api.post('/tasks', payload);
            }
        },
        onSuccess: () => {
            addToast(`Task ${taskToEdit ? 'updated' : 'created'} successfully!`, 'success');
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['dashStats']);
            queryClient.invalidateQueries(['dashUpcoming']);
            onClose();
        },
        onError: (err) => {
            addToast(err.response?.data?.message || 'Failed to save task', 'error');
        }
    });

    const onSubmit = (data) => {
        if (!validate(data)) return;
        mutation.mutate(data);
    };

    const { data: categories, isLoading: isLoadingCats, isError: isErrorCats } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data.data || [];
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    const onFormError = (errs) => {
        console.warn('Form validation errors:', errs);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">

                {/* Backdrop */}
                <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal Content */}
                <div className="relative inline-block align-middle bg-card-bg border border-border rounded-feature px-5 pt-5 pb-6 text-left overflow-hidden shadow-premium transform transition-all sm:my-8 sm:max-w-md sm:w-full sm:p-6 animate-in zoom-in-95 duration-200" role="dialog" aria-modal="true">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button type="button" onClick={onClose} aria-label="Close task modal" className="rounded-full p-1.5 text-surface-on-variant/40 hover:text-surface-on hover:bg-surface transition-all">
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="w-full">
                        <div className="mb-4">
                            <h3 className="text-lg font-black text-surface-on tracking-tight leading-tight">
                                {taskToEdit ? 'Update Task' : 'New Task'}
                            </h3>
                            <p className="text-[10px] text-surface-on-variant font-bold uppercase tracking-widest mt-0.5 opacity-60">Plan your next milestone</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-3.5">
                            <div>
                                <label className="block text-[10px] font-black text-surface-on-variant uppercase tracking-widest mb-1 ml-0.5">Task Title</label>
                                <input
                                    type="text"
                                    id="task-title"
                                    aria-label="Task Title"
                                    {...register('title', { required: true })}
                                    className="block w-full bg-surface dark:bg-slate-800/50 border border-border rounded-card py-2 px-3.5 text-sm text-surface-on focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder-surface-on-variant/30"
                                    placeholder="e.g. Design Research"
                                />
                                {errors.title && <span className="text-red-500 text-[10px] font-bold mt-1 block">Title is required</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-black text-surface-on-variant uppercase tracking-widest mb-1 ml-0.5">Category</label>
                                    <select
                                        id="task-category"
                                        aria-label="Category"
                                        {...register('category_id')}
                                        className="block w-full bg-surface dark:bg-slate-800/50 border border-border rounded-card py-2 px-3 text-sm text-surface-on focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                                        disabled={isLoadingCats}
                                    >
                                        <option value="">{isLoadingCats ? 'Loading...' : (isErrorCats ? 'Error loading' : 'Select...')}</option>
                                        {categories?.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-surface-on-variant uppercase tracking-widest mb-1 ml-0.5">Priority</label>
                                    <select
                                        id="task-priority"
                                        aria-label="Priority"
                                        {...register('priority')}
                                        className="block w-full bg-surface dark:bg-slate-800/50 border border-border rounded-card py-2 px-3 text-sm text-surface-on focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-surface-on-variant uppercase tracking-widest mb-1 ml-0.5">Subject</label>
                                    <input
                                        type="text"
                                        id="task-subject"
                                        aria-label="Subject"
                                        {...register('subject', { required: true })}
                                        className="block w-full bg-surface dark:bg-slate-800/50 border border-border rounded-card py-2 px-3.5 text-sm text-surface-on focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                        placeholder="e.g. CS101"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-surface-on-variant uppercase tracking-widest mb-1 ml-0.5">Deadline</label>
                                    <input
                                        type="datetime-local"
                                        id="task-deadline"
                                        aria-label="Deadline"
                                        {...register('deadline', { required: true })}
                                        min="2024-01-01T00:00"
                                        max="2100-12-31T23:59"
                                        className="block w-full bg-surface dark:bg-slate-800/50 border border-border rounded-card py-2 px-3.5 text-sm text-surface-on focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-surface-on-variant uppercase tracking-widest mb-1 ml-0.5">Additional Notes</label>
                                <textarea
                                    id="task-notes"
                                    aria-label="Additional Notes"
                                    {...register('description')}
                                    rows={2}
                                    className="block w-full bg-surface dark:bg-slate-800/50 border border-border rounded-card py-2 px-3.5 text-sm text-surface-on focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                                    placeholder="Optional details..."
                                />
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row-reverse gap-2">
                                <button
                                    type="submit"
                                    disabled={mutation.isLoading}
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-button shadow-lg shadow-primary/20 hover:bg-primary-tint active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {mutation.isLoading ? '...' : (taskToEdit ? 'Save Changes' : 'Create Task')}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-surface dark:bg-slate-900 border border-border text-surface-on-variant text-sm font-bold rounded-button hover:bg-surface-bright dark:hover:bg-slate-800 active:scale-95 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
