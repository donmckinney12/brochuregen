"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ChevronRight, Sparkles, Zap, Shield, MousePointer2, Layers, Cpu, CheckCircle2 } from 'lucide-react';

export default function LandingHero() {
    return (
        <section className="relative pt-20 pb-24 overflow-hidden">
            {/* Core Background Engine */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,var(--accent-primary)/0.03,transparent_60%)]" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Primary Messaging Node - Column 1-7 */}
                    <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[var(--background)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/60">48k+ Protocols Synthesized</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-[0.9] lg:max-w-2xl">
                                URL into <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Creative</span> <br />
                                <span className="text-[var(--foreground)]/80">Asset in Seconds</span>
                            </h1>
                            <p className="text-lg sm:text-xl font-bold text-[var(--foreground)]/40 max-w-xl mx-auto lg:mx-0 tracking-tight italic leading-relaxed">
                                Our autonomous design engine extracts brand DNA and generates print-ready marketing collateral with zero manual overhead.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-10 py-5 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent-primary)] hover:text-white rounded-[2rem] font-black uppercase tracking-widest italic shadow-2xl transition-all flex items-center justify-center gap-3 group"
                            >
                                <Rocket size={18} className="group-hover:rotate-12 transition-transform" />
                                Launch Design Studio
                            </Link>
                            <Link
                                href="#templates"
                                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-[var(--foreground)] border border-white/10 rounded-[2rem] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2 group"
                            >
                                View Matrix
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Feature Tickers */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-10"
                        >
                            {[
                                { icon: <Shield size={12} />, text: "Enterprise Grade" },
                                { icon: <Zap size={12} />, text: "Instant Synthesis" },
                                { icon: <CheckCircle2 size={12} />, text: "Vector Output" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30 group hover:text-[var(--accent-primary)] transition-colors">
                                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-[var(--accent-primary)]/30">
                                        {item.icon}
                                    </div>
                                    {item.text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Compact Visual Composition - Column 8-12 */}
                    <div className="lg:col-span-5 relative lg:pl-10">
                        <div className="relative group">
                            {/* Glow Background */}
                            <div className="absolute -inset-10 bg-gradient-to-tr from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />

                            {/* The "Proportional" Card Stack */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative z-20 perspective-[2000px]"
                            >
                                <div className="premium-card p-1.5 rounded-[2.5rem] border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                                    <div className="aspect-[4/5] rounded-[2.2rem] overflow-hidden relative">
                                        <img
                                            src="/hero-showcase.png"
                                            alt="Sleek Output"
                                            className="h-full w-full object-cover brightness-105 group-hover:scale-105 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                    </div>

                                    {/* Autonomous Micro-Module Overlay */}
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute -right-8 top-1/4 p-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl space-y-3 z-30 w-40"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center">
                                                <Sparkles size={10} className="text-emerald-400" />
                                            </div>
                                            <span className="text-[8px] font-black uppercase text-white/40">AI Score</span>
                                            <span className="text-[8px] font-black text-emerald-400 ml-auto">99.2%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ width: ["100%", "92%", "100%"] }}
                                                className="h-full bg-emerald-500/50"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Status Indicator */}
                                    <div className="absolute -left-6 bottom-1/4 p-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl shadow-xl z-30">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                                            <span className="text-[7px] font-black uppercase tracking-widest text-white/60">Matrix Synced</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative Floating Logic */}
                            <motion.div
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    y: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 8, repeat: Infinity }}
                                className="absolute -bottom-10 -right-4 w-24 h-24 bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent rounded-3xl blur-2xl -z-10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
