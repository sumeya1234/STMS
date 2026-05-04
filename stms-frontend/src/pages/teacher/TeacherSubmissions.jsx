import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const TeacherSubmissions = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradingSub, setGradingSub] = useState(null); // The one currently being graded
    const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });

    const fetchSubmissions = async () => {
        try {
            const res = await api.get(`/submissions/assignment/${assignmentId}`);
            setSubmissions(res.data.submissions || []);
        } catch (error) {
            showNotification('Failed to load submissions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [assignmentId]);

    const handleGrade = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/submissions/${gradingSub.id}/grade`, gradeForm);
            showNotification('Graded successfully!', 'success');
            setGradingSub(null);
            setGradeForm({ grade: '', feedback: '' });
            fetchSubmissions();
        } catch (error) {
            showNotification('Failed to save grade', 'error');
        }
    };

    if (loading) return <div className="text-on-surface-variant text-center py-16">Fetching submissions…</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="font-h1 text-h1 text-on-surface mb-1">Student Submissions</h1>
                    <p className="font-body-md text-on-surface-variant text-body-md m-0">Review and grade work for this assignment.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className={`${gradingSub ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
                    <div className="bg-surface-container-lowest rounded-[24px] shadow-sm border border-outline-variant/30 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low border-b border-outline-variant/30">
                                <tr>
                                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Student</th>
                                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Submitted At</th>
                                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Status</th>
                                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Grade</th>
                                    <th className="p-4 font-label-caps text-label-caps text-on-surface-variant text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {submissions.length === 0 ? (
                                    <tr><td colSpan="5" className="p-12 text-center text-on-surface-variant">No submissions received yet.</td></tr>
                                ) : submissions.map(sub => (
                                    <tr key={sub.id} className="hover:bg-surface transition-colors">
                                        <td className="p-4">
                                            <p className="font-button-text text-on-surface">{sub.student_name}</p>
                                            <p className="text-caption text-on-surface-variant">{sub.student_email}</p>
                                        </td>
                                        <td className="p-4 font-body-sm text-on-surface-variant">
                                            {new Date(sub.submitted_at).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.status === 'Graded' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-h3 text-h3 text-primary">
                                            {sub.grade !== null ? `${sub.grade}%` : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => { setGradingSub(sub); setGradeForm({ grade: sub.grade || '', feedback: sub.feedback || '' }); }} className="bg-primary text-on-primary px-4 py-2 rounded-full font-button-text text-sm hover:opacity-90 transition-opacity">
                                                {sub.status === 'Graded' ? 'Edit Grade' : 'Grade'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {gradingSub && (
                    <div className="lg:col-span-5 animate-fade-in-right">
                        <div className="bg-surface-container-lowest p-8 rounded-[32px] shadow-xl border border-primary/10 sticky top-[100px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-h3 text-h3 text-on-surface">Grading Workflow</h3>
                                <button onClick={() => setGradingSub(null)} className="text-outline hover:text-on-surface transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="bg-surface-container-low p-4 rounded-2xl mb-8 flex items-center gap-4">
                                <span className="material-symbols-outlined text-4xl text-primary">account_circle</span>
                                <div>
                                    <p className="font-button-text text-on-surface m-0">{gradingSub.student_name}</p>
                                    <a href={`http://localhost:5000/${gradingSub.file_path}`} target="_blank" rel="noreferrer" className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Download Work
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleGrade} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-label-caps text-on-surface-variant uppercase tracking-widest">Numerical Grade (%)</label>
                                    <input required type="number" max="100" min="0" value={gradeForm.grade} onChange={e => setGradeForm({ ...gradeForm, grade: e.target.value })}
                                        className="w-full px-4 py-4 bg-surface-container-high border border-outline-variant rounded-xl font-h2 text-h2 text-primary focus:border-primary outline-none text-center" placeholder="95" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-label-caps text-on-surface-variant uppercase tracking-widest">Feedback & Notes</label>
                                    <textarea rows="4" value={gradeForm.feedback} onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl font-body-md text-on-surface focus:border-primary outline-none" placeholder="Excellent depth in analysis..." />
                                </div>
                                <button type="submit" className="w-full py-4 rounded-full bg-primary text-on-primary font-button-text shadow-lg hover:-translate-y-0.5 transition-all">
                                    Confirm Grade
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherSubmissions;
