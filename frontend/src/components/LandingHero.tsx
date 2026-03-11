"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ChevronRight, Shield, Zap, Building2, Globe2, BarChart3, Briefcase, CheckCircle2, Star, ArrowRight } from 'lucide-react';

export default function LandingHero() {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
            {/* Elegant Enterprise Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,var(--accent-primary)/0.05,transparent_50%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center space-y-12">

                    {/* Enterprise Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl"
                    >
                        <Shield className="text-[var(--accent-primary)]" size={16} />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--foreground)]/60">Enterprise Marketing Protocol v4.0</span>
                        <div className="w-px h-4 bg-white/10 mx-2" />
                        <div className="flex items-center gap-1.5">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-bold text-[var(--foreground)]/80">Leading Authority</span>
                        </div>
                    </motion.div>

                    {/* High-Authority Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8 max-w-5xl"
                    >
                        <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-[var(--foreground)] tracking-[calc(-0.04em)] uppercase leading-[0.8] italic">
                            Automate Your <br />
                            <span className="bg-gradient-to-br from-[var(--foreground)] via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Brand Scale</span>
                        </h1>
                        <p className="text-xl sm:text-2xl font-bold text-[var(--foreground)]/40 max-w-3xl mx-auto tracking-tight leading-relaxed uppercase italic">
                            The autonomous creative engine for global marketing teams. Deploy high-fidelity collateral across every channel with infinite precision and zero manual overhead.
                        </p>
                    </motion.div>

                    {/* Enterprise CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
                    >
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto px-14 py-7 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent-primary)] hover:text-white rounded-2xl font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-4 group shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
                        >
                            Launch Studio
                            <Rocket size={24} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                        <Link
                            href="/enterprise"
                            className="w-full sm:w-auto px-14 py-7 bg-white/[0.03] hover:bg-white/[0.08] text-[var(--foreground)] border border-white/10 rounded-2xl font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-3 group"
                        >
                            Contact Sales
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Trust Indicators / Social Proof Ticker */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="pt-16 w-full space-y-10"
                    >
                        <div className="flex flex-wrap items-center justify-center gap-12 font-black uppercase tracking-[0.3em] text-[10px] text-[var(--foreground)]/20 italic">
                            <div className="flex items-center gap-3 group hover:text-[var(--accent-primary)] transition-colors">
                                <CheckCircle2 size={16} /> SOC2 Compliant
                            </div>
                            <div className="flex items-center gap-3 group hover:text-[var(--accent-primary)] transition-colors">
                                <CheckCircle2 size={16} /> GDPR Certified
                            </div>
                            <div className="flex items-center gap-3 group hover:text-[var(--accent-primary)] transition-colors">
                                <CheckCircle2 size={16} /> ISO 27001 Ready
                            </div>
                        </div>

                        <div className="relative overflow-hidden py-12 border-y border-white/5 bg-white/[0.01]">
                            <div className="flex items-center justify-center flex-wrap gap-x-20 gap-y-10 opacity-30 grayscale saturate-0 hover:grayscale-0 hover:saturate-100 transition-all duration-1000">
                                <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic"><Building2 size={32} /> TECHCORP</div>
                                <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic"><Globe2 size={32} /> GLOBAL_INTEL</div>
                                <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic"><BarChart3 size={32} /> NEXUS_CAPITAL</div>
                                <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic"><Briefcase size={32} /> STRAT_V_OPS</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* High-Tech Ambient Ornament */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none"
                    />
                </div>
            </div>
        </section>
    );
}
