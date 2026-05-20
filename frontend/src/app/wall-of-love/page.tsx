"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import WallOfLove from '@/components/WallOfLove';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ArrowLeft, Heart } from 'lucide-react';

export default function WallOfLovePage() {
    return (
        <main className="min-h-screen bg-[var(--background)] transition-colors duration-500 overflow-hidden">
            <Navbar />

            <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
                {/* Elegant Mesh Background */}
                <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(var(--accent-tertiary-rgb),0.08),transparent_70%)]" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl mb-8"
                    >
                        <Heart className="text-[var(--accent-tertiary)] fill-[var(--accent-tertiary)]" size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/60">Community Voices</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--foreground)] tracking-tighter leading-tight uppercase italic mb-8"
                    >
                        Reviews & <span className="gradient-text">Testimonials</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl font-bold text-[var(--foreground)]/50 max-w-2xl mx-auto leading-relaxed italic"
                    >
                        Join thousands of marketing leaders who have transformed their creative output with institutional-grade AI.
                    </motion.p>
                </div>
            </section>

            <WallOfLove />

            {/* Dedicated Page CTA */}
            <section className="py-32 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="premium-card p-16 space-y-10 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] text-white border-transparent shadow-[0_40px_100px_rgba(var(--accent-primary-rgb),0.2)]"
                    >
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight">
                            Ready to Join the <br />
                            <span className="text-black/20">Elite Network?</span>
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-12 py-6 bg-white text-[var(--accent-primary)] hover:bg-black hover:text-white rounded-[2rem] font-black uppercase tracking-widest italic shadow-xl transition-all flex items-center justify-center gap-3 group"
                            >
                                <Rocket size={24} className="group-hover:rotate-12 transition-transform" />
                                Start Designing
                            </Link>
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-10 py-5 text-white/80 hover:text-white font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={20} />
                                Back Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Ambient Nebula Ornament */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/10 blur-[150px] rounded-full -z-10 pointer-events-none"
            />
        </main>
    );
}
