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
        <header className="h-24 sticky top-0 z-40 bg-transparent px-6 sm:px-12 flex items-center justify-between pointer-events-none">
            {/* Glass Background Shell */}
            <div className="absolute inset-x-6 top-4 h-16 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-2xl pointer-events-auto shadow-2xl" />

            {/* Mobile Toggle */}
            <button
                onClick={onOpenSidebar}
                className="relative lg:hidden p-3 mr-4 text-white hover:bg-white/10 rounded-xl pointer-events-auto"
            >
                <Menu size={20} />
            </button>

            {/* Search Bar (Elite [v30.0]) */}
            <div className="hidden sm:relative group max-w-md w-full sm:flex pointer-events-auto relative z-10 translate-y-2">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={16} className="text-white/30 group-focus-within:text-[var(--accent-primary)] transition-all duration-500" />
                </div>
                <input
                    type="text"
                    placeholder="Identify Protocol Node..."
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-12 pr-16 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)]/30 focus:bg-white/[0.05] transition-all duration-500"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10 group-focus-within:border-[var(--accent-primary)]/40 transition-colors">
                    <Command size={10} className="text-white/20" />
                    <span className="text-[9px] text-white/20 font-black">K</span>
                </div>

                {/* Search Focus Glow */}
                <div className="absolute inset-0 bg-[var(--accent-primary)]/5 blur-2xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
            </div>

            {/* Mobile Search - Just Icon */}
            <button className="sm:hidden p-3 text-white/60 hover:text-white rounded-xl pointer-events-auto relative z-10 translate-y-2">
                <Search size={18} />
            </button>

            {/* Elite Actions */}
            <div className="flex items-center space-x-6 pointer-events-auto relative z-10 translate-y-2">
                {/* Bell Dropdown */}
                <div className="relative" ref={panelRef}>
                    <button
                        onClick={() => setShowPanel(!showPanel)}
                        className="relative p-3 text-white/40 hover:text-white transition-all hover:scale-110 active:scale-90"
                    >
                        <Bell size={18} />
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-[var(--accent-primary)] rounded-full border-2 border-black text-[8px] font-black text-white flex items-center justify-center shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.5)]">
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
                                className="absolute right-0 top-14 w-80 bg-black/90 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                            >
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Status Updates</span>
                                    <button onClick={() => setShowPanel(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <X size={14} className="text-white/20" />
                                    </button>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">All protocols nominal</p>
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className="p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-[var(--accent-primary)] transition-colors">{n.title}</p>
                                                        <p className="text-[10px] text-white/40 mt-2 leading-relaxed italic">{n.message}</p>
                                                    </div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mt-1 shrink-0 shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.5)]" />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                <div className="flex items-center space-x-5">
                    <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-[10px] font-black text-white italic tracking-tighter uppercase leading-none mb-1">Elite Node</span>
                        <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-[0.2em] flex items-center opacity-60">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            Secure Link
                        </span>
                    </div>
                    <div className="p-0.5 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)]">
                        {mounted && (
                            <UserButton
                                appearance={{
                                    baseTheme: isDark ? dark : undefined,
                                    elements: {
                                        userButtonAvatarBox: "w-9 h-9 rounded-full border border-black/20"
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

