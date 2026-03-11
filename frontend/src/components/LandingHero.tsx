"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ChevronRight, Sparkles, Zap, Shield, MousePointer2, Layers, Cpu, CheckCircle2, Building2, Briefcase, BarChart3, Globe2 } from 'lucide-react';

export default function LandingHero() {
    return (
        <section className="relative pt-24 pb-20 overflow-hidden">
            {/* Professional Ambient Layer */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,var(--accent-primary)/0.02,transparent_40%)]" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* Messaging Node */}
                    <div className="lg:col-span-7 space-y-12 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                        >
                            <Shield className="text-[var(--accent-primary)]" size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/60">Enterprise Marketing Automation Platform</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-8"
                        >
                            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-[var(--foreground)] tracking-tighter uppercase leading-[0.85] lg:max-w-3xl">
                                Scale Your <br />
                                <span className="text-[var(--accent-primary)]">Brand DNA</span> <br />
                                <span className="text-[var(--foreground)]/40">Autonomously</span>
                            </h1>
                            <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]/50 max-w-2xl mx-auto lg:mx-0 tracking-tight leading-relaxed">
                                Deploy high-fidelity marketing collateral across every channel with a single source URL. Professional design, zero manual effort.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
                        >
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-12 py-6 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent-primary)] hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                            >
                                <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
                                Launch Design Studio
                            </Link>
                            <Link
                                href="/enterprise"
                                className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-[var(--foreground)] border border-white/10 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                            >
                                Contact Sales
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Enterprise Trust Ribbon */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-12 space-y-6"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/20">Powering Modern Marketing Teams</p>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-12 gap-y-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                                <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Building2 size={24} /> TECHCORP</div>
                                <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Globe2 size={24} /> GLOBAL_X</div>
                                <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><BarChart3 size={24} /> NEXUS_FINANCE</div>
                                <div className="flex items-center gap-2 font-black text-xl tracking-tighter"><Briefcase size={24} /> STRAT_SYS</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Proportional Dashboard Preview - Column 8-12 */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Glow Effect */}
                            <div className="absolute -inset-10 bg-[var(--accent-primary)]/10 blur-[100px] rounded-full" />

                            <div className="relative premium-card p-2 rounded-[2.5rem] border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
                                <div className="aspect-[4/5] rounded-[2.2rem] overflow-hidden relative group">
                                    <img
                                        src="/hero-showcase.png"
                                        alt="Enterprise Output"
                                        className="h-full w-full object-cover brightness-105 group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                    {/* Action Module */}
                                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Protocol Status</p>
                                            <p className="text-xs font-bold text-white uppercase tracking-tighter">Asset Synchronized</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                            <CheckCircle2 size={18} className="text-emerald-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Metric Card */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    className="absolute -right-6 top-1/4 p-5 bg-[var(--glass-bg)] border border-white/10 rounded-2xl shadow-2xl space-y-4 w-44 backdrop-blur-2xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <Cpu size={14} className="text-[var(--accent-primary)]" />
                                        <span className="text-[8px] font-black uppercase text-[var(--foreground)]/40 tracking-widest">Synthesis active</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold italic">
                                            <span className="text-[var(--foreground)]/60">Resonance</span>
                                            <span className="text-[var(--accent-primary)]">99.4%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[94%] bg-[var(--accent-primary)]" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
