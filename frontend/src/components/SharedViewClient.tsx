"use client";
import { useState } from 'react';
import ThreeDBrochure from '@/components/ThreeDBrochure';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LeadForm from '@/components/LeadForm';

interface Comment {
    id: number;
    text: string;
    section_id: string;
    created_at: string;
}

interface SharedViewClientProps {
    shareUuid: string;
    data: any;
    activeVault: any;
    initialComments: Comment[];
}

export default function SharedViewClient({ shareUuid, data, activeVault, initialComments }: SharedViewClientProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/brochures/shared/${shareUuid}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: newComment,
                    section_id: selectedSection
                }),
            });

            if (res.ok) {
                const added = await res.json();
                setComments(prev => [...prev, added]);
                setNewComment('');
                setShowCommentForm(false);
                setSelectedSection(null);
            }
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSectionClick = (text: string, fieldName: string, index?: number) => {
        const id = index !== undefined ? `${fieldName}_${index}` : fieldName;
        setSelectedSection(id);
        setShowCommentForm(true);
    };

    return (
        <div className="min-h-screen font-sans bg-[#020617] text-white flex flex-col relative overflow-hidden">
            {/* Premium Presentation Background */}
            <div className="absolute inset-0 z-0 text-white flex flex-col items-center">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            </div>

            {/* Minimal Header */}
            <header className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    {activeVault?.logoUrl ? (
                        <img src={activeVault.logoUrl} alt="Brand Logo" className="h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    ) : (
                        <div className="font-black tracking-tighter text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                            {data.title || 'BROCHURE'}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowCommentForm(true)}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all group relative"
                        title="Leave Feedback"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                        {comments.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[8px] font-black flex items-center justify-center text-black">
                                {comments.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setShowLeadForm(true)}
                        className="px-6 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.3)] text-white"
                    >
                        Initialize Protocol
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl hidden sm:block"
                    >
                        Create Your Own
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center py-24 relative z-10">
                <div className="w-full max-w-6xl px-4 flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className="flex-1 w-full max-w-4xl">
                        <ThreeDBrochure
                            data={data}
                            activeVault={activeVault}
                            onOpenRefiner={handleSectionClick}
                        />
                    </div>

                    {/* Comments Sidebar (Mobile bottom, Desktop side) */}
                    <div className="w-full md:w-64 space-y-4">
                        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl h-[400px] flex flex-col">
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Neural Echoes</h3>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {comments.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20 mb-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                        </div>
                                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic">No pulse detected.</p>
                                    </div>
                                ) : (
                                    comments.map((comment, i) => (
                                        <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                                            {comment.section_id && (
                                                <div className="text-[8px] font-black text-cyan-400/60 uppercase tracking-widest">
                                                    @{comment.section_id.replace('_', ' ')}
                                                </div>
                                            )}
                                            <p className="text-xs text-white/70 font-medium leading-relaxed">{comment.text}</p>
                                            <div className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">
                                                {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Comment Modal */}
            <AnimatePresence>
                {showCommentForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCommentForm(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl"
                        >
                            <h3 className="text-lg font-black text-white italic tracking-tighter mb-4 uppercase">Initialize Pulse Comment</h3>
                            {selectedSection && (
                                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-4">Targeting: {selectedSection.replace('_', ' ')}</p>
                            )}
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Sync your feedback..."
                                className="w-full h-32 bg-black border border-white/10 rounded-2xl p-4 text-xs text-white focus:ring-1 focus:ring-cyan-500/50 outline-none resize-none mb-6"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCommentForm(false)}
                                    className="flex-1 py-3 text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddComment}
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl active:scale-95 disabled:opacity-30"
                                >
                                    {isSubmitting ? 'Syncing...' : 'Broadcast'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Lead Form Modal */}
            <AnimatePresence>
                {showLeadForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLeadForm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[var(--background)] border border-[var(--glass-border)] rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setShowLeadForm(false)} className="p-2 hover:bg-[var(--foreground)]/5 rounded-full text-[var(--foreground)]/30 hover:text-[var(--foreground)] transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full text-[8px] font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] mb-4">
                                    Neural Capture Node
                                </div>
                                <h3 className="text-3xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Initialize <span className="gradient-text">Protocol</span></h3>
                                <p className="text-xs text-[var(--foreground)]/40 font-bold uppercase tracking-widest mt-2">{data.title}</p>
                            </div>

                            <div className="relative px-2">
                                <LeadForm
                                    shareUuid={shareUuid}
                                    primaryColor={activeVault?.primaryColor || '#4F46E5'}
                                    onSuccess={() => {
                                        setTimeout(() => setShowLeadForm(false), 2000);
                                    }}
                                />
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[8px] font-bold text-[var(--foreground)]/20 uppercase tracking-[0.4em]">Proprietary Generation Logic Applied</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Watermark / Footer */}
            <footer className="absolute bottom-6 w-full text-center z-50">
                <p className="text-[10px] font-black text-white/10 tracking-[0.4em] uppercase">
                    Synthesized by <span className="text-white/20">BrochureGen Neural Engine</span>
                </p>
            </footer>
        </div>
    );
}
