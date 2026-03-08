"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

import SuiteLayout from '@/components/SuiteLayout';

export default function SettingsPage() {
    const { user, refreshProfile } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        // Mock update for now - integrate with /api/v1/profile update later
        setTimeout(() => {
            setIsUpdating(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            refreshProfile();
        }, 1000);
    };

    return (
        <SuiteLayout>
            <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Settings</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <nav className="flex flex-col gap-1">
                            <Link href="/settings" className="px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20 text-[var(--foreground)] font-bold">
                                Profile
                            </Link>
                            <Link href="/settings/billing" className="px-4 py-3 rounded-xl hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/70 hover:text-[var(--foreground)] font-medium transition-colors">
                                Billing
                            </Link>
                            <Link href="/developers" className="px-4 py-3 rounded-xl hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/70 hover:text-[var(--foreground)] font-medium transition-colors">
                                API Keys
                            </Link>
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="md:col-span-3">
                        <div className="bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] p-8 shadow-xl">
                            <h2 className="text-xl font-black text-[var(--foreground)] mb-6">Profile Information</h2>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl border text-sm font-bold ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/60 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-all text-[var(--foreground)] placeholder:text-[var(--foreground)]/30"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/60 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] text-[var(--foreground)]/50 cursor-not-allowed outline-none"
                                    />
                                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/40">Email cannot be changed currently.</p>
                                </div>

                                <div className="pt-6 border-t border-[var(--glass-border)]">
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.02] hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-lg shadow-[var(--accent-primary)]/20 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {isUpdating ? 'Saving Protocol...' : 'Save Configuration'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-8 bg-red-500/5 rounded-2xl border border-red-500/20 p-8 shadow-xl">
                            <h2 className="text-xl font-black text-red-500 mb-2">Danger Zone</h2>
                            <p className="text-xs font-medium text-red-500/70 mb-6">Permanently terminate your account and wipe all protocol data. This action is irreversible.</p>
                            <button className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white text-[10px] uppercase tracking-widest font-black rounded-xl transition-all hover:shadow-lg hover:shadow-red-500/20 active:scale-95">
                                Terminate Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SuiteLayout>
    );
}
