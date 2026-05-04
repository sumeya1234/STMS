import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import EditAssignmentModal from './EditAssignmentModal';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingAssignment, setEditingAssignment] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await api.get('/analytics/teacher');
            // Transform backend array into the expected format
            const data = res.data.analytics || [];
            let totalCompleted = 0;
            let totalAccepted = 0;
            let overdueCount = 0; // We don't have this in raw query easily, default to 0 or calculate if dates existed

            const breakdown = data.map(d => {
                const comp = parseInt(d.completed) || 0;
                const tot = parseInt(d.total_accepted) || 0;
                totalCompleted += comp;
                totalAccepted += tot;
                return {
                    id: d.assignment_id,
                    title: d.title,
                    course_name: d.course_name || `Broadcast assignment`,
                    target_year: d.target_year,
                    target_department: d.target_department,
                    completed: comp,
                    adopted: tot
                };
            });

            const rate = totalAccepted === 0 ? 0 : (totalCompleted / totalAccepted) * 100;

            setStats({
                global_completion_rate: rate,
                total_broadcasts: data.length,
                overdue_tasks: 0, // Placeholder
                breakdown
            });
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <div className="text-on-surface-variant text-center py-16">Crunching the numbers…</div>;
    if (!stats) return <div className="text-error text-center py-16">Failed to load analytics.</div>;

    const rate = Math.round(stats.global_completion_rate);
    const dashOffset = 251.2 - (251.2 * rate) / 100;

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-h2 text-h2 text-on-surface mb-2">Cohort Performance</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Global statistics across all your broadcasted assignments.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
                {/* Global Completion Ring */}
                <div className="xl:col-span-4 bg-surface-container-lowest p-6 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] flex flex-col items-center justify-center">
                    <h3 className="font-h3 text-h3 text-on-surface mb-2 w-full text-left">Global Completion</h3>
                    <div className="flex items-center justify-center relative w-32 h-32 mb-2">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                            <circle className="text-primary transition-all duration-1000" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={dashOffset} strokeLinecap="round" strokeWidth="8"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-h1 text-h1 text-on-surface leading-none">{rate}%</span>
                        </div>
                    </div>
                    <p className="font-body-sm text-center text-on-surface-variant">Overall success rate across {stats.total_broadcasts} active broadcasts.</p>
                </div>

                {/* Quick Stats Bento */}
                <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] relative overflow-hidden flex items-center justify-between">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary-container"></div>
                        <div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">Total Broadcasts</p>
                            <p className="font-h1 text-h1 text-on-surface m-0 leading-none">{stats.total_broadcasts}</p>
                        </div>
                        <div className="p-4 bg-surface-container-low rounded-2xl text-secondary-container">
                            <span className="material-symbols-outlined text-[32px]">campaign</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] relative overflow-hidden flex items-center justify-between">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-error"></div>
                        <div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mb-1 uppercase tracking-wider">High Risk</p>
                            <p className="font-h1 text-h1 text-on-surface m-0 leading-none">{stats.overdue_tasks}</p>
                        </div>
                        <div className="p-4 bg-surface-container-low rounded-2xl text-error">
                            <span className="material-symbols-outlined text-[32px]">warning</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[24px] shadow-[rgba(0,0,0,0.06)_0px_4px_16px] p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-h3 text-h3 text-on-surface">Assignment Breakdown</h3>
                    <button className="px-4 py-2 font-button-text text-button-text border border-outline-variant hover:bg-surface-container-low transition-colors rounded-full text-on-surface-variant">Export CSV</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-surface-container-highest">
                                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Assignment</th>
                                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Target</th>
                                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Progress</th>
                                <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high">
                            {stats.breakdown.map((b, idx) => {
                                const rate = b.adopted === 0 ? 0 : Math.round((b.completed / b.adopted) * 100);
                                let colorClass = 'bg-error';
                                if (rate >= 80) colorClass = 'bg-primary';
                                else if (rate >= 40) colorClass = 'bg-secondary-container';

                                return (
                                    <tr key={idx}
                                        onClick={() => setEditingAssignment(b)}
                                        className="hover:bg-surface-container-low transition-colors cursor-pointer group">
                                        <td className="py-3 px-4 text-primary group-hover:text-primary-fixed">
                                            <p className="font-button-text mb-1 flex items-center gap-2">
                                                {b.title} <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
                                            </p>
                                            <p className="font-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{b.course_name}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="bg-surface border border-outline-variant px-3 py-1 rounded-full text-body-sm font-medium">
                                                Year {b.target_year} {b.target_department}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 min-w-[200px]">
                                            <div className="flex justify-between mb-1 font-body-sm">
                                                <span className="text-on-surface font-medium">{rate}%</span>
                                                <span className="text-on-surface-variant text-caption">{b.completed} / {b.adopted} students</span>
                                            </div>
                                            <div className="w-full bg-surface-container-highest rounded-full h-2">
                                                <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${rate}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps uppercase ${rate >= 80 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                                                    {rate >= 80 ? 'On Track' : 'Needs Review'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {stats.breakdown.length === 0 && (
                                <tr><td colSpan="4" className="py-8 text-center text-on-surface-variant">No assignments broadcasted yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingAssignment && (
                <EditAssignmentModal
                    assignment={editingAssignment}
                    onClose={() => setEditingAssignment(null)}
                    onSave={() => {
                        setEditingAssignment(null);
                        fetchStats();
                    }}
                />
            )}
        </div>
    );
};

export default Analytics;
