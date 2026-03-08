"use client";
import React, { useState, useRef, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Bell, Search, Command, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { dark } from '@clerk/themes';
import { useNotifications } from './NotificationProvider';
import { AnimatePresence, motion } from 'framer-motion';

interface SuiteHeaderProps {
    onOpenSidebar?: () => void;
}

export default function SuiteHeader({ onOpenSidebar }: SuiteHeaderProps) {
    const { isDark, mounted } = useTheme();
    const { notifications } = useNotifications();
    const [showPanel, setShowPanel] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close panel on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setShowPanel(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="h-20 sticky top-0 z-40 bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--glass-border)] px-4 sm:px-8 flex items-center justify-between transition-colors duration-500">
            {/* Mobile Toggle */}
            <button
                onClick={onOpenSidebar}
                className="lg:hidden p-2 mr-2 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/10 rounded-lg"
            >
                <Menu size={24} />
            </button>
            {/* Search Bar */}
            <div className="hidden sm:relative group max-w-md w-full sm:flex">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-[var(--foreground)]/80 group-focus-within:text-[var(--accent-primary)] transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search Protocol Nodes..."
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl py-2.5 pl-12 pr-16 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]/50 transition-all font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-1.5 py-0.5 bg-[var(--foreground)]/10 rounded border border-[var(--glass-border)]">
                    <Command size={10} className="text-[var(--foreground)]/80" />
                    <span className="text-[10px] text-[var(--foreground)]/80 font-bold">K</span>
                </div>
            </div>

            {/* Mobile Search - Just Icon */}
            <button className="sm:hidden p-2 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/10 rounded-lg">
                <Search size={20} />
            </button>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-6">
                {/* Bell with Notification Dropdown */}
                <div className="relative" ref={panelRef}>
                    <button
                        onClick={() => setShowPanel(!showPanel)}
                        className="relative p-2 text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors"
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--accent-secondary)] rounded-full border-2 border-[var(--background)] text-[8px] font-black text-white flex items-center justify-center shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showPanel && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-12 w-80 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Notifications</span>
                                    <button onClick={() => setShowPanel(false)} className="p-1 hover:bg-[var(--foreground)]/10 rounded-lg">
                                        <X size={14} className="text-[var(--foreground)]/40" />
                                    </button>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/30">All clear</p>
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className="p-4 border-b border-[var(--glass-border)] last:border-0 hover:bg-[var(--foreground)]/5 transition-colors">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">{n.title}</p>
                                                <p className="text-xs text-[var(--foreground)]/80 mt-1 line-clamp-2">{n.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-[1px] bg-[var(--glass-border)]" />

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-xs font-bold text-[var(--foreground)] tracking-wide uppercase">Operational</span>
                        <span className="text-[10px] text-emerald-500 flex items-center whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                            Neural Link Active
                        </span>
                    </div>
                    <div className="p-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                        {mounted && (
                            <UserButton
                                appearance={{
                                    baseTheme: isDark ? dark : undefined,
                                    elements: {
                                        userButtonAvatarBox: "w-8 h-8 rounded-full"
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

