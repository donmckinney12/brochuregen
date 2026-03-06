"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function RoadmapPage() {
    const roadmapItems = [
        {
            status: "In Progress",
            title: "Multi-language Support",
            description: "Generate brochures in over 20 languages with native AI localization.",
            votes: 142,
            icon: "🌐"
        },
        {
            status: "Next",
            title: "Template Editor",
            description: "Drag-and-drop editor to customize the layout and design of your PDF brochures.",
            votes: 284,
            icon: "🎨"
        },
        {
            status: "Planned",
            title: "Team Collaboration",
            description: "Invite team members and share brochures across your organization.",
            votes: 95,
            icon: "👥"
        },
        {
            status: "Investigating",
            title: "Direct Social Mailing",
            description: "Automatically post your brochures to LinkedIn, Facebook, and Instagram.",
            votes: 110,
            icon: "📱"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 mesh-gradient opacity-20" />
                <div className="absolute inset-0 animate-aurora opacity-10" />
                <div className="scanline" />
            </div>

            <Navbar />

            <main className="pt-40 pb-20 px-6 max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <span className="px-4 py-1.5 rounded-full bg-cyan-900/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block border border-cyan-500/30 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block mr-2 animate-pulse" />
                        Protocol: What's Coming
                    </span>
                    <h1 className="text-6xl font-black mb-6 tracking-tighter glitch-text">
                        Product <span className="gradient-text">Roadmap</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        See what we're building and vote on the features that matter most to you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {roadmapItems.map((item, idx) => (
                        <div key={idx} className="premium-card p-10 bg-black/40 border-white/5 hover:border-cyan-500/30 flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{item.icon}</div>
                                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${item.status === 'In Progress' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' :
                                        item.status === 'Next' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                            'bg-white/5 text-slate-400 border-white/10'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-10 text-sm font-medium">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                                    <span className="font-black text-white text-sm tracking-tight text-glow">{item.votes} VOTES</span>
                                </div>
                                <button className="px-6 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-widest border border-cyan-500/30 hover:bg-cyan-500 hover:text-black transition-all shadow-lg hover:shadow-cyan-500/20">
                                    UPVOTE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-slate-500 mb-6 font-medium">Have a feature request that isn't here?</p>
                    <Link href="/contact" className="text-cyan-400 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center justify-center gap-2 group">
                        Suggest a feature <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
