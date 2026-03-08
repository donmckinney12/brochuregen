"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    Search,
    Target,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    Zap,
    BrainCircuit,
    Loader2
} from 'lucide-react';

interface Prospect {
    company: string;
    reason: string;
    strategy: string;
}

export default function ProspectingHub() {
    const { getToken } = useAuth();
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(false);
    const [scanned, setScanned] = useState(false);

    const handlePulseScan = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/retargeting/analyze`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setProspects(await res.json());
                setScanned(true);
            }
        } catch (err) {
            console.error("Prospecting scan failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-[var(--foreground)]">
                        <BrainCircuit size={20} className="text-[var(--accent-secondary)]" />
                        Autonomous Prospecting Hub
                    </h3>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1 italic">Neural Retargeting Protocol Active</p>
                </div>
                <button
                    onClick={handlePulseScan}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-tertiary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                    {scanned ? 'Refresh Neural Scan' : 'Initialize Pulse Scan'}
                </button>
            </div>

            {!scanned && !loading && (
                <div className="py-20 flex flex-col items-center justify-center text-center premium-card border-dashed border-white/10 bg-white/5 opacity-50">
                    <Search className="w-12 h-12 mb-4 text-[var(--foreground)]/80" />
                    <p className="text-sm font-bold uppercase tracking-widest">Awaiting Command to Scan Lead Resonance...</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {prospects.map((prospect, idx) => (
                        <motion.div
                            key={prospect.company}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="premium-card p-6 border border-white/5 bg-white/5 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-black italic tracking-tight">{prospect.company}</h4>
                                    <div className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-[var(--accent-primary)] mb-1">Resonance Reason</p>
                                        <p className="text-xs font-bold opacity-60 leading-relaxed">{prospect.reason}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-[var(--accent-secondary)] mb-1">Engagement Strategy</p>
                                        <p className="text-xs italic opacity-80 leading-relaxed">"{prospect.strategy}"</p>
                                    </div>
                                </div>

                                <button className="mt-6 w-full py-3 bg-[var(--foreground)]/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all flex items-center justify-center gap-2">
                                    Initiate Outreach
                                    <ChevronRight size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
