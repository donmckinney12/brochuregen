"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ChevronRight, Sparkles, Zap } from 'lucide-react';

export default function LandingHero() {
    return (
        <section className="relative pt-20 pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--accent-secondary)]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <div className="space-y-10 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-black text-[10px] uppercase tracking-[0.2em] italic"
                    >
                        <Zap size={14} className="animate-pulse" />
                        Next-Gen Marketing Protocol Active
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-6"
                    >
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-[0.9]">
                            Neural <span className="bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent">Brochure</span> Logic
                        </h1>
                        <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]/60 max-w-xl mx-auto lg:mx-0 tracking-tight">
                            Synthesize any URL into a professional, print-ready PDF in seconds using our proprietary creative engine.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                    >
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-10 py-5 bg-[var(--foreground)] hover:bg-[var(--accent-primary)] text-[var(--background)] hover:text-white rounded-[2rem] font-black uppercase tracking-widest italic shadow-2xl transition-all flex items-center justify-center gap-3 group"
                        >
                            <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
                            Initialize Studio
                        </Link>
                        <Link
                            href="#templates"
                            className="w-full sm:w-auto px-10 py-5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)] border border-[var(--glass-border)] rounded-[2rem] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2"
                        >
                            Explore Matrix
                            <ChevronRight size={18} />
                        </Link>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="flex items-center justify-center lg:justify-start gap-12 pt-8 border-t border-[var(--glass-border)]"
                    >
                        <div>
                            <p className="text-3xl font-black italic tracking-tighter text-[var(--foreground)]">48k+</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/40">Neural Syncs</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black italic tracking-tighter text-[var(--foreground)]">99%</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/40">Design Resonance</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black italic tracking-tighter text-[var(--foreground)]">2.4s</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/40">Avg Synthesis</p>
                        </div>
                    </motion.div>
                </div>

                {/* Visual Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative group perspective-[2000px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative premium-card p-2 rounded-[3rem] border-[var(--glass-border)] bg-white/5 backdrop-blur-3xl glow-on-hover">
                        <img
                            src="/premium_brochure_showcase_1773186037524.png"
                            alt="Neural Brochure Showcase"
                            className="rounded-[2.8rem] shadow-2xl brightness-110 group-hover:scale-[1.02] transition-transform duration-700"
                        />
                        {/* Floating Micro-UI elements */}
                        <div className="absolute -top-10 -right-10 p-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl backdrop-blur-2xl shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-500/20 rounded-xl">
                                    <Sparkles className="text-emerald-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] opacity-40">Auto-Creative</p>
                                    <p className="text-sm font-bold text-[var(--foreground)]">Synthesis Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
