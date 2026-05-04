import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import SubmitWorkModal from './SubmitWorkModal';

const AssignmentInbox = () => {
    const { showNotification } = useNotification();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingAssignment, setSubmittingAssignment] = useState(null);

    useEffect(() => { fetchAssignments(); }, []);

    const fetchAssignments = async () => {
        try {
            const r = await api.get('/assignments/inbox');
            setAssignments(r.data.inbox || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (a) => {
        try {
            await api.post('/tasks', {
                assignment_id: a.id,
                priority: 'High',
                is_personal: false
            });
            showNotification('Added to your task board!', 'success');
            fetchAssignments();
        } catch (e) {
            showNotification(e.response?.data?.message || 'Error adding task', 'error');
        }
    };

    if (loading) return <div className="text-on-surface-variant text-center py-16">Checking for new assignments…</div>;

    return (
        <div>
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="font-h2 text-h2 text-on-surface mb-2">Assignment Inbox</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Review and accept broadcasts from your professors.</p>
                </div>
            </div>

            <div className="space-y-6 max-w-4xl">
                {assignments.length === 0 ? (
                    <div className="bg-surface-container-lowest p-8 border border-outline-variant border-dashed rounded-xl text-center">
                        <span className="material-symbols-outlined text-4xl text-tertiary-container mb-2">inbox</span>
                        <h3 className="font-h3 text-on-surface text-h3">You're all caught up!</h3>
                        <p className="text-on-surface-variant font-body-sm mt-2 mb-0">No pending assignments broadcasted to your cohort.</p>
                    </div>
                ) : assignments.map(a => (
                    <div key={a.id} className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] transition-all hover:shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-container"></div>
                        <div className="flex flex-col md:flex-row justify-between gap-6 pl-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-label-caps text-label-caps bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full uppercase tracking-wider">{a.course_name || 'Broadcast'}</span>
                                    <span className="font-body-sm text-on-surface-variant flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">school</span>
                                        By Prof. {a.Teacher?.full_name}
                                    </span>
                                </div>
                                <h3 className="font-h3 text-h3 text-on-surface mb-3">{a.title}</h3>
                                <p className="font-body-md text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">{a.description}</p>

                                <div className="flex flex-wrap gap-4 text-on-surface-variant font-body-sm bg-surface p-4 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-error">event</span>
                                        <span className="font-medium text-error">Due: {new Date(a.due_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="w-px h-5 bg-outline-variant hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] text-tertiary">group</span>
                                        <span>Target: Year {a.target_year} {a.target_department}</span>
                                    </div>
                                    {a.attachment_url && (
                                        <>
                                            <div className="w-px h-5 bg-outline-variant hidden sm:block"></div>
                                            <a href={`http://localhost:5000${a.attachment_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                                <span className="material-symbols-outlined text-[18px]">attachment</span>
                                                <span className="font-medium">View File</span>
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col justify-end gap-3 shrink-0 sm:w-48">
                                <button onClick={() => setSubmittingAssignment(a)} className="w-full h-[48px] bg-secondary-container text-on-secondary-container font-button-text rounded-[50px] shadow-sm hover:shadow-md hover:scale-[1.02] transform transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">upload_file</span>
                                    Submit Work
                                </button>
                                <button onClick={() => handleAccept(a)} className="w-full h-[48px] bg-gradient-to-r from-primary to-primary-container text-on-primary font-button-text rounded-[50px] shadow-sm hover:shadow-md hover:scale-[1.02] transform transition-all flex items-center justify-center gap-2 group-hover:bg-primary">
                                    <span className="material-symbols-outlined text-[20px]">add_task</span>
                                    Accept Task
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {submittingAssignment && (
                <SubmitWorkModal
                    assignment={submittingAssignment}
                    onClose={() => setSubmittingAssignment(null)}
                    onSave={() => {
                        setSubmittingAssignment(null);
                        fetchAssignments();
                    }}
                />
            )}
        </div>
    );
};

export default AssignmentInbox;
