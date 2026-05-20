"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, BrainCircuit, Rocket, Trash2, Check, ExternalLink, Loader2, Zap, Target, Lightbulb, Eye } from 'lucide-react';
import { API_URL } from '@/config';

interface Draft {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export default function ProactiveDraftsHub() {
    const { getToken } = useAuth();
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState(false);

    const fetchDrafts = async () => {
        try {
            const token = await getToken();
            if (!token) {
                setLoading(false);
                return;
            }
            const res = await fetch(`${API_URL}/api/v1/intent/drafts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setDrafts(await res.json());
        } catch (err) {
            console.error("Failed to fetch drafts", err);
        } finally {
            setLoading(false);
        }
    };

    const handleTrigger = async () => {
        setTriggering(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/intent/trigger`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) await fetchDrafts();
        } catch (err) {
            console.error("Failed to trigger draft", err);
        } finally {
            setTriggering(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/intent/approve/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setDrafts(drafts.filter(d => d.id !== id));
                alert("Protocol Activated! The draft is now live in your Vault.");
            }
        } catch (err) {
            console.error("Approve failed", err);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    if (loading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin opacity-20" /></div>;

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-3">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-[var(--foreground)]">
                        <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <BrainCircuit size={24} className="text-amber-400" />
                        </div>
                        AI Content <span className="text-amber-500">Suggestions</span>
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 italic">Proactive Content Generation: ENABLED</p>
                </div>
                <button
                    onClick={handleTrigger}
                    disabled={triggering}
                    className="relative group overflow-hidden flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    {triggering ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />}
                    <span className="relative z-10">{triggering ? 'GENERATING...' : 'Generate New Suggestions'}</span>
                </button>
            </div>

            {drafts.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-center premium-card border-dashed border-white/5 bg-white/[0.01] opacity-50 rounded-[3rem]">
                    <Zap className="w-16 h-16 mb-6 text-[var(--foreground)]/10 animate-pulse" />
                    <h4 className="text-xl font-black italic uppercase tracking-widest text-[var(--foreground)]/20">Awaiting Content Signals</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/10 mt-2 italic">System currently idle</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {drafts.map((draft) => {
                            const content = JSON.parse(draft.content);
                            return (
                                <motion.div
                                    key={draft.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                    className="premium-card p-10 border border-amber-500/20 bg-amber-500/[0.02] backdrop-blur-3xl relative group/draft overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] to-transparent opacity-0 group-hover/draft:opacity-100 transition-opacity duration-700" />
                                    
                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
                                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500/60">New Suggestion</span>
                                        </div>
                                        <div className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground)]/20 bg-black/20 px-2 py-1 rounded-lg">
                                            {new Date(draft.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-black italic uppercase text-[var(--foreground)] mb-3 line-clamp-1 group-hover/draft:text-amber-500 transition-colors relative z-10">{content.headline}</h4>
                                    <p className="text-[11px] font-medium text-[var(--foreground)]/40 leading-relaxed line-clamp-3 mb-8 relative z-10">{content.summary}</p>

                                    <div className="flex gap-3 relative z-10">
                                        <button
                                            onClick={() => handleApprove(draft.id)}
                                            className="flex-1 py-4 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            <Rocket size={14} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                            Approve Draft
                                        </button>
                                        <button className="p-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white hover:text-black transition-all">
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
