import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const MySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    const fetchSubmissions = async () => {
        try {
            const res = await api.get('/submissions/my');
            setSubmissions(res.data.submissions || []);
        } catch (error) {
            showNotification('Failed to load submissions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    if (loading) return <div className="text-on-surface-variant text-center py-16">Loading your work…</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="font-h1 text-h1 text-on-surface mb-2">My Submissions</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Track the status and feedback of your submitted assignments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface border border-dashed border-outline-variant rounded-[24px]">
                        You haven't submitted any work yet.
                    </div>
                ) : submissions.map(s => (
                    <div key={s.id} className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] border border-transparent hover:border-outline-variant transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-caps text-label-caps">
                                {s.course_name}
                            </span>
                            <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps ${s.status === 'Graded' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                                {s.status}
                            </span>
                        </div>

                        <h3 className="font-h3 text-h3 text-on-surface mb-2 truncate">{s.assignment_title}</h3>
                        <p className="font-body-sm text-on-surface-variant mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            Submitted: {new Date(s.submitted_at).toLocaleDateString()}
                        </p>

                        <div className="space-y-4">
                            {s.grade !== null && (
                                <div className="bg-surface p-4 rounded-xl border border-primary/20">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-label-caps text-on-surface-variant">Grade</span>
                                        <span className="text-h3 font-h3 text-primary">{s.grade}%</span>
                                    </div>
                                    {s.feedback && (
                                        <p className="text-body-sm text-on-surface italic mt-2 border-t border-outline-variant/30 pt-2">
                                            "{s.feedback}"
                                        </p>
                                    )}
                                </div>
                            )}
                            <a href={`http://localhost:5000/${s.file_path}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-surface-variant text-on-surface-variant font-button-text hover:bg-outline-variant/20 transition-all">
                                <span className="material-symbols-outlined text-[20px]">description</span>
                                View My Submission
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySubmissions;
