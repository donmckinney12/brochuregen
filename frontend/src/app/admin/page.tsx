"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [neuralHealth, setNeuralHealth] = useState(99.4);
    const [stats, setStats] = useState([
        { label: "Total Nodes", value: "1,284", change: "+12%", color: "cyan" },
        { label: "Synthesis Rate", value: "4,520", change: "+8%", color: "emerald" },
        { label: "AI Pulse", value: "8,492", change: "+15%", color: "indigo" },
        { label: "Resonance", value: "3.2%", change: "+0.5%", color: "rose" },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNeuralHealth(prev => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (user?.email !== 'don@mckinney.com') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
                <div className="border border-red-500/20 bg-red-500/5 p-12 rounded-[3rem] text-center max-w-md backdrop-blur-3xl">
                    <div className="text-6xl mb-6 animate-pulse">🚫</div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-red-500 mb-4">Access Restricted</h2>
                    <p className="text-red-500/40 text-[10px] uppercase tracking-[0.2em] mb-12">Unauthorized biometric signature detected. Protocol lockdown imminent.</p>
                    <a href="/dashboard" className="inline-block px-8 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full">Return to Dashboard</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-cyan-500/30 overflow-hidden relative">
            <Navbar />

            {/* Background Data Matrix */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.2),transparent_70%)]" />
                <div className="grid grid-cols-24 h-full w-full">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="border-r border-white/5 h-full" />
                    ))}
                </div>
            </div>

            <main className="relative pt-32 pb-20 px-6 max-w-[1600px] mx-auto z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 border-b border-white/10 pb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Primary Command Node</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">Admin <span className="gradient-text">Matrix</span></h1>
                    </div>

                    <div className="flex items-center gap-8 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                        <div className="text-right">
                            <span className="block text-[8px] text-white/20 font-black uppercase tracking-[0.2em] mb-1">Neural Health Status</span>
                            <span className="text-3xl font-black text-cyan-400 italic tracking-tighter">{neuralHealth}%</span>
                        </div>
                        <div className="w-24 h-12 bg-white/5 rounded-xl overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="flex-1 bg-cyan-500/40 rounded-full animate-pulse" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-time Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group backdrop-blur-md"
                        >
                            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">{stat.label}</h3>
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black italic tracking-tighter">{stat.value}</span>
                                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{stat.change}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Simulated Data Feed */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden backdrop-blur-md">
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                            <h3 className="font-black italic tracking-tighter uppercase text-xl">Active Neural Streams</h3>
                            <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-white/20">
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SYNCED</span>
                                <span className="flex items-center gap-2 relative">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping absolute top-0.5 -left-3" />
                                    LIVE MONITOR
                                </span>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            {[1, 2, 3, 4, 5, 6].map((u) => (
                                <div key={u} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">ID{u}</div>
                                        <div>
                                            <p className="font-black uppercase tracking-[0.1em] text-xs">Node_{u * 4421}</p>
                                            <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em]">{u % 2 === 0 ? 'Synthesis Active' : 'Protocol Standby'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="text-right hidden sm:block">
                                            <span className="block text-[8px] text-white/20 font-black uppercase mb-1">Pulse Resonance</span>
                                            <span className="text-xs font-mono font-bold text-cyan-400">{85 + u}%</span>
                                        </div>
                                        <button className="px-6 py-2 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95">Override</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-[3rem] border border-white/10 p-8 space-y-8 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                        <h3 className="font-black italic tracking-tighter uppercase text-xl relative z-10">Diagnostic Feed</h3>
                        <div className="space-y-4 font-mono text-[10px] relative z-10 h-[500px] overflow-y-auto pr-4 custom-scrollbar text-white/40">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="border-l border-white/5 pl-4 py-1">
                                    <span className="text-cyan-500/40">[{new Date().toLocaleTimeString()}]</span> SYS_MOD_{i * 102}: Synthesis stream {i % 3 === 0 ? 'LOCKED' : 'CALIBRATING'}
                                    <br />
                                    <span className="text-white/10 text-[8px]">{'=>'} 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
