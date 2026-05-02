import React, { useEffect } from 'react';
import { X, AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // danger, info, success, warning
}) => {

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger': return <ShieldAlert className="h-8 w-8 text-red-500" />;
            case 'warning': return <AlertTriangle className="h-8 w-8 text-amber-500" />;
            case 'success': return <CheckCircle2 className="h-8 w-8 text-emerald-500" />;
            default: return <Info className="h-8 w-8 text-primary" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'danger': return { bg: 'bg-red-500/10', border: 'border-red-500/20', btn: 'bg-red-500 hover:bg-red-600 shadow-red-500/20' };
            case 'warning': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' };
            case 'success': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', btn: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' };
            default: return { bg: 'bg-primary/10', border: 'border-primary/20', btn: 'bg-primary hover:bg-primary-tint shadow-primary/20' };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">

                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                    aria-hidden="true"
                    onClick={onClose}
                />

                {/* Modal box */}
                <div
                    className="relative inline-block align-middle bg-card-bg border border-border rounded-feature px-6 pt-8 pb-8 text-left overflow-hidden shadow-premium transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                    role="alertdialog"
                    aria-modal="true"
                >
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button type="button" onClick={onClose} className="rounded-full p-2 text-surface-on-variant hover:bg-surface transition-all active:scale-90">
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="text-center">
                        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-feature ${colors.bg} ${colors.border} border mb-6`}>
                            {getIcon()}
                        </div>

                        <h3 className="text-2xl font-black text-surface-on tracking-tighter mb-3 leading-tight">{title}</h3>
                        <p className="text-sm font-medium text-surface-on-variant leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row-reverse gap-3">
                        <button
                            type="button"
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`w-full inline-flex justify-center items-center py-3.5 px-6 border border-transparent rounded-button shadow-xl text-sm font-bold text-white ${colors.btn} transition-all transform active:scale-95 focus:outline-none`}
                        >
                            {confirmText}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center items-center py-3.5 px-6 border border-border rounded-button bg-surface text-surface-on-variant text-sm font-bold hover:bg-surface-bright transition-all active:scale-95 focus:outline-none"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
