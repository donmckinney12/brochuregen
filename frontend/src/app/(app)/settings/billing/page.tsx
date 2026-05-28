"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';
import Link from 'next/link';

export default function BillingPage() {
    const { user, getToken } = useAuth();
    const [isLoadingPortal, setIsLoadingPortal] = useState(false);

    const handleManageBilling = async () => {
        setIsLoadingPortal(true);
        try {
            const token = await getToken();
            // Updated to use the new v1 API endpoint
            const response = await fetch(`${API_URL}/api/v1/payment/create-portal-session?user_id=${user?.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                alert(data.detail || "Could not open billing portal. Please contact support.");
            }
        } catch (error) {
            console.error("Portal error:", error);
        } finally {
            setIsLoadingPortal(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </Link>
                    <h1 className="text-3xl font-bold">Billing Settings</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <nav className="flex flex-col gap-1">
                            <Link href="/settings" className="px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
                                Profile
                            </Link>
                            <Link href="/settings/billing" className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">
                                Billing
                            </Link>
                            <Link href="/developers" className="px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
                                API Keys
                            </Link>
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="md:col-span-3 space-y-8">
                        {/* Current Plan Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Your current plan</p>
                                <h2 className="text-3xl font-bold capitalize mb-4">{user?.plan || 'Free'}</h2>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                                        {user?.credits} Credits remaining
                                    </div>
                                    <div className="bg-white/10 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                                        Renews on March 27, 2026
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="font-bold mb-1">Manage Subscription</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Update payment method, download invoices, or cancel your plan.</p>
                                    </div>
                                    {user?.credits === 9999 ? (
                                        <div className="px-6 py-3 bg-[var(--foreground)]/5 text-[var(--foreground)]/60 font-medium rounded-xl border border-[var(--glass-border)] text-sm">
                                            Granted by Administrator
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleManageBilling}
                                            disabled={isLoadingPortal}
                                            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            {isLoadingPortal ? 'Opening...' : 'Manage via Stripe'}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Usage Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                            <h3 className="font-bold mb-6">Plan Usage</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">Brochure Generations</span>
                                        <span className="font-medium">{1000 - (user?.credits || 0)} / 1000</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${((1000 - (user?.credits || 0)) / 1000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
