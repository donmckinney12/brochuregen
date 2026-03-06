"use client";
import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { Bell, Search, Command } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuiteHeader() {
    return (
        <header className="h-20 sticky top-0 z-40 bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--glass-border)] px-8 flex items-center justify-between transition-colors duration-500">
            {/* Search Bar */}
            <div className="relative group max-w-md w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-[var(--foreground)]/40 group-focus-within:text-[var(--accent-primary)] transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search Protocol Nodes..."
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl py-2.5 pl-12 pr-16 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]/50 transition-all font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-1.5 py-0.5 bg-[var(--foreground)]/10 rounded border border-[var(--glass-border)]">
                    <Command size={10} className="text-[var(--foreground)]/40" />
                    <span className="text-[10px] text-[var(--foreground)]/40 font-bold">K</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent-secondary)] rounded-full border border-[var(--background)] shadow-[0_0_10px_rgba(236,72,153,0.3)]" />
                </button>

                <div className="h-8 w-[1px] bg-[var(--glass-border)]" />

                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end text-right">
                        <span className="text-xs font-bold text-[var(--foreground)] tracking-wide uppercase">Operational</span>
                        <span className="text-[10px] text-emerald-500 flex items-center whitespace-nowrap">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                            Neural Link Active
                        </span>
                    </div>
                    <div className="p-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8 rounded-full"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
