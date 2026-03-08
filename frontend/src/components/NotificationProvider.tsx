"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Info, Users, MessageSquare } from 'lucide-react';

type NotificationType = 'success' | 'info' | 'warning' | 'lead' | 'feedback';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
}

interface NotificationContextProps {
    notify: (type: NotificationType, title: string, message: string) => void;
    notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextProps>({
    notify: () => { },
    notifications: [],
});

export const useNotifications = () => useContext(NotificationContext);

const ICON_MAP: Record<NotificationType, React.ReactNode> = {
    success: <CheckCircle2 size={16} className="text-emerald-400" />,
    info: <Info size={16} className="text-blue-400" />,
    warning: <AlertTriangle size={16} className="text-amber-400" />,
    lead: <Users size={16} className="text-cyan-400" />,
    feedback: <MessageSquare size={16} className="text-purple-400" />,
};

const COLOR_MAP: Record<NotificationType, string> = {
    success: 'border-emerald-500/30 bg-emerald-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
    warning: 'border-amber-500/30 bg-amber-500/10',
    lead: 'border-cyan-500/30 bg-cyan-500/10',
    feedback: 'border-purple-500/30 bg-purple-500/10',
};

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = useCallback((type: NotificationType, title: string, message: string) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setNotifications(prev => [...prev.slice(-4), { id, type, title, message }]);

        // Auto-dismiss after 5s
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const dismiss = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notify, notifications }}>
            {children}

            {/* Toast Stack */}
            <div className="fixed top-24 right-4 sm:right-8 z-[200] flex flex-col gap-3 w-80 sm:w-96 pointer-events-none">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 100, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${COLOR_MAP[n.type]} flex items-start gap-3`}
                        >
                            <div className="mt-0.5 shrink-0">{ICON_MAP[n.type]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/80">{n.title}</p>
                                <p className="text-xs text-[var(--foreground)]/60 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                            </div>
                            <button
                                onClick={() => dismiss(n.id)}
                                className="shrink-0 p-1 hover:bg-[var(--foreground)]/10 rounded-lg transition-all text-[var(--foreground)]/40 hover:text-[var(--foreground)]"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}
