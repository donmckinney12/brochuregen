"use client";
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SuiteLayout from '@/components/SuiteLayout';
import GenerationStudio from '@/components/GenerationStudio';
import { CheckCircle2, X } from 'lucide-react';

function DashboardContent() {
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
        <>
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
                                    <h4 className="text-[var(--foreground)] font-black text-sm uppercase tracking-tight">Protocol Synchronized</h4>
                                    <p className="text-emerald-500/80 dark:text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Your God-Tier features are now active.</p>
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
        </>
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
