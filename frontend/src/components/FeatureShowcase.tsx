"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Wand2, Box, FileDown, ShieldCheck, Zap } from 'lucide-react';

export default function FeatureShowcase() {
    const features = [
        {
            title: "Neural Web Crawl",
            description: "Deep-scanning algorithm identifies brand identity, key USP data, and visual aesthetics from any source URL.",
            icon: <Globe className="text-cyan-400" size={32} />,
            color: "bg-cyan-500/10 border-cyan-500/20"
        },
        {
            title: "AI Creative Synthesis",
            description: "Advanced LLMs orchestrate high-converting copy and professional layouts optimized for impact.",
            icon: <Wand2 className="text-indigo-400" size={32} />,
            color: "bg-indigo-500/10 border-indigo-500/20"
        },
        {
            title: "3D Perspective Render",
            description: "Real-time spatial visualization allows you to interact with your brochure in a fully immersive 3D field.",
            icon: <Box className="text-pink-400" size={32} />,
            color: "bg-pink-500/10 border-pink-500/20"
        },
        {
            title: "Print-Ready Export",
            description: "Instant high-fidelity PDF generation with CMYK support and professional bleed margins.",
            icon: <FileDown className="text-emerald-400" size={32} />,
            color: "bg-emerald-500/10 border-emerald-500/20"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[var(--accent-primary)] font-black uppercase tracking-[0.4em] text-xs italic"
                    >
                        The Architecture of Impact
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black text-[var(--foreground)] uppercase leading-tight italic tracking-tighter"
                    >
                        Autonomous <span className="text-[var(--accent-primary)]">Design</span> Systems
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group premium-card p-10 space-y-6 flex flex-col items-center text-center ${feature.color} border hover:border-[var(--accent-primary)]/40 hover:-translate-y-2 transition-all duration-500`}
                        >
                            <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">{feature.title}</h3>
                            <p className="text-sm font-bold text-[var(--foreground)]/60 leading-relaxed tracking-tight italic">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/5 to-transparent blur-[120px] -z-10" />
        </section>
    );
}
