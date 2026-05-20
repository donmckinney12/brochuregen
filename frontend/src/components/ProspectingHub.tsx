"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Target, Search, Filter, Mail, ChevronRight, Sparkles, Globe, Loader2, Database, ShieldCheck, Zap, BrainCircuit } from 'lucide-react';
import { API_URL } from '@/config';

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
            if (!token) {
                setLoading(false);
                return;
            }
            const res = await fetch(`${API_URL}/api/v1/retargeting/analyze`, {
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
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-3">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-[var(--foreground)]">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <BrainCircuit size={24} className="text-indigo-400" />
                        </div>
                        Sales Intelligence <span className="text-indigo-500">Dashboard</span>
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 italic">System: RETARGETING ACTIVE</p>
                </div>
                <button
                    onClick={handlePulseScan}
                    disabled={loading}
                    className="relative group overflow-hidden flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="group-hover:scale-125 transition-transform" />}
                    <span className="relative z-10">{loading ? 'RESEARCHING...' : (scanned ? 'Refresh Intelligence' : 'Initialize Research')}</span>
                </button>
            </div>

            {!scanned && !loading && (
                <div className="py-32 flex flex-col items-center justify-center text-center premium-card border-dashed border-white/5 bg-white/[0.01] opacity-50 rounded-[3rem]">
                    <Search className="w-16 h-16 mb-6 text-[var(--foreground)]/10 animate-pulse" />
                    <h4 className="text-xl font-black italic uppercase tracking-widest text-[var(--foreground)]/20">Market Analysis Required</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/10 mt-2 italic">Awaiting manual initialization of lead acquisition</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {prospects.map((prospect, idx) => (
                        <motion.div
                            key={prospect.company}
                            initial={{ opacity: 0, x: -20, y: 20 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="premium-card p-10 border border-indigo-500/20 bg-indigo-500/[0.02] backdrop-blur-3xl group relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-2xl font-black italic tracking-tighter text-[var(--foreground)] uppercase group-hover:text-indigo-400 transition-colors">{prospect.company}</h4>
                                    <div className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-5 bg-black/20 rounded-2xl border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-cyan-500/60 mb-2">Identification Criteria</p>
                                        <p className="text-sm font-bold text-[var(--foreground)]/80 leading-relaxed italic">"{prospect.reason}"</p>
                                    </div>
                                    <div className="p-5 bg-indigo-500/[0.03] rounded-2xl border border-indigo-500/10 group-hover:border-indigo-500/30 transition-colors">
                                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-500/60 mb-2">Strategic Engagement Plan</p>
                                        <p className="text-sm font-black italic text-indigo-100/90 leading-relaxed">
                                            {prospect.strategy}
                                        </p>
                                    </div>
                                </div>

                                <button className="mt-10 w-full py-5 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3 group/btn shadow-xl">
                                    <Mail size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                    Contact Lead
                                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
