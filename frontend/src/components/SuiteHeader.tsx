"use client";
import React, { useState, useRef, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Bell, Search, Command, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { dark } from '@clerk/themes';
import { useNotifications } from './NotificationProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { PLAN_METADATA } from '@/config/tiers';

interface SuiteHeaderProps {
    onOpenSidebar?: () => void;
}

export default function SuiteHeader({ onOpenSidebar }: SuiteHeaderProps) {
    const { user } = useAuth();
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
        <header className="h-24 sticky top-0 z-40 bg-transparent px-6 md:px-16 flex items-center pointer-events-none">
            {/* Glass Background Shell [v30.2] */}
            <div className="w-full h-16 bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--glass-border)] dark:border-[var(--accent-primary)]/20 rounded-2xl pointer-events-auto shadow-2xl dark:shadow-[0_0_40px_rgba(var(--accent-primary-rgb),0.1)] transition-colors duration-500 flex items-center justify-between px-6">
                
                {/* Left Side: Mobile Toggle & Search */}
                <div className="flex items-center flex-1 max-w-xl">
                    <button
                        onClick={onOpenSidebar}
                        className="lg:hidden p-3 mr-4 text-[var(--foreground)] hover:bg-[var(--foreground)]/10 rounded-xl transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="hidden sm:relative group w-full sm:flex items-center">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search size={16} className="text-[var(--foreground)]/30 group-focus-within:text-[var(--accent-primary)] transition-all duration-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search brochures..."
                            className="w-full bg-[var(--foreground)]/[0.03] border border-white/5 rounded-xl py-2.5 pl-12 pr-16 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)] placeholder:text-[var(--foreground)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)]/30 focus:bg-[var(--foreground)]/[0.05] transition-all duration-500"
                        />
                        <div className="absolute right-4 flex items-center space-x-1.5 px-2 py-1 bg-[var(--foreground)]/5 rounded-lg border border-white/5 group-focus-within:border-[var(--accent-primary)]/40 transition-colors">
                            <Command size={10} className="text-[var(--foreground)]/20" />
                            <span className="text-[9px] text-[var(--foreground)]/20 font-black">K</span>
                        </div>
                        <div className="absolute inset-0 bg-[var(--accent-primary)]/5 blur-2xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                    </div>

                    <button className="sm:hidden p-3 text-[var(--foreground)]/60 hover:text-[var(--foreground)] rounded-xl">
                        <Search size={18} />
                    </button>
                </div>

                {/* Right Side: Elite Actions */}
                <div className="flex items-center space-x-6">
                    {/* Tier Badge */}
                    {user?.plan && PLAN_METADATA[user.plan] && (
                        <div className="hidden md:flex px-4 py-2 rounded-xl bg-[var(--foreground)]/[0.03] border border-white/5 items-center gap-2 group hover:border-[var(--accent-primary)]/30 transition-all duration-500 cursor-default">
                            <div className={`w-1.5 h-1.5 rounded-full ${PLAN_METADATA[user.plan].dotColor} shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.5)]`} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/60 group-hover:text-[var(--foreground)] transition-colors">
                                {PLAN_METADATA[user.plan].name}
                            </span>
                        </div>
                    )}

                    {/* Bell Dropdown */}
                    <div className="relative" ref={panelRef}>
                        <button
                            onClick={() => setShowPanel(!showPanel)}
                            className="relative p-3 text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-all hover:scale-110 active:scale-90"
                        >
                            <Bell size={18} />
                            {notifications.length > 0 && (
                                <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[var(--accent-primary)] rounded-full border-2 border-[var(--background)] text-[7px] font-black text-white flex items-center justify-center shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.5)]">
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
                                    className="absolute right-0 top-14 w-80 bg-[var(--glass-bg)] backdrop-blur-3xl border border-[var(--glass-border)] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                >
                                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/40">Status Updates</span>
                                        <button onClick={() => setShowPanel(false)} className="p-2 hover:bg-[var(--foreground)]/5 rounded-xl transition-colors">
                                            <X size={14} className="text-[var(--foreground)]/20" />
                                        </button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/20 italic">All systems functional</p>
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className="p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">{n.title}</p>
                                                            <p className="text-[10px] text-[var(--foreground)]/40 mt-2 leading-relaxed italic">{n.message}</p>
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



                    <div className="flex items-center space-x-5">
                        <div className="hidden sm:flex flex-col items-end text-right">
                            <span className="text-[10px] font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-none mb-1">Active</span>
                            <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.2em] flex items-center opacity-70">
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
                                            userButtonAvatarBox: "w-9 h-9 rounded-full border border-black/10"
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
