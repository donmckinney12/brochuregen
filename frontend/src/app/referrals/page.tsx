"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function ReferralPage() {
    const { user } = useAuth();
    const referralCode = user?.id?.substring(0, 8).toUpperCase() || "SYNC-BETA";
    const referralLink = `https://brochuregen.com/signup?ref=${referralCode}`;

    const stats = [
        { label: "Successful Syncs", value: "0" },
        { label: "Credits Earned", value: "0" },
        { label: "Network Growth", value: "0%" }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        alert("Referral Protocol Copied to Clipboard");
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 mesh-gradient opacity-20" />
                <div className="scanline" />
            </div>

            <Navbar />

            <main className="pt-40 pb-20 px-6 max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <span className="px-4 py-1.5 rounded-full bg-amber-900/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block border border-amber-500/30 backdrop-blur-md">
                        Network Expansion Protocol
                    </span>
                    <h1 className="text-6xl font-black mb-6 tracking-tighter glitch-text">
                        Refer <span className="gradient-text">a Node</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Expand the neural network. Every successful node synchronization rewards you with high-bandwidth generation credits.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="premium-card p-8 bg-black/40 border-white/5 text-center">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                            <p className="text-4xl font-black italic tracking-tighter text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="premium-card p-12 bg-white/[0.02] border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-1000"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-4xl mb-10 shadow-glow">
                            🤝
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-4">Your Referral Link</h2>
                        <p className="text-slate-400 mb-10 max-w-md font-medium">Share this synchronized link with your network. Earn <span className="text-cyan-400 font-bold italic">5 Credits</span> for every user who completes their first generation.</p>

                        <div className="w-full max-w-2xl flex flex-col md:flex-row items-stretch gap-4">
                            <div className="flex-1 bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-between group/input hover:border-white/20 transition-all">
                                <span className="font-mono text-xs text-white/60 truncate mr-4 italic uppercase tracking-wider">{referralLink}</span>
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/5 px-3 py-1.5 rounded-lg border border-cyan-400/20">{referralCode}</span>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95 whitespace-nowrap"
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="premium-card p-10 border-white/5 bg-black/40">
                        <h3 className="text-lg font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs">01</span>
                            Share Link
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium italic border-l-2 border-white/5 pl-6">
                            Distribute your unique neural identifier via encrypted or public channels.
                        </p>
                    </div>
                    <div className="premium-card p-10 border-white/5 bg-black/40">
                        <h3 className="text-lg font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-xs">02</span>
                            Reward Sync
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium italic border-l-2 border-white/5 pl-6">
                            Once the node initializes their first generation protocol, your credits will sync automatically.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
