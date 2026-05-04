import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const EditAssignmentModal = ({ assignment, onClose, onSave }) => {
    const { showNotification } = useNotification();
    const formatDt = (dt) => {
        if (!dt) return '';
        const d = new Date(dt);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const [form, setForm] = useState({
        title: assignment.title || '',
        description: assignment.description || '',
        course_name: assignment.course_name || '',
        marks: assignment.marks || '',
        due_date: formatDt(assignment.due_date),
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch(`/assignments/${assignment.id || assignment.assignment_id}`, {
                title: form.title,
                description: form.description,
                marks: form.marks,
                due_date: form.due_date,
            });
            showNotification('Broadcast updated successfully.', 'success');
            onSave();
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update assignment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm shadow-2xl">
            <div className="bg-surface-container-lowest w-full max-w-lg rounded-[24px] p-8 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="font-h2 text-h2 text-on-surface">Edit Broadcast</h2>
                        <p className="font-body-sm text-on-surface-variant">Update the assignment details for the entire cohort.</p>
                    </div>
                    <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Assignment Title</label>
                        <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary outline-none" />
                    </div>

                    <div className="space-y-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Description</label>
                        <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Max Marks</label>
                            <input type="number" required value={form.marks} onChange={e => setForm({ ...form, marks: e.target.value })}
                                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Due Date</label>
                            <input type="datetime-local" required value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })}
                                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary outline-none" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-full font-button-text text-on-surface-variant border border-outline-variant hover:bg-surface-container-low transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 rounded-full bg-primary text-on-primary font-button-text hover:opacity-90 transition-opacity">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAssignmentModal;
