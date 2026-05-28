"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Globe, Loader2, ArrowRight, ZapOff } from 'lucide-react';
import { API_URL } from '@/config';
import NeuralLoading from './ContentLoading';
import ThreeDBrochure from './ThreeDBrochure';
import Link from 'next/link';

export default function ProductDemo() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleGenerateDemo = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setData(null);

        try {
            const res = await fetch(`${API_URL}/api/v1/scrape/demo-scrape`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, is_campaign: false, layout_theme: 'modern', tone: 'professional' }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Generation failed');
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Service communication failure');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 relative overflow-hidden" id="demo">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-secondary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-secondary)]"></span>
                        </span>
                        <span className="text-[var(--accent-secondary)] font-black uppercase tracking-[0.2em] text-[10px]">Live Interactive Demo</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-[var(--foreground)] uppercase italic tracking-tighter">
                        Try It <span className="gradient-text">Yourself</span>
                    </h2>
                </div>

                <div className="relative aspect-[16/12] md:aspect-video w-full rounded-[2rem] border border-white/10 bg-[var(--glass-bg)] backdrop-blur-2xl shadow-2xl overflow-hidden premium-card p-4 sm:p-8 flex flex-col items-center justify-center">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-30 pointer-events-none" />

                    {!data && !loading && (
                        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
                            <div className="relative flex items-center bg-black/50 border border-[var(--accent-primary)]/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(99,102,241,0.2)] focus-within:shadow-[0_0_50px_rgba(99,102,241,0.4)] focus-within:border-[var(--accent-primary)] transition-all overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent opacity-50" />
                                <Globe className="text-white/40 group-focus-within:text-[var(--accent-primary)] mr-4 relative z-10 transition-colors" size={24} />
                                <input 
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="ENTER YOUR WEBSITE URL"
                                    className="flex-1 bg-transparent text-xl sm:text-2xl font-bold text-white uppercase tracking-widest placeholder:text-white/20 outline-none relative z-10"
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateDemo()}
                                />
                                <button 
                                    onClick={handleGenerateDemo}
                                    disabled={!url}
                                    className="relative z-10 ml-4 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all bg-[var(--accent-primary)] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    Generate
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                Note: This public demo is limited to 3000 characters and basic layout structures.
                            </p>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-4"
                                    >
                                        <ZapOff className="text-red-500" />
                                        <p className="text-red-500 font-bold text-xs uppercase tracking-widest">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--background)]">
                            <NeuralLoading />
                        </div>
                    )}

                    {data && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--glass-bg)] backdrop-blur-md animate-in fade-in duration-1000 overflow-hidden">
                            <div className="w-full h-full max-w-4xl scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 transition-transform origin-center">
                                <ThreeDBrochure
                                    data={{ ...data, layout_theme: 'modern' }}
                                    onOpenRefiner={() => {}}
                                    onUpdate={() => {}}
                                    showHeatmap={false}
                                />
                            </div>

                            {/* Conversion Overlay */}
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2, duration: 1 }}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 p-6 bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center space-y-4 max-w-md w-full"
                            >
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Synthesis Complete</h3>
                                <p className="text-xs text-white/60 uppercase tracking-widest font-bold">
                                    Create a free account to edit text, change themes, download high-res PDFs, and deploy to the web.
                                </p>
                                <div className="flex flex-col gap-2 pt-2">
                                    <Link 
                                        href="/login" 
                                        className="w-full py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                    >
                                        Claim Your Brochure
                                    </Link>
                                    <button 
                                        onClick={() => setData(null)} 
                                        className="w-full py-3 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all"
                                    >
                                        Try Another URL
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
