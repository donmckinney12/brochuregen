"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Wand2, Box, FileDown, ShieldCheck, Zap, Database, Cpu, Layers, Link2 } from 'lucide-react';

export default function FeatureShowcase() {
    const features = [
        {
            title: "Brand DNA Analysis",
            description: "Advanced heuristics extract core brand identity, typography, and visual logic from your existing web presence.",
            icon: <Database className="text-cyan-400" size={32} />,
            color: "bg-cyan-500/5 border-cyan-500/10"
        },
        {
            title: "Scalable Synthesis",
            description: "Enterprise-grade design models orchestrate professional-tier layouts optimized for high-conversion outcomes.",
            icon: <Cpu className="text-indigo-400" size={32} />,
            color: "bg-indigo-500/5 border-indigo-500/10"
        },
        {
            title: "Global Asset Sync",
            description: "Instantly distribute design protocols across teams with real-time central updates and design-system alignment.",
            icon: <Link2 className="text-pink-400" size={32} />,
            color: "bg-pink-500/5 border-pink-500/10"
        },
        {
            title: "High-Fidelity Export",
            description: "Vector-perfect PDF and web-optimized exports with full support for print-ready specifications and CMYK logic.",
            icon: <Layers className="text-emerald-400" size={32} />,
            color: "bg-emerald-500/5 border-emerald-500/10"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 shadow-sm"
                    >
                        <ShieldCheck size={12} className="text-[var(--accent-primary)]" />
                        <span className="text-[var(--accent-primary)] font-black uppercase tracking-[0.2em] text-[8px]">Core Infrastructure</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black text-[var(--foreground)] uppercase leading-tight tracking-tighter"
                    >
                        Built for <span className="text-[var(--accent-primary)]">Infinite</span> Scale
                    </motion.h2>
                    <p className="text-[var(--foreground)]/40 font-bold max-w-xl mx-auto uppercase tracking-widest text-[10px]">
                        Our autonomous design pipes handle millions of requests with millisecond latency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group premium-card p-12 space-y-8 ${feature.color} border transition-all duration-500 hover:border-[var(--accent-primary)]/30 hover:bg-white/[0.03] backdrop-blur-3xl`}
                        >
                            <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-[var(--accent-primary)]/10 transition-all duration-500">
                                {feature.icon}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-black uppercase text-[var(--foreground)] tracking-tight">{feature.title}</h3>
                                <p className="text-sm font-bold text-[var(--foreground)]/40 leading-relaxed uppercase tracking-tighter italic">
                                    {feature.description}
                                </p>
                            </div>
                            <div className="pt-4 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[var(--foreground)]/20 group-hover:text-[var(--accent-primary)] transition-colors">
                                <Zap size={10} /> Syncing Active
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Professional Grid Background */}
            <div className="absolute inset-0 -z-10 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        </section>
    );
}
