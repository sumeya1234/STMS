import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const TeacherCourses = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        course_name: '',
        course_code: '',
        target_department: '',
        target_year: ''
    });
    const [errors, setErrors] = useState({});

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.course_name.trim()) errs.course_name = 'Course name is required.';
        if (!form.course_code.trim()) errs.course_code = 'Course code is required.';
        if (!form.target_department.trim()) errs.target_department = 'Target department is required.';
        if (!form.target_year) errs.target_year = 'Target year is required.';

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        try {
            await api.post('/courses', form);
            showNotification('Course profile created successfully!', 'success');
            setForm({ course_name: '', course_code: '', target_department: '', target_year: '' });
            fetchCourses();
        } catch (error) {
            showNotification(error.response?.data?.message || 'Error creating course', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this course?')) return;
        try {
            await api.delete(`/courses/${id}`);
            showNotification('Course removed.', 'info');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const navigateToUpload = (course) => {
        navigate('/teacher/upload', { state: { presetCourse: course } });
    };

    if (loading) return <div className="text-on-surface-variant text-center py-16">Loading your courses…</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="font-h1 text-h1 text-on-surface mb-2">My Courses</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Manage the classes you teach to quickly broadcast assignments.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface border border-dashed border-outline-variant rounded-[24px]">
                                You haven't added any courses yet. Create one to streamline your assignments!
                            </div>
                        ) : courses.map(course => (
                            <div key={course.id} className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] relative group border border-transparent hover:border-outline-variant transition-all">
                                <button onClick={() => handleDelete(course.id)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-on-error">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>

                                <div className="mb-3">
                                    <h3 className="font-h3 text-h3 text-on-surface mb-1 truncate pr-10">{course.course_name}</h3>
                                    <div className="flex gap-2">
                                        <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded font-label-caps text-label-caps">{course.course_code}</span>
                                        <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded font-label-caps text-label-caps">Year {course.target_year}</span>
                                    </div>
                                </div>
                                <p className="font-body-sm text-on-surface-variant mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">school</span>
                                    {course.target_department} Students
                                </p>

                                <button onClick={() => navigateToUpload(course)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary-container text-on-primary-container font-button-text hover:opacity-90 transition-opacity">
                                    <span className="material-symbols-outlined text-[20px]">campaign</span>
                                    Broadcast Assignment
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-surface-container-lowest p-5 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] sticky top-[120px]">
                        <h3 className="font-h3 text-h3 text-on-surface mb-4">Add New Course</h3>
                        <form onSubmit={handleCreate} className="space-y-3">
                            <div className="space-y-1">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Course Name</label>
                                <input value={form.course_name} onChange={e => { setForm({ ...form, course_name: e.target.value }); setErrors(p => ({ ...p, course_name: '' })); }} className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none transition-colors ${errors.course_name ? 'border-error focus:border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'}`} placeholder="Database Systems" />
                                {errors.course_name && <p className="text-error text-xs mt-1">{errors.course_name}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Course Code</label>
                                <input value={form.course_code} onChange={e => { setForm({ ...form, course_code: e.target.value }); setErrors(p => ({ ...p, course_code: '' })); }} className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none transition-colors ${errors.course_code ? 'border-error focus:border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'}`} placeholder="CS-301" />
                                {errors.course_code && <p className="text-error text-xs mt-1">{errors.course_code}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Target Department</label>
                                <input value={form.target_department} onChange={e => { setForm({ ...form, target_department: e.target.value }); setErrors(p => ({ ...p, target_department: '' })); }} className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none transition-colors ${errors.target_department ? 'border-error focus:border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'}`} placeholder="Software Engineering" />
                                {errors.target_department && <p className="text-error text-xs mt-1">{errors.target_department}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Target Year</label>
                                <select value={form.target_year} onChange={e => { setForm({ ...form, target_year: e.target.value }); setErrors(p => ({ ...p, target_year: '' })); }} className={`w-full px-4 py-2.5 bg-surface border rounded-lg focus:outline-none transition-colors ${errors.target_year ? 'border-error focus:border-error ring-1 ring-error' : 'border-outline-variant focus:border-primary'}`}>
                                    <option value="" disabled>Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                    <option value="5">5th Year</option>
                                </select>
                                {errors.target_year && <p className="text-error text-xs mt-1">{errors.target_year}</p>}
                            </div>
                            <button type="submit" className="w-full py-2.5 rounded-[50px] bg-primary text-on-primary font-button-text hover:bg-surface-tint transition-colors mt-2">
                                Save Course Profile
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherCourses;
