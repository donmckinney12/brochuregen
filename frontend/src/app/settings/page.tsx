"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />
            
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </Link>
                    <h1 className="text-3xl font-bold">Settings</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <nav className="flex flex-col gap-1">
                            <Link href="/settings" className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">
                                Profile
                            </Link>
                            <Link href="/settings/billing" className="px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
                                Billing
                            </Link>
                            <Link href="/developers" className="px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
                                API Keys
                            </Link>
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="md:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                            
                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Your Name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed outline-none"
                                    />
                                    <p className="mt-2 text-xs text-slate-400">Email cannot be changed currently.</p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button 
                                        type="submit"
                                        disabled={isUpdating}
                                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isUpdating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-8 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
                            <p className="text-sm text-red-600 dark:text-red-500/70 mb-6">Permanently delete your account and all your data. This action cannot be undone.</p>
                            <button className="px-6 py-3 bg-red-600/10 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white font-bold rounded-xl transition-all">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
