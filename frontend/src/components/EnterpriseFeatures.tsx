"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Zap, BarChart3, CheckCircle2, Layout, RefreshCw } from 'lucide-react';

export default function EnterpriseFeatures() {
    const features = [
        {
            title: "Brand Integrity",
            description: "Maintain perfect visual consistency across all regional offices. Our AI automatically adapts designs while strictly adhering to your core brand guidelines.",
            icon: <Shield className="text-[var(--accent-primary)]" size={24} />,
            detail: "Zero Drift Enforcement"
        },
        {
            title: "Dynamic Content Sync",
            description: "Update your product data once and see it reflected across all marketing materials instantly. Eliminate manual editing errors and outdated collateral.",
            icon: <RefreshCw className="text-[var(--accent-secondary)]" size={24} />,
            detail: "Real-time Asset Update"
        },
        {
            title: "Global Localization",
            description: "Launch in new markets faster. Our platform doesn't just translate text; it culturally adapts layouts and imagery for maximum local resonance.",
            icon: <Globe className="text-[var(--accent-tertiary)]" size={24} />,
            detail: "AI-Powered Adaptation"
        },
        {
            title: "Strategic Analytics",
            description: "Gain deep visibility into how your brochures perform. Track digital engagement, conversion rates, and print distribution efficiency in one dashboard.",
            icon: <BarChart3 className="text-emerald-400" size={24} />,
            detail: "Conversion Optimized"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                    >
                        <Layout size={12} className="text-[var(--accent-primary)]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--foreground)]/40">Enterprise Capabilities</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
                        Powering Global <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Marketing Operations</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-[var(--foreground)]/60">
                        Beyond simple design—BrochureGen provides the infrastructure for consistent, data-driven brand storytelling at an institutional scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-10 premium-card relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <div className="scale-[4] origin-top-right">
                                    {feature.icon}
                                </div>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--accent-primary)]/10 transition-all duration-500">
                                    {feature.icon}
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">{feature.title}</h3>
                                    <p className="text-[var(--foreground)]/60 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/30 group-hover:text-[var(--accent-primary)] transition-colors">
                                    <CheckCircle2 size={12} /> {feature.detail}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
