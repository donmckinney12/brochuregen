"use client";
import { useState, useRef, useEffect } from 'react';
import ThreeDBrochure from '@/components/ThreeDBrochure';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Download, Share2, Shield, Zap, Sparkles, ChevronRight, MessageSquare, Info, Layout, Layers, Heart, Users, ExternalLink } from 'lucide-react';
import { API_URL } from '@/config';
import LeadForm from '@/components/LeadForm';

interface Comment {
    id: number;
    text: string;
    section_id: string;
    created_at: string;
}

interface SharedViewClientProps {
    shareUuid: string;
    data: Record<string, any>;
    activeVault: Record<string, any>;
    initialComments: Comment[];
}

export default function SharedViewClient({ shareUuid, data, activeVault, initialComments }: SharedViewClientProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [hasCapturedLead, setHasCapturedLead] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isARActive, setIsARActive] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hoverStartTime = useRef<{ [key: string]: number }>({});

    useEffect(() => {
        // Gating Logic for Campaign Brochures
        let timer: NodeJS.Timeout;
        if (data?.is_campaign && !hasCapturedLead) {
            timer = setTimeout(() => {
                setShowLeadForm(true);
            }, 15000); // 15 seconds
        }
        return () => clearTimeout(timer);
    }, [data?.is_campaign, hasCapturedLead]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/api/v1/brochures/shared/${shareUuid}/comments`, {
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

    const handleSectionHover = (sectionId: string, isEntering: boolean) => {
        if (isEntering) {
            hoverStartTime.current = { ...hoverStartTime.current, [sectionId]: Date.now() };
        } else {
            const start = hoverStartTime.current[sectionId];
            if (start) {
                const duration = Date.now() - start;
                // Only track if duration > 500ms to avoid noise
                if (duration > 500) {
                    fetch(`${API_URL}/api/v1/analytics/track`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            brochure_id: data.id,
                            section_id: sectionId,
                            duration_ms: duration
                        })
                    }).catch(console.error);
                }
                delete hoverStartTime.current[sectionId];
            }
        }
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
            <header className="absolute top-0 w-full p-4 md:p-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    {activeVault?.logoUrl ? (
                        <img src={activeVault.logoUrl} alt="Brand Logo" className="h-6 md:h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    ) : (
                        <div className="font-black tracking-tighter text-lg md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                            {data.title || 'BROCHURE'}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setIsARActive(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.2em] transition-all hidden lg:flex items-center gap-2"
                    >
                        Spatial AR
                    </button>
                    
                    <button
                        onClick={() => setShowLeadForm(true)}
                        className="px-4 py-2 md:px-6 md:py-2.5 bg-[var(--accent-primary)] hover:opacity-90 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-lg text-white"
                    >
                        Contact
                    </button>
                    
                    <button
                        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border transition-all ${isAudioEnabled ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}
                    >
                        <div className="flex gap-0.5 items-end h-3">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: isAudioEnabled ? [4, 12, 4] : 4 }}
                                    transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                                    className={`w-0.5 ${isAudioEnabled ? 'bg-cyan-400' : 'bg-white'}`}
                                />
                            ))}
                        </div>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center py-20 md:py-24 relative z-10 overflow-x-hidden">
                <div className="w-full max-w-7xl px-4 flex flex-col xl:flex-row gap-8 items-center justify-center">
                    <div className="flex-1 w-full flex justify-center">
                        <div className="w-full max-w-4xl scale-90 sm:scale-100 transition-transform">
                            <ThreeDBrochure
                                data={data}
                                activeVault={activeVault}
                                onOpenRefiner={handleSectionClick}
                                onSectionHover={handleSectionHover}
                            />
                        </div>
                    </div>

                    {/* Comments Sidebar (Tablets/Desktop side, Mobile Hidden/Bottom) */}
                    <div className="w-full xl:w-80 space-y-6">
                        <div className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] h-[500px] flex flex-col shadow-2xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                            
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Neural Feedback</h3>
                                <button 
                                    onClick={() => setShowCommentForm(true)}
                                    className="p-2 bg-white/5 hover:bg-cyan-500/20 rounded-full transition-all"
                                >
                                    <MessageSquare size={14} className="text-cyan-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
                                {comments.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10 mb-4 animate-pulse">
                                            <Info size={20} />
                                        </div>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest italic leading-loose">Initialize conversation<br/>to begin audit.</p>
                                    </div>
                                ) : (
                                    comments.map((comment, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i} 
                                            className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2 hover:bg-white/5 transition-colors"
                                        >
                                            {comment.section_id && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-cyan-500" />
                                                    <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">
                                                        {comment.section_id.replace('_', ' ')}
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-xs text-white/60 font-medium leading-relaxed italic">"{comment.text}"</p>
                                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                <span className="text-[7px] font-black text-white/20 uppercase">Transmission Received</span>
                                                <span className="text-[7px] font-bold text-white/30">
                                                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Mobile Global Actions */}
                        <div className="flex xl:hidden gap-4 w-full">
                            <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                                Request PDF
                            </button>
                            <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest">
                                Protocol Sync
                            </button>
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
                            <h3 className="text-lg font-black text-white italic tracking-tighter mb-4 uppercase">Add Comment</h3>
                            {selectedSection && (
                                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-4">Targeting: {selectedSection.replace('_', ' ')}</p>
                            )}
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
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
                                    {isSubmitting ? 'Sending...' : 'Post Comment'}
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
                                <button onClick={() => setShowLeadForm(false)} className="p-2 hover:bg-[var(--foreground)]/5 rounded-full text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-full text-[8px] font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] mb-4">
                                    Request Information
                                </div>
                                <h3 className="text-3xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Connect <span className="gradient-text">with Us</span></h3>
                                <p className="text-xs text-[var(--foreground)]/80 font-bold uppercase tracking-widest mt-2">{data.title}</p>
                            </div>

                            <div className="relative px-2">
                                <LeadForm
                                    shareUuid={shareUuid}
                                    primaryColor={activeVault?.primaryColor || '#4F46E5'}
                                    onSuccess={() => {
                                        setHasCapturedLead(true);
                                        setTimeout(() => setShowLeadForm(false), 2000);
                                    }}
                                />
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[8px] font-bold text-[var(--foreground)]/80 uppercase tracking-[0.4em]">Proprietary Generation Logic Applied</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Watermark / Footer */}
            <footer className="absolute bottom-6 w-full text-center z-50">
                <p className="text-[10px] font-black text-white/10 tracking-[0.4em] uppercase">
                    Generated by <span className="text-white/20">BrochureGen AI Engine</span>
                </p>
            </footer>

            {/* Spatial AR Overlay */}
            <AnimatePresence>
                {isARActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="absolute top-8 right-8">
                            <button onClick={() => setIsARActive(false)} className="p-4 bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin mb-8" />
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Opening <span className="gradient-text">AR Viewer</span></h2>
                        <p className="text-white/40 font-bold uppercase tracking-[0.3em] max-w-md text-xs leading-loose">
                            Preparing AR environment... Place your device on a flat surface.
                        </p>
                        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="block text-[8px] text-white/20 font-black uppercase mb-1">Stability</span>
                                <span className="text-emerald-400 font-mono text-xs font-bold">LOCKED</span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="block text-[8px] text-white/20 font-black uppercase mb-1">Immersion</span>
                                <span className="text-cyan-400 font-mono text-xs font-bold">100%</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
