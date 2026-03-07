"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, Trash2, ExternalLink, Calendar, User, Search, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Comment {
    id: number;
    brochure_id: number;
    text: string;
    section_id: string;
    is_read: number;
    created_at: string;
    brochure_title?: string;
}

export default function FeedbackHub() {
    const { getToken } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('unread');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFeedback = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/brochures/feedback/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (err) {
            console.error("Failed to load feedback", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [getToken]);

    const markAsRead = async (id: number) => {
        try {
            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/brochures/feedback/${id}/read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setComments(comments.map(c => c.id === id ? { ...c, is_read: 1 } : c));
            }
        } catch (err) {
            console.error("Mark read failed", err);
        }
    };

    const filteredComments = comments.filter(c => {
        const matchesSearch = c.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true : filter === 'unread' ? c.is_read === 0 : c.is_read === 1;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Feedback Hub</h1>
                    <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-[0.3em] mt-2 italic">Annotation Stream & Client Calibration</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search annotations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl text-xs font-bold text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)]/50 transition-all w-64"
                        />
                    </div>
                    <div className="flex p-1 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl">
                        {(['all', 'unread', 'read'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--foreground)]/40 hover:text-[var(--foreground)]'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredComments.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center premium-card border-dashed">
                    <MessageSquare size={48} className="text-[var(--foreground)]/10 mb-6" />
                    <p className="text-sm font-bold text-[var(--foreground)]/40 italic">No feedback nodes detected in this quadrant.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredComments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`premium-card p-8 border ${comment.is_read === 0 ? 'border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/[0.02]' : 'border-[var(--glass-border)]'} relative group overflow-hidden`}
                            >
                                {comment.is_read === 0 && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-primary)]" />
                                )}

                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-full text-[8px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
                                                Section: {comment.section_id || 'General'}
                                            </div>
                                            <span className="text-[10px] font-bold text-[var(--foreground)]/20 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-lg font-medium leading-relaxed text-[var(--foreground)] italic tracking-tight">
                                            "{comment.text}"
                                        </p>
                                    </div>

                                    <div className="flex md:flex-col items-center justify-end gap-3">
                                        {comment.is_read === 0 && (
                                            <button
                                                onClick={() => markAsRead(comment.id)}
                                                className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Mark as Processed"
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}
                                        <button className="p-3 bg-[var(--foreground)]/5 text-[var(--foreground)]/40 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all shadow-sm">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[8px] font-black text-[var(--foreground)]/20 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
                                        Node ID: {comment.id}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
