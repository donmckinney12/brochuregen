"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { FEATURE_GATES, PLAN_METADATA } from '@/config/tiers';
import { Lock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TierGuardProps {
    feature: keyof typeof FEATURE_GATES;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function TierGuard({ feature, children, fallback }: TierGuardProps) {
    const { hasFeature, isLoading, user } = useAuth();

    if (isLoading) return null;

    if (hasFeature(feature)) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-[var(--glass-bg)] backdrop-blur-3xl border border-[var(--glass-border)] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-[var(--foreground)]/5 rounded-3xl border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                        <Lock size={32} className="text-[var(--foreground)]/20" />
                    </div>

                    <h2 className="text-3xl font-black text-[var(--foreground)] italic tracking-tighter uppercase mb-4">
                        Elite Feature Locked
                    </h2>
                    
                        The <span className="text-[var(--foreground)]">{feature.replace('_', ' ')}</span> module requires a higher service tier. Upgrade your plan to access this feature.

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
                        {PLAN_METADATA.enterprise.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--foreground)]/[0.02] border border-[var(--glass-border)]">
                                <Zap size={14} className="text-indigo-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/60">{f}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href="/pricing"
                            className="w-full sm:w-auto px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            View Upgrade Matrix <ArrowRight size={14} />
                        </Link>
                        <Link 
                            href="/dashboard"
                            className="w-full sm:w-auto px-10 py-5 bg-transparent border border-[var(--glass-border)] text-[var(--foreground)]/40 hover:text-[var(--foreground)] font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-[var(--foreground)]/5 transition-all"
                        >
                            Return to Hub
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
