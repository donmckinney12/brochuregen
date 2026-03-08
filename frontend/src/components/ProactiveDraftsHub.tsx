"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    Zap,
    Check,
    Eye,
    Sparkles,
    Loader2,
    Lightbulb
} from 'lucide-react';

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/intent/drafts`, {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/intent/trigger`, {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/intent/approve/${id}`, {
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
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-[var(--foreground)]">
                        <Lightbulb size={20} className="text-amber-400" />
                        AI Intent Generator
                    </h3>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1 italic">Proactive Drafting Mode: Active</p>
                </div>
                <button
                    onClick={handleTrigger}
                    disabled={triggering}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg"
                >
                    {triggering ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Trigger Neural Intent
                </button>
            </div>

            {drafts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center premium-card border-dashed border-white/10 bg-white/5 opacity-50">
                    <Zap className="w-12 h-12 mb-4 text-[var(--foreground)]/80" />
                    <p className="text-sm font-bold uppercase tracking-widest">No Proactive Intents Manifested Yet...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {drafts.map((draft) => {
                            const content = JSON.parse(draft.content);
                            return (
                                <motion.div
                                    key={draft.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="premium-card p-6 border border-amber-500/20 bg-amber-500/5 relative group overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    </div>
                                    <h4 className="text-sm font-black italic uppercase mb-2 line-clamp-1">{content.headline}</h4>
                                    <p className="text-[10px] opacity-60 line-clamp-2 mb-6">{content.summary}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(draft.id)}
                                            className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-1"
                                        >
                                            <Check size={10} />
                                            Activate
                                        </button>
                                        <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-white hover:bg-white/10 transition-all">
                                            <Eye size={10} />
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
