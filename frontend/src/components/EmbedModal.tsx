"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Code, ExternalLink } from 'lucide-react';

interface EmbedModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUuid: string;
}

export default function EmbedModal({ isOpen, onClose, shareUuid }: EmbedModalProps) {
    const [copied, setCopied] = useState(false);
    const [embedType, setEmbedType] = useState<'standard' | 'autoplay'>('standard');

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const embedUrl = `${baseUrl}/view/${shareUuid}${embedType === 'autoplay' ? '?autoplay=true' : ''}`;

    const embedCode = `<iframe 
    src="${embedUrl}" 
    width="100%" 
    height="600px" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
></iframe>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-[var(--foreground)] italic tracking-tighter uppercase flex items-center gap-3">
                            <Code className="text-[var(--accent-primary)]" />
                            Embed Matrix
                        </h2>
                        <p className="text-[10px] font-bold text-[var(--foreground)]/80 uppercase tracking-widest mt-1 italic">Deploy the 3D Protocol to any landing page</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:text-[var(--foreground)] rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Configuration */}
                    <div className="p-6 bg-[var(--foreground)]/5 rounded-3xl border border-[var(--glass-border)] space-y-4">
                        <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-[0.2em] ml-2 font-mono">Behavior Configuration</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setEmbedType('standard')}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${embedType === 'standard' ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]' : 'bg-transparent text-[var(--foreground)]/80 border-[var(--glass-border)]'}`}
                            >
                                Standard View
                            </button>
                            <button
                                onClick={() => setEmbedType('autoplay')}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${embedType === 'autoplay' ? 'bg-[var(--accent-secondary)] text-white border-[var(--accent-secondary)]' : 'bg-transparent text-[var(--foreground)]/80 border-[var(--glass-border)]'}`}
                            >
                                Auto-Flip On Load
                            </button>
                        </div>
                    </div>

                    {/* Code Display */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-[0.2em] font-mono italic flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                                HTML Snippet
                            </label>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)] hover:text-[var(--foreground)] transition-colors"
                            >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? 'Copied' : 'Copy Snippet'}
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <pre className="relative w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-3xl p-6 text-[11px] font-mono text-[var(--foreground)]/80 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                {embedCode}
                            </pre>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-center gap-4">
                        <a
                            href={embedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/80 hover:text-[var(--accent-primary)] transition-all flex items-center gap-2"
                        >
                            <ExternalLink size={12} />
                            Preview Live Node
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
