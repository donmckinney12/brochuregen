"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ChevronRight, Shield, Zap, Building2, Globe2, BarChart3, Briefcase, CheckCircle2, Star, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingHero() {
    return (
        <section className="relative pt-40 pb-32 overflow-hidden border-b border-white/5">
            {/* Elegant Enterprise Mesh Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--accent-primary-rgb),0.08),transparent_60%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-10">

                        {/* Professional Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                        >
                            <Shield className="text-[var(--accent-primary)]" size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/60">Professional Brochure Generation</span>
                        </motion.div>

                        {/* Professional Headline */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[var(--foreground)] tracking-tighter leading-[0.95] uppercase italic">
                                Elevate <br />
                                <span className="gradient-text">Your Narrative</span>
                            </h1>
                            <p className="text-xl font-bold text-[var(--foreground)]/50 max-w-2xl mx-auto md:mx-0 leading-relaxed italic">
                                Professional brochures powered by advanced AI. High-quality design, delivered in seconds.
                            </p>
                        </motion.div>

                        {/* Professional CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
                        >
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-12 py-6 bg-[var(--accent-primary)] text-white hover:brightness-110 rounded-2xl font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-3 group shadow-[0_20px_40px_rgba(var(--accent-primary-rgb),0.3)] active:scale-95"
                            >
                                Get Started
                                <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
                            </Link>
                            <Link
                                href="/enterprise"
                                className="w-full sm:w-auto px-12 py-6 bg-white/[0.03] hover:bg-white/[0.08] text-[var(--foreground)] border border-white/10 rounded-2xl font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-3 group backdrop-blur-xl"
                            >
                                View Examples
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Trust Indicators - Minimal */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="md:hidden w-full flex justify-center gap-8 text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest"
                        >
                            <div className="flex items-center gap-2"><CheckCircle2 size={14} /> ENTERPRISE</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={14} /> GDPR</div>
                        </motion.div>
                    </div>

                    {/* Right Column: God-Tier Holographic Product Hero */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group hidden md:block perspective-2000"
                    >
                        {/* Intensified Core Glow */}
                        <div className="absolute -inset-40 bg-gradient-to-br from-purple-600/20 via-blue-500/10 to-transparent blur-[120px] opacity-40 group-hover:opacity-80 transition-opacity duration-1000 animate-pulse" />
                        
                        {/* Rotating 3D Container */}
                        <motion.div 
                            style={{ rotateY: -15, rotateX: 10 }}
                            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                            className="relative z-10 w-full aspect-square md:aspect-video flex items-center justify-center p-4"
                        >
                            {/* Neural Grid Floor */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] opacity-20 -z-10" />

                            {/* Main Holographic Canvas */}
                            <div className="relative w-4/5 h-4/5 rounded-[40px] border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden flex items-center justify-center">
                                {/* Floating Brochure with God-Ray Shimmer */}
                                <div className="relative z-20 group-hover:scale-110 transition-transform duration-1000">
                                    <img 
                                        src="/brochure_hero.png" 
                                        className="w-[300px] md:w-[400px] h-auto drop-shadow-[0_20px_100px_rgba(0,0,0,0.8)]"
                                        alt="Brochure Masterpiece"
                                    />
                                    {/* Holographic Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] ease-in-out pointer-events-none" />
                                </div>

                                {/* Dynamic Neural Connections */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                    <motion.path 
                                        d="M 50,50 Q 150,100 250,50" 
                                        stroke="url(#grad1)" 
                                        strokeWidth="1" 
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />
                                    <defs>
                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="transparent" />
                                            <stop offset="50%" stopColor="var(--accent-primary)" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Floating Macro-Nodes (Parallax) */}
                            <motion.div 
                                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 p-6 rounded-3xl bg-black/40 border border-white/20 backdrop-blur-3xl shadow-2xl z-30"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center animate-spin-slow">
                                        <Sparkles className="text-purple-400" size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Resonance Score</span>
                                        <span className="text-xl font-black text-white italic">ELITE_FIDELITY</span>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        animate={{ width: ["0%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]" 
                                    />
                                </div>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-10 -left-10 p-6 rounded-3xl bg-black/40 border border-white/20 backdrop-blur-3xl shadow-2xl z-30 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                                <div className="relative flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-cyan-500/20">
                                            <Zap size={16} className="text-cyan-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Engine Velocity</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <motion.div 
                                                key={i}
                                                animate={{ height: [4, 12, 4], opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                className="w-2 rounded-full bg-cyan-500"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Cyber-HUD Ornaments */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-20 animate-spin-slow opacity-20" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-t border-purple-500/20 rounded-full -z-20 animate-reverse-spin opacity-40" />
                        </motion.div>

                        {/* Ultra-Intense Bottom Reflection */}
                        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-purple-500/20 blur-[60px] rounded-full opacity-50" />
                    </motion.div>
                </div>

                {/* Simplified Partner Ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-24 w-full"
                >
                    <div className="relative overflow-hidden py-8 border-y border-white/5">
                        <div className="flex items-center justify-center flex-wrap gap-x-16 gap-y-8 opacity-40 grayscale contrast-125 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            <div className="flex items-center gap-3 font-bold text-lg tracking-tight"><Building2 size={24} /> AETHER_CORE</div>
                            <div className="flex items-center gap-3 font-bold text-lg tracking-tight"><Globe2 size={24} /> HYPER_LINK</div>
                            <div className="flex items-center gap-3 font-bold text-lg tracking-tight"><BarChart3 size={24} /> VERTEX_POINT</div>
                            <div className="flex items-center gap-3 font-bold text-lg tracking-tight"><Briefcase size={24} /> ZENITH_PULSE</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* High-Tech Ambient Ornament */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none"
            />
        </section>
    );
}
