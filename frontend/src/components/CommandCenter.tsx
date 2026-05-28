"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    Zap, Sparkles, BrainCircuit, Rocket, Target, Send, Loader2, Layout, Database,
    ChevronRight, Search, Activity, Command, Boxes, Users, MessageSquare, Clock, Copy
} from 'lucide-react';
import { API_URL } from '@/config';
import ProspectingHub from './ProspectingHub';
import ProactiveDraftsHub from './ProactiveDraftsHub';
import LivePulse from './LivePulse';

interface PulseItem {
    id: number;
    type: string;
    brochure_title: string;
    content: string;
    timestamp: string;
    metadata: Record<string, any>;
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
            const res = await fetch(`${API_URL}/api/v1/command/pulse`, {
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
            const res = await fetch(`${API_URL}/api/v1/command/suggest`, {
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
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Updating System Activity...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] space-y-16 pb-24 relative px-6 md:px-16">
            {/* Atmospheric Background Layers [v30.2] */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[140px] rounded-full" />
            </div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 px-6 md:px-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-[2px] bg-[var(--accent-primary)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-primary)]">Activity Dashboard Active</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-[0.9]">
                        Operations <br />
                        <span className="gradient-text">Hub</span>
                    </h1>
                    <p className="text-[var(--foreground)]/40 font-bold tracking-[0.4em] uppercase text-xs italic max-w-xl">
                        Version 15.0 // Advanced Intelligence Hub
                    </p>
                </div>

                <div className="flex gap-4 shrink-0">
                    <div className="premium-card px-8 py-4 border border-cyan-500/20 bg-cyan-500/5 flex items-center gap-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <div className="flex flex-col">
                            <span className="text-xl font-black italic text-cyan-400 leading-none">{pulse.filter(p => p.type === 'LEAD').length}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Lead Management</span>
                        </div>
                    </div>
                    <div className="premium-card px-8 py-4 border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-4 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <div className="flex flex-col">
                            <span className="text-xl font-black italic text-indigo-400 leading-none">{pulse.filter(p => p.type === 'FEEDBACK').length}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Engagement Feed</span>
                        </div>
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
                                                AI Support
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
                                                    Strategic Suggestion
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
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase">System Idle</h2>
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
