"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Cpu, Layers, ShieldCheck, ArrowRight, MousePointer2, Settings, Zap } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            title: "Asset Ingestion",
            description: "Provide any source URL. Our neural cluster extracts brand DNA, visual logic, and core USP clusters with institutional security.",
            icon: <Globe size={28} className="text-[var(--accent-primary)]" />,
            tag: "Protocol One"
        },
        {
            title: "Cognitive Synthesis",
            description: "Proprietary design models orchestrate multi-page layouts and high-conversion copy optimized for professional design resonance.",
            icon: <Cpu size={28} className="text-[var(--accent-secondary)]" />,
            tag: "Protocol Two"
        },
        {
            title: "Enterprise Deployment",
            description: "Instant high-fidelity export in vector-perfect PDF or interactive web formats, ready for global distribution and print.",
            icon: <Layers size={28} className="text-[var(--accent-tertiary)]" />,
            tag: "Protocol Three"
        }
    ];

    return (
        <section className="py-32 relative overflow-hidden bg-white/[0.01] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                    >
                        <Settings size={12} className="text-[var(--foreground)]/40 animate-spin-slow" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40 text-center">Operational Pipeline</span>
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl font-black text-[var(--foreground)] uppercase italic tracking-tighter text-center">
                        Seamless <span className="text-[var(--accent-primary)]">Governance</span> Control
                    </h2>
                    <p className="max-w-lg mx-auto text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 text-center">
                        Synthesizing high-fidelity marketing assets at machine speed.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                    {/* Animated Connection Bridge (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative flex flex-col items-center text-center space-y-8"
                        >
                            <div className="relative">
                                {/* Orbital Node */}
                                <div className="w-24 h-24 rounded-[2.5rem] bg-black/60 border border-white/10 backdrop-blur-2xl flex items-center justify-center shadow-2xl group-hover:border-[var(--accent-primary)]/40 transition-all duration-500 relative z-10">
                                    {step.icon}
                                    <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="absolute -inset-4 bg-[var(--accent-primary)]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-4 py-1 rounded-full z-20 shadow-xl">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{step.tag}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--foreground)]">{step.title}</h3>
                                <p className="text-xs font-bold text-[var(--foreground)]/40 leading-relaxed uppercase tracking-tighter italic max-w-[280px]">
                                    {step.description}
                                </p>
                            </div>

                            {index !== 2 && (
                                <div className="hidden lg:flex absolute -right-6 top-12 items-center text-white/10">
                                    <ArrowRight size={24} className="animate-pulse" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Final Call to Protocol */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-32 p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
                >
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-[var(--accent-primary)]/10 rounded-2xl">
                            <ShieldCheck size={32} className="text-[var(--accent-primary)]" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-black uppercase italic tracking-tight text-[var(--foreground)]">Governance First Infrastructure</h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30">Enterprise-grade stability for global marketing clusters.</p>
                        </div>
                    </div>
                    <Link
                        href="/enterprise"
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60 hover:text-[var(--accent-primary)] transition-all group"
                    >
                        Review Security Protocol
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
