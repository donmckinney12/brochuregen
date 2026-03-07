"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Twitter, Linkedin, Instagram, Sparkles, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SocialPost {
    platform?: string;
    text?: string;
    content?: string;
    caption?: string;
}

interface SocialPulseKitProps {
    posts: SocialPost[] | string;
    brochureId?: number;
}

export default function SocialPulseKit({ posts, brochureId }: SocialPulseKitProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [dispatchingIndex, setDispatchingIndex] = useState<number | null>(null);
    const [dispatchedIndices, setDispatchedIndices] = useState<number[]>([]);
    const { getToken } = useAuth();

    // Normalize posts data
    let postList: SocialPost[] = [];
    try {
        if (typeof posts === 'string') {
            postList = JSON.parse(posts);
        } else {
            postList = posts;
        }
    } catch (e) {
        console.error("Failed to parse social posts", e);
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleDispatch = async (index: number, platform: string) => {
        if (!brochureId) return;
        setDispatchingIndex(index);
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/social/dispatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    brochure_id: brochureId,
                    platform,
                    post_index: index
                })
            });

            if (!res.ok) throw new Error('Dispatch failed');

            setDispatchedIndices(prev => [...prev, index]);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setDispatchingIndex(null);
        }
    };

    const getIcon = (platform?: string) => {
        const p = platform?.toLowerCase() || '';
        if (p.includes('linkedin')) return <Linkedin size={18} className="text-[#0A66C2]" />;
        if (p.includes('twitter') || p.includes('x')) return <Twitter size={18} className="text-[var(--foreground)]" />;
        if (p.includes('instagram')) return <Instagram size={18} className="text-[#E4405F]" />;
        return <Share2 size={18} className="text-[var(--accent-primary)]" />;
    };

    if (!postList || postList.length === 0) return null;

    return (
        <section className="py-12 sm:py-20">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] shadow-lg">
                    <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Social Pulse Kit</h3>
                    <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest mt-1 italic">AI-Generated Multi-Channel Distribution Assets</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {postList.map((post, i) => {
                    const postContent = post.content || post.text || post.caption || "";
                    const platform = post.platform || (i === 0 ? "LinkedIn" : i === 1 ? "LinkedIn" : i === 2 ? "LinkedIn" : "Twitter/X");

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative p-4 sm:p-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[1.5rem] sm:rounded-[2rem] hover:border-[var(--accent-primary)]/30 transition-all duration-500 overflow-hidden shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-[var(--foreground)]/5 rounded-xl border border-[var(--glass-border)]">
                                        {getIcon(platform)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40">{platform}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => handleCopy(postContent, i)}
                                        className={`flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${copiedIndex === i ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-[var(--foreground)]/5 hover:bg-[var(--foreground)] text-[var(--foreground)]/40 hover:text-[var(--foreground)] border-[var(--glass-border)]'}`}
                                    >
                                        {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                                        <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDispatch(i, platform)}
                                        disabled={dispatchingIndex === i || dispatchedIndices.includes(i)}
                                        className={`flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${dispatchedIndices.includes(i) ? 'bg-blue-500 text-white border-blue-500' : 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50'}`}
                                    >
                                        {dispatchingIndex === i ? <Loader2 size={12} className="animate-spin" /> : dispatchedIndices.includes(i) ? <Check size={12} /> : <Send size={12} />}
                                        <span>{dispatchedIndices.includes(i) ? 'Dispatched' : 'Dispatch'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-sm font-medium leading-relaxed text-[var(--foreground)]/80 italic line-clamp-6 group-hover:line-clamp-none transition-all duration-500">
                                    {postContent}
                                </p>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
