import React, { useRef, useState } from 'react';
import Layout from '../components/Layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const CalendarView = () => {
    const calendarRef = useRef(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['calendarData', month, year],
        queryFn: async () => {
            const res = await api.get(`/calendar?month=${month}&year=${year}`);
            return res.data.data;
        }
    });

    const handleDatesSet = (dateInfo) => {
        const midDate = new Date((dateInfo.start.getTime() + dateInfo.end.getTime()) / 2);
        setCurrentDate(midDate);
    };

    const getEventColor = (priority, status) => {
        if (status === 'completed') return '#9CA3AF'; // Gray for completed
        if (priority === 'high') return '#EF4444';
        if (priority === 'medium') return '#F59E0B';
        return '#10B981'; // low
    };

    const events = tasks?.map(task => ({
        id: task.id,
        title: task.title,
        start: task.deadline,
        backgroundColor: getEventColor(task.priority, task.status),
        borderColor: getEventColor(task.priority, task.status),
        textColor: '#ffffff',
        extendedProps: {
            description: task.description,
            status: task.status
        }
    })) || [];

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-surface-on tracking-tight">Calendar</h1>
                <p className="text-surface-on-variant mt-1">Visualize your academic schedule and deadlines.</p>
            </div>

            <div className="bg-card-bg shadow-ambient rounded-card border border-border p-4">
                <div className="fullcalendar-wrapper">
                    {isLoading && <div className="text-center py-10 text-surface-on-variant">Loading calendar data...</div>}
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        datesSet={handleDatesSet}
                        height="auto"
                        eventContent={(eventInfo) => {
                            return (
                                <div className="p-1 overflow-hidden" title={eventInfo.event.extendedProps.description}>
                                    <div className={`text-xs truncate font-bold tracking-tight ${eventInfo.event.extendedProps.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                        {eventInfo.timeText && <span className="mr-1 opacity-70">{eventInfo.timeText}</span>}
                                        {eventInfo.event.title}
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>

            <style>{`
                .fc-theme-standard td, .fc-theme-standard th {
                    border-color: var(--color-border);
                }
                .fc-col-header-cell {
                    background-color: var(--color-surface);
                    padding: 8px 0;
                }
                .fc-daygrid-day-number {
                    color: var(--color-surface-on);
                    font-weight: 700;
                    font-size: 0.75rem;
                    padding: 8px !important;
                }
                .fc .fc-button-primary {
                    background-color: var(--color-primary);
                    border-color: var(--color-primary);
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .fc .fc-button-primary:hover {
                    background-color: var(--color-primary-tint);
                    border-color: var(--color-primary-tint);
                }
                .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active {
                    background-color: var(--color-primary-tint);
                    border-color: var(--color-primary-tint);
                    transform: scale(0.95);
                }
                .fc-day-today {
                    background-color: var(--color-primary-fixed) !important;
                }
                .fc-event {
                    border-radius: 6px;
                    padding: 1px 2px;
                    font-weight: 700;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    font-weight: 800 !important;
                    color: var(--color-surface-on);
                    letter-spacing: -0.025em;
                }
            `}</style>
        </Layout>
    );
};

export default CalendarView;
