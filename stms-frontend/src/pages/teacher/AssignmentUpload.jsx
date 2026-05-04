import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const AssignmentUpload = () => {
    const location = useLocation();
    const { showNotification } = useNotification();
    const preset = location.state?.presetCourse || {};

    const [f, setF] = useState({
        title: '',
        description: '',
        due_date: '',
        target_department: preset.target_department || '',
        target_year: preset.target_year || '',
        course_name: preset.course_name || '',
        course_code: preset.course_code || '',
        marks: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData();
        Object.keys(f).forEach(k => fd.append(k, f[k]));
        if (file) fd.append('file', file);

        try {
            await api.post('/assignments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            showNotification('Assignment broadcasted successfully!', 'success');
            setF({ title: '', description: '', due_date: '', target_department: preset.target_department || '', target_year: preset.target_year || '', course_name: preset.course_name || '', course_code: preset.course_code || '', marks: '' }); setFile(null);
        } catch (err) {
            showNotification(err.response?.data?.message || 'Error occurred during broadcast', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="font-h2 text-h2 text-on-surface mb-2">Broadcast Assignment</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Distribute new tasks to your active student cohorts.</p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px]">
                <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Assignment Title</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">title</span>
                                <input required value={f.title} onChange={e => setF({ ...f, title: e.target.value })} className="w-full pl-12 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="e.g. Final Project Guidelines" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Course Name & Code</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">school</span>
                                    <input required value={f.course_name} onChange={e => setF({ ...f, course_name: e.target.value })} className="w-full pl-12 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="e.g. Data Structures" />
                                </div>
                                <div className="relative w-32">
                                    <input required value={f.course_code} onChange={e => setF({ ...f, course_code: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="CS-201" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Due Date & Marks</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">calendar_today</span>
                                    <input type="datetime-local" required value={f.due_date} onChange={e => setF({ ...f, due_date: e.target.value })} className="w-full pl-12 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                                </div>
                                <div className="relative w-24">
                                    <input type="number" min="1" max="100" required value={f.marks} onChange={e => setF({ ...f, marks: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Instructions</label>
                        <textarea required value={f.description} onChange={e => setF({ ...f, description: e.target.value })} rows="3" className="w-full p-4 bg-surface border border-outline-variant rounded-xl text-body-md focus:border-primary outline-none transition-colors resize-none" placeholder="Provide detailed instructions for the students..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest">
                        <div className="space-y-2">
                            <label className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Target Department</label>
                            <input required value={f.target_department} onChange={e => setF({ ...f, target_department: e.target.value })} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md outline-none focus:border-primary" placeholder="e.g. CS" />
                        </div>
                        <div className="space-y-2">
                            <label className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Target Year</label>
                            <select required value={f.target_year} onChange={e => setF({ ...f, target_year: e.target.value })} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md outline-none focus:border-primary">
                                <option value="">Select Year...</option>
                                {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Attachment (Optional)</label>
                        <div className="w-full relative border-2 border-dashed border-outline-variant hover:border-primary bg-surface transition-colors rounded-2xl p-6 text-center cursor-pointer group">
                            <input type="file" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-surface-container-highest group-hover:bg-primary-container flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[28px] text-outline group-hover:text-primary">cloud_upload</span>
                                </div>
                                <p className="font-body-md text-on-surface font-medium">{file ? file.name : 'Click or drag file to upload'}</p>
                                <p className="font-body-sm text-on-surface-variant">Supports PDF, DOCX, ZIP (Max 10MB)</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="submit" disabled={loading} className="px-8 h-[48px] rounded-[50px] bg-gradient-to-r from-primary to-primary-container text-on-primary font-button-text shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">send</span>
                            {loading ? 'Sending...' : 'Broadcast to Cohort'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignmentUpload;
