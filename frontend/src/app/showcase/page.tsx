"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ShowcasePage() {
    const examples = [
        { title: "Gourmet Garden Bistro", category: "Restaurant", url: "gourmetgarden.com", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
        { title: "Luxe Realty Group", category: "Real Estate", url: "luxerealty.com", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" },
        { title: "Zenith Tech Solutions", category: "Software", url: "zenithtech.io", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
        { title: "Bloom & Stem Florist", category: "Retail", url: "bloomandstem.com", img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80" },
        { title: "Everest Fitness Hub", category: "Health & Wellness", url: "everestfitness.com", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" },
        { title: "Stellar Law Firm", category: "Professional Services", url: "stellarlaw.com", img: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80" },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden transition-colors duration-500">
            {/* Background Layers - Solarized Genesis */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[var(--background)]" />
                <div className="absolute inset-0 mesh-gradient opacity-20" />
                <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-[var(--accent-primary)]/10 via-[var(--accent-secondary)]/5 to-transparent blur-[120px] opacity-40"></div>
                <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
            </div>

            <Navbar />

            <main className="pt-40 pb-32 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-32 animate-in slide-in-from-top-4 fade-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-blue-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Community Intelligence
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black mb-8 text-[var(--foreground)] tracking-tighter italic uppercase leading-[0.95]">
                        Community <br />
                        <span className="gradient-text">Showcase matrix.</span>
                    </h1>
                    
                    <p className="text-lg text-[var(--foreground)]/50 font-bold max-w-2xl mx-auto mb-16 italic leading-relaxed uppercase tracking-widest">
                        Observe the high-fidelity synthesis of global branding. <br />
                        Institutional-grade brochures for every industry node.
                    </p>

                    <Link href="/signup" className="group px-12 py-6 bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all outline outline-offset-4 outline-transparent hover:outline-[var(--foreground)]/20 inline-flex items-center gap-4">
                        Initialize Own Build
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {examples.map((item, idx) => (
                        <div key={idx} className="premium-card group bg-[var(--card-bg)] border-[var(--glass-border)] hover:border-blue-500/30 overflow-hidden">
                            <div className="h-64 overflow-hidden relative">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <span className="px-4 py-1.5 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                                        {item.category} Node
                                    </span>
                                </div>
                            </div>
                            <div className="p-10 space-y-6">
                                <h3 className="text-3xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-none">{item.title}</h3>
                                
                                <div className="flex items-center gap-3 text-[var(--foreground)]/40 text-[10px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    {item.url}
                                </div>
                                
                                <p className="text-[var(--foreground)]/60 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                                    Full-spectrum branding synthesis deployed via BrochureGen neural engine.
                                </p>

                                <button className="w-full py-5 bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border-b-4 border-[var(--background)]/20 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                    Examine Full Asset
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Call to Action Matrix */}
                <div className="mt-40 max-w-5xl mx-auto p-24 premium-card bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10 border-[var(--glass-border)] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -ml-64 -mb-64 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>

                    <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-12 relative z-10 italic tracking-tighter uppercase leading-tight">
                        Join the <br /> <span className="gradient-text">Creator Collective.</span>
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
                        <Link href="/signup" className="w-full md:w-auto px-16 py-6 bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            Initialize Protocol
                        </Link>
                        <Link href="/enterprise" className="w-full md:w-auto px-16 py-6 bg-white/10 backdrop-blur-3xl border border-[var(--foreground)]/10 text-[var(--foreground)] font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] hover:bg-white/20 transition-all">
                            Institutional Access
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
