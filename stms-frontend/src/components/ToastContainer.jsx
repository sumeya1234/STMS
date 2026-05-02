import React from 'react';
import { useToastStore } from '../store/toastStore';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-6 right-6 z-[120] flex flex-col space-y-4">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="flex items-center p-4 rounded-feature shadow-premium min-w-[320px] max-w-md transform transition-all duration-300 animate-slide-in-right bg-card-bg/80 backdrop-blur-md border border-border/50 group"
                >
                    <div className="flex-shrink-0 mr-4">
                        {toast.type === 'success' && (
                            <div className="h-10 w-10 bg-emerald-500/10 rounded-feature flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                        )}
                        {toast.type === 'error' && (
                            <div className="h-10 w-10 bg-red-500/10 rounded-feature flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                        )}
                        {toast.type === 'info' && (
                            <div className="h-10 w-10 bg-primary/10 rounded-feature flex items-center justify-center">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 mr-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-surface-on-variant mb-0.5 opacity-60">
                            {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Critical' : 'Information'}
                        </div>
                        <div className="text-sm font-bold text-surface-on leading-snug">
                            {toast.message}
                        </div>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 text-surface-on-variant/40 hover:text-surface-on hover:bg-surface rounded-full p-2 transition-all active:scale-90"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Simple duration indicator */}
                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-0 group-hover:w-full transition-all duration-1000" />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
