"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    Activity,
    Users,
    MessageSquare,
    Zap,
    Target,
    ChevronRight,
    Sparkles,
    Copy,
    CheckCircle2,
    Clock,
    BrainCircuit
} from 'lucide-react';
import ProspectingHub from './ProspectingHub';
import ProactiveDraftsHub from './ProactiveDraftsHub';
import LivePulse from './LivePulse';

interface PulseItem {
    id: number;
    type: string;
    brochure_title: string;
    content: string;
    timestamp: string;
    metadata: any;
}

export default function CommandCenter() {
    const { getToken } = useAuth();
    const [pulse, setPulse] = useState<PulseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [suggestion, setSuggestion] = useState<{ id: number, text: string } | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const fetchPulse = async () => {
        try {
            const token = await getToken();
            if (!token) {
                setLoading(false);
                return;
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/command/pulse`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setPulse(await res.json());
        } catch (err) {
            console.error("Pulse fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPulse();
        const interval = setInterval(fetchPulse, 30000);
        return () => clearInterval(interval);
    }, [getToken]);

    const handleSuggest = async (item: PulseItem) => {
        setIsSuggesting(true);
        try {
            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/command/suggest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: item.id, type: item.type })
            });
            if (res.ok) {
                const data = await res.json();
                setSuggestion({ id: item.id, text: data.suggestion });
            }
        } catch (err) {
            console.error("Suggestion failed", err);
        } finally {
            setIsSuggesting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Activity className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Synchronizing Protocol Pulse...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3 sm:gap-4">
                        <span className="truncate">Unified Command Center</span>
                        <div className="flex h-3 w-3 relative shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mt-2">Protocol V15.0 // Autonomous Architect Hub</p>
                </div>
                <div className="flex gap-3 sm:gap-4 shrink-0">
                    <div className="premium-card px-4 sm:px-6 py-2 sm:py-3 border border-white/5 bg-white/5 flex items-center gap-2 sm:gap-3">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px] sm:text-xs font-black italic">{pulse.filter(p => p.type === 'LEAD').length} Leads</span>
                    </div>
                    <div className="premium-card px-4 sm:px-6 py-2 sm:py-3 border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-2 sm:gap-3">
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] sm:text-xs font-black italic">{pulse.filter(p => p.type === 'FEEDBACK').length} Pulses</span>
                    </div>
                </div>
            </div>

            {/* Live Pulse */}
            <LivePulse />

            {/* Proactive Drafting Section */}
            <div className="pb-12 border-b border-white/5">
                <ProactiveDraftsHub />
            </div>

            {/* Main Feed */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {pulse.map((item, idx) => (
                        <motion.div
                            key={`${item.type}-${item.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`premium-card p-6 border relative group overflow-hidden ${item.type === 'LEAD' ? 'bg-cyan-500/5 border-cyan-500/10' : 'bg-indigo-500/5 border-indigo-500/10'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-xl border ${item.type === 'LEAD' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                            }`}>
                                            {item.type === 'LEAD' ? <Target size={16} /> : <MessageSquare size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">{item.brochure_title}</p>
                                            <h3 className="text-lg font-bold italic tracking-tight">{item.content}</h3>
                                        </div>
                                    </div>

                                    {(item.metadata.message || item.metadata.text) && (
                                        <div className="p-4 bg-black/20 rounded-2xl border border-white/5 mb-4 italic text-sm opacity-80 leading-relaxed">
                                            "{item.metadata.message || item.metadata.text}"
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-[10px] font-black opacity-30 uppercase tracking-widest">
                                            <Clock size={12} />
                                            {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleSuggest(item)}
                                                className="flex items-center gap-2 px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                                                disabled={isSuggesting}
                                            >
                                                {isSuggesting ? <Zap size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                AI Assist
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight className="text-white/10 group-hover:text-white/40 transition-all cursor-pointer" />
                            </div>

                            {/* Suggestion Display */}
                            <AnimatePresence>
                                {suggestion?.id === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-6 pt-6 border-t border-white/5"
                                    >
                                        <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                    <Sparkles size={12} />
                                                    Neural Suggestion
                                                </div>
                                                <button
                                                    onClick={() => suggestion && navigator.clipboard.writeText(suggestion.text)}
                                                    className="p-2 hover:bg-indigo-500/20 rounded-lg transition-all text-indigo-400"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                            <p className="text-sm italic leading-relaxed text-indigo-100/90">
                                                {suggestion?.text}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {pulse.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
                        <Zap className="w-16 h-16 mb-6" />
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase">Protocol Silent</h2>
                        <p className="text-sm font-bold uppercase tracking-widest mt-2">Awaiting external engagement signals...</p>
                    </div>
                )}
            </div>

            {/* Prospecting Extension */}
            <div className="pt-20 border-t border-white/5">
                <ProspectingHub />
            </div>
        </div>
    );
}
