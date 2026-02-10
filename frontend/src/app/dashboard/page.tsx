"use client";
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Generator from '@/components/Generator';

export default function Dashboard() {
    const { user, isLoading, refreshProfile } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentStatus = searchParams.get('payment');
    const plan = searchParams.get('plan');

    // Refresh profile if payment just happened
    useEffect(() => {
        if (paymentStatus === 'success') {
            refreshProfile();
            // Clear params after 3 seconds so refreshing doesn't trigger again
            setTimeout(() => {
                router.replace('/dashboard');
            }, 3000);
        }
    }, [paymentStatus, refreshProfile, router]);

    // Helper for credit formatting
    const formatCredits = (credits: number | undefined) => {
        if (credits === undefined) return 0;
        if (credits > 10000) return 'Unlimited';
        return credits;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Success Banner */}
                {paymentStatus === 'success' && (
                    <div className="mb-8 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <p className="font-bold">Payment Successful!</p>
                            <p className="text-sm">Your account has been upgraded to the {plan || 'Pro'} plan. Credits have been added.</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">Manage your brochures and subscription.</p>
                    </div>
                    <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Create New Brochure
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Credits Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Generation Credits</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold">{formatCredits(user?.credits)}</span>
                            {typeof formatCredits(user?.credits) === 'number' && <span className="text-slate-500">remaining</span>}
                        </div>
                    </div>

                    {/* Refine Credits Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Refine Credits</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold">{formatCredits(user?.refine_credits)}</span>
                            {typeof formatCredits(user?.refine_credits) === 'number' && <span className="text-slate-500">remaining</span>}
                        </div>
                    </div>

                    {/* Plan Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <h3 className="text-sm font-medium text-blue-100 uppercase tracking-wider mb-4">Current Plan</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-3xl font-bold capitalize block">{user?.plan || 'Free'}</span>
                                <a href="#" className="text-xs text-blue-200 hover:text-white underline mt-1 inline-block opacity-80 hover:opacity-100 transition-opacity">
                                    Manage billing
                                </a>
                            </div>
                            <Link href="/pricing" className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                                Upgrade
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Generator Section */}
                <div className="mb-16">
                    <Generator />
                </div>

                {/* Recent Brochures (Placeholder) */}
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                        Recent Brochures
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs px-2 py-1 rounded-full">0</span>
                    </h3>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center border-dashed">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No brochures yet</h4>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            Generate your first brochure above to see it appear here in your history.
                        </p>
                        <div className="flex flex-col items-center gap-3">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                                Start Generating &rarr;
                            </button>
                            <button className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                View example brochures
                            </button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
