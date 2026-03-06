"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-primary)]/30 selection:text-[var(--foreground)]">
            <Navbar />
            <div className="fixed inset-0 scanline opacity-20 pointer-events-none z-50"></div>

            {/* Hero Section */}
            <header className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-10 animate-in fade-in slide-in-from-bottom-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
                        </span>
                        Neural Multi-Frequency Grid
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-[var(--foreground)] mb-10 tracking-tighter italic uppercase animate-in fade-in slide-in-from-bottom-4 delay-100">
                        Synthesize your <br className="hidden md:block" />
                        <span className="gradient-text italic">Market Domination.</span>
                    </h1>

                    <p className="text-xl text-[var(--foreground)]/40 font-bold max-w-2xl mx-auto mb-16 leading-relaxed uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 delay-200">
                        BrochureGen merges advanced LLM clusters with high-fidelity visual nodes to manifest print-ready logic in milliseconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-8 justify-center animate-in fade-in slide-in-from-bottom-4 delay-300">
                        <Link
                            href="/signup"
                            className="px-12 py-5 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black text-[12px] uppercase tracking-[0.3em] hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                            INITIALIZE PROTOCOL
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-12 py-5 rounded-2xl bg-[var(--background)] border border-[var(--foreground)]/20 text-[var(--foreground)] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-[var(--foreground)]/5 transition-all"
                        >
                            VERIFY TIER
                        </Link>
                    </div>
                </div>
            </header>

            {/* Feature 1: AI Analysis */}
            <section className="py-32 px-6 border-y border-[var(--foreground)]/5 relative bg-[var(--background)]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 animate-in slide-in-from-left-8 fade-in duration-1000">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-primary)] mb-8">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 italic tracking-tighter uppercase">
                            Neural Data Extraction
                        </h2>
                        <p className="text-lg text-[var(--foreground)]/40 font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            Our LLM clusters deconstruct your digital footprint, identifying core conversion nodes and restructuring them for high-impact physical manifestations.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Synthesize punchy headlines from data streams",
                                "Auto-detect high-value benefit frequencies",
                                "Stabilize and replicate brand vocal signature",
                                "Purge navigational static and UI clutter"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[var(--foreground)]/60">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 premium-card p-1 bg-[var(--foreground)]/5 border-[var(--glass-border)] transform rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                        <div className="aspect-square rounded-[2rem] bg-[var(--background)] flex items-center justify-center relative overflow-hidden border border-[var(--glass-border)]">
                            <div className="absolute inset-0 scanline opacity-30"></div>
                            <div className="w-3/4 h-3/4 bg-[var(--foreground)]/5 rounded-2xl p-8 flex flex-col gap-6 relative z-10">
                                <div className="h-5 bg-[var(--accent-primary)]/20 rounded-lg w-3/4 animate-pulse"></div>
                                <div className="h-5 bg-[var(--accent-secondary)]/20 rounded-lg w-full animate-pulse delay-75"></div>
                                <div className="h-5 bg-[var(--accent-primary)]/20 rounded-lg w-5/6 animate-pulse delay-150"></div>
                                <div className="flex-1"></div>
                                <div className="h-12 bg-[var(--foreground)] text-[var(--background)] rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                                    SYNCHRONIZING...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2: Smart Layout */}
            <section className="py-32 px-6 bg-[var(--background)] relative">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[var(--accent-secondary)]/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative bg-[var(--foreground)]/5 rounded-[3rem] p-2 shadow-2xl border border-[var(--glass-border)] transform -rotate-2 hover:rotate-0 transition-all duration-700">
                            <div className="grid grid-cols-3 gap-3 h-80 p-6">
                                <div className="bg-[var(--background)] border border-[var(--accent-primary)]/20 rounded-2xl h-full shadow-[inset_0_0_20px_rgba(0,243,255,0.05)]"></div>
                                <div className="bg-[var(--background)] border border-[var(--accent-secondary)]/20 rounded-2xl h-full shadow-[inset_0_0_20px_rgba(255,0,255,0.05)]"></div>
                                <div className="bg-[var(--background)] border border-[var(--accent-tertiary)]/20 rounded-2xl h-full shadow-[inset_0_0_20px_rgba(255,191,0,0.05)]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="animate-in slide-in-from-right-8 fade-in duration-1000">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-secondary)] mb-8">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                        </div>
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 italic tracking-tighter uppercase">
                            Holographic Matrix Layout
                        </h2>
                        <p className="text-lg text-[var(--foreground)]/40 font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            Eliminate the concept of margins. Our engine auto-calibrates content across a standard 6-panel tri-fold matrix with mathematical precision.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Geometric placement of headlines and nodes",
                                "Optimal panel distribution: Protocol / Intake / Echo",
                                "Native 8.5\" x 11\" Letter Matrix Support",
                                "Dynamic UI whitespace calibration"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[var(--foreground)]/60">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_10px_var(--accent-secondary)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Feature 3: Export */}
            <section className="py-32 px-6 bg-[var(--background)] border-t border-[var(--foreground)]/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 animate-in slide-in-from-left-8 fade-in duration-1000">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-tertiary)] mb-8">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </div>
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 italic tracking-tighter uppercase">
                            High-Density Data Manifest
                        </h2>
                        <p className="text-lg text-[var(--foreground)]/40 font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            Extract high-resolution PDF manifests ready for immediate physical hardware manifestation or professional matrix printing.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "300 DPI High-Density Flux Output",
                                "CMYK Pure-Spectrum Color Calibration",
                                "Vectorized Typography for Infinite Clarity",
                                "Universal PDF Cross-Protocol Support"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[var(--foreground)]/60">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-tertiary)] shadow-[0_0_10px_var(--accent-tertiary)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 premium-card p-12 bg-[var(--foreground)]/5 border-[var(--glass-border)] transform rotate-1 hover:rotate-0 transition-transform duration-700 shadow-2xl flex justify-center">
                        <div className="w-56 bg-[var(--background)] shadow-2xl rounded-sm h-72 flex flex-col items-center justify-center gap-4 border border-[var(--glass-border)] relative overflow-hidden group">
                            <div className="absolute inset-0 scanline opacity-40"></div>
                            <div className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z"></path></svg>
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)]">MANIFEST.PDF</span>
                            <span className="text-[8px] font-black text-[var(--foreground)]/20 uppercase tracking-widest">SIZE: 2.4 MB</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
