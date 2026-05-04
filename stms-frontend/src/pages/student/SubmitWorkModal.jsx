import React, { useState } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const SubmitWorkModal = ({ assignment, onClose, onSave }) => {
    const { showNotification } = useNotification();
    const [file, setFile] = useState(null);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            showNotification('Please select a file to upload.', 'info');
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('assignment_id', assignment.id || assignment.assignment_id);
            fd.append('file', file);
            fd.append('note', note);

            await api.post('/submissions', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showNotification('Work submitted successfully!', 'success');
            onSave();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Submission failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-[24px] shadow-2xl w-full max-w-[600px] flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">

                {/* Modal Header */}
                <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-surface-variant">
                    <h2 className="font-h3 text-h3 text-on-surface">Submit Your Work 📤</h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full p-2 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-8 py-6 overflow-y-auto flex-1 space-y-6">

                    {/* Context Card */}
                    <div className="bg-surface-container rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-primary-container text-on-primary-container rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined fill-icon">assignment</span>
                        </div>
                        <div>
                            <h4 className="font-button-text text-button-text text-on-surface mb-0.5">{assignment.title}</h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">{assignment.course_name || assignment.course_info}</p>
                            <div className="flex items-center gap-2 text-primary font-label-caps text-label-caps">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                Due {new Date(assignment.due_date).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Resubmission Notice (Conditional - simplified for now) */}
                    <div className="bg-secondary-fixed text-on-secondary-fixed-variant rounded-xl p-4 flex items-start gap-3 border-l-4 border-secondary-container">
                        <span className="material-symbols-outlined shrink-0 text-secondary-container fill-icon">warning</span>
                        <div>
                            <p className="font-body-sm text-body-sm font-semibold mb-0.5">Resubmission Notice</p>
                            <p className="font-body-sm text-body-sm opacity-90">Submitting a new file will overwrite any previous work for this assignment.</p>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <label
                            htmlFor="file-upload"
                            className="border-2 border-dashed border-primary-fixed-dim bg-surface rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors group"
                        >
                            <div className="bg-primary-container/20 text-primary rounded-full p-4 mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                            </div>
                            <p className="font-button-text text-button-text text-on-surface mb-2">
                                {file ? file.name : 'Click or drag file to this area to upload'}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[300px]">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Support for PDF, ZIP, and other document formats.'}
                            </p>
                        </label>
                    </div>

                    {/* Optional Note */}
                    <div className="space-y-2">
                        <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase">Add a note (Optional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-surface border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:border-primary outline-none transition-colors resize-none h-24 placeholder:text-outline"
                            placeholder="Type your message to the instructor here..."
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-4 border-t border-surface-variant flex justify-end gap-4 bg-surface-container-lowest">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-full font-button-text text-primary bg-surface-container hover:bg-surface-container-high transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 rounded-full font-button-text text-on-primary bg-gradient-to-r from-primary to-tertiary shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        {loading ? 'Submitting...' : 'Submit Work'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitWorkModal;
