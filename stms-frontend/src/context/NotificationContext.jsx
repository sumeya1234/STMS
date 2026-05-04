import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {/* Notification Portal / Overlay */}
            <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`pointer-events-auto px-6 py-4 rounded-[16px] shadow-2xl animate-fade-in-right flex items-center gap-3 min-w-[300px] border border-white/20 backdrop-blur-md
                            ${n.type === 'error' ? 'bg-error text-on-error' :
                                n.type === 'success' ? 'bg-primary text-on-primary' :
                                    'bg-surface-container-highest text-on-surface'}`}
                    >
                        <span className="material-symbols-outlined">
                            {n.type === 'error' ? 'error' : n.type === 'success' ? 'check_circle' : 'info'}
                        </span>
                        <span className="font-button-text text-button-text flex-1">{n.message}</span>
                        <button onClick={() => setNotifications(prev => prev.filter(nx => nx.id !== n.id))} className="opacity-70 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
