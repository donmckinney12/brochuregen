"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

const industries = [
    {
        name: "Real Estate",
        id: "real-estate",
        icon: "🏠",
        description: "Turn property listings into high-end luxury brochures with automated floor plan integration.",
        accent: "from-amber-400 to-orange-600"
    },
    {
        name: "SaaS & Tech",
        id: "saas",
        icon: "💻",
        description: "Translate complex feature sets into clear, problem-solving collateral for enterprise buyers.",
        accent: "from-cyan-400 to-blue-600"
    },
    {
        name: "Education",
        id: "education",
        icon: "🎓",
        description: "Create professional curriculum overviews and campus guides from school web portals.",
        accent: "from-fuchsia-400 to-purple-600"
    }
];

export default function UseCasesPage() {
    return (
        <div className="min-h-screen text-[var(--foreground)] relative overflow-hidden bg-transparent">

            <Navbar />

            <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <span className="px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block border border-[var(--accent-primary)]/30 backdrop-blur-md">
                        Industry Sector Portal
                    </span>
                    <h1 className="text-7xl font-black mb-6 tracking-tighter glitch-text text-[var(--foreground)]">
                        Engineered for <span className="gradient-text">Vertical Growth</span>
                    </h1>
                    <p className="text-xl text-[var(--foreground)]/40 max-w-3xl mx-auto leading-relaxed font-medium">
                        Our neural engine is specifically calibrated for high-impact sectors. Select your sector to view optimized generation protocols.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {industries.map((industry, idx) => (
                        <Link key={idx} href={`/use-cases/${industry.id}`}>
                            <motion.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="premium-card p-1 bg-[var(--foreground)]/5 border-[var(--glass-border)] group cursor-pointer relative overflow-hidden h-[450px]"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${industry.accent} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity`}></div>

                                <div className="h-full p-10 flex flex-col justify-between relative z-10">
                                    <div>
                                        <div className="w-16 h-16 rounded-2xl bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center text-4xl mb-8 shadow-xl group-hover:border-[var(--foreground)]/20 transition-all">
                                            {industry.icon}
                                        </div>
                                        <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-4 group-hover:text-[var(--foreground)] transition-colors">{industry.name}</h3>
                                        <p className="text-[var(--foreground)]/40 text-sm leading-relaxed font-medium">
                                            {industry.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t border-[var(--glass-border)]">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">View Protocol</span>
                                        <span className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7"></path></svg>
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="mt-32 p-16 premium-card bg-[var(--foreground)]/[0.02] border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4">Request Industry Calibration</h3>
                        <p className="text-[var(--foreground)]/40 font-medium">Don't see your sector? Our engineering team can calibrate a custom neural layer for your specific industry requirements.</p>
                    </div>
                    <button className="px-12 py-5 bg-[var(--foreground)] text-[var(--background)] font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-[var(--accent-primary)] hover:scale-105 transition-all shadow-lg whitespace-nowrap">
                        Initialize Request
                    </button>
                </div>
            </main>
        </div>
    );
}
