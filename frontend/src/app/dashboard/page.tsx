"use client";
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SuiteLayout from '@/components/SuiteLayout';
import GenerationStudio from '@/components/GenerationStudio';
import { CheckCircle2, X } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { PLAN_METADATA } from '@/config/tiers';

function DashboardContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (searchParams.get('payment') === 'success') {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Tier-Based Greeting [v30.2] */}
            <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                    <h1 className="text-6xl md:text-8xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-[0.8] mb-0">
                        {user?.plan && PLAN_METADATA[user.plan] ? (
                            <>
                                {PLAN_METADATA[user.plan].label.split(' ')[0]} <br />
                                <span className="gradient-text">{PLAN_METADATA[user.plan].label.split(' ').slice(1).join(' ')}</span>
                            </>
                        ) : (
                            <>
                                Command <br />
                                <span className="gradient-text">Center</span>
                            </>
                        )}
                    </h1>
                    {user?.plan && PLAN_METADATA[user.plan] && (
                        <div className={`px-6 py-2 rounded-2xl bg-${PLAN_METADATA[user.plan].color}-500/10 border border-${PLAN_METADATA[user.plan].color}-500/20 text-${PLAN_METADATA[user.plan].color}-500 text-[11px] font-black uppercase tracking-[0.4em] mb-4 shadow-xl`}>
                            {PLAN_METADATA[user.plan].name} NODE
                        </div>
                    )}
                </div>
                <div className="h-1.5 w-32 bg-gradient-to-r from-[var(--accent-primary)] to-transparent mb-8 rounded-full" />
                <p className="text-[var(--foreground)]/50 font-bold text-sm uppercase tracking-[0.6em] italic max-w-3xl leading-relaxed">
                    {user?.plan && PLAN_METADATA[user.plan] ? PLAN_METADATA[user.plan].description : 'Initialize your next high-fidelity brochure synthesis protocol.'}
                </p>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
                    >
                        <div className="bg-emerald-500/10 backdrop-blur-3xl border border-emerald-500/20 p-6 rounded-[2rem] flex items-center justify-between shadow-xl transition-colors duration-500">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[var(--foreground)] font-black text-sm uppercase tracking-tight">Upgrade Successful</h4>
                                    <p className="text-emerald-500/80 dark:text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Your premium features are now available.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSuccess(false)} className="text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors p-2">
                                <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <GenerationStudio />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <SuiteLayout>
            <Suspense fallback={null}>
                <DashboardContent />
            </Suspense>
        </SuiteLayout>
    );
}
