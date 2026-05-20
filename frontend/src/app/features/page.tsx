"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Interactive Tilt Component for Images
const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={`relative group ${className}`}
        >
            <div
                style={{
                    transform: "translateZ(50px)",
                    transformStyle: "preserve-3d",
                }}
                className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-4 shadow-2xl overflow-hidden"
            >
                {/* Visual Glass Polish */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10" />
                <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {children}
            </div>
        </motion.div>
    );
};

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-primary)]/30 selection:text-[var(--foreground)]">
            <Navbar />
            <div className="fixed inset-0 scanline opacity-20 pointer-events-none z-50"></div>

            {/* Hero Section */}
            <header className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-10"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
                        </span>
                        Professional Content Engine
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-10 tracking-tighter italic uppercase">
                        Transform your <br className="hidden md:block" />
                        <span className="gradient-text italic">marketing materials.</span>
                    </h1>

                    <p className="text-xl text-[var(--foreground)]/80 font-bold max-w-2xl mx-auto mb-16 leading-relaxed uppercase tracking-widest">
                        BrochureGen uses advanced AI to instantly turn your website content into professional, print-ready brochures.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-8 justify-center">
                        <Link
                            href="/signup"
                            className="px-12 py-5 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black text-[12px] uppercase tracking-[0.3em] hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                            GET STARTED
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-12 py-5 rounded-2xl bg-[var(--background)] border border-[var(--foreground)]/20 text-[var(--foreground)] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-[var(--foreground)]/5 transition-all"
                        >
                            VIEW PRICING
                        </Link>
                    </div>
                </div>
            </header>

            {/* Feature 1: AI Analysis */}
            <section className="py-32 px-6 border-y border-[var(--foreground)]/5 relative bg-[var(--background)]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 md:order-1"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-primary)] mb-8">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 italic tracking-tighter uppercase">
                            Intelligent Content Analysis
                        </h2>
                        <p className="text-lg text-[var(--foreground)]/80 font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            Our AI analyzes your website, identifying key selling points and restructuring them for professional brochures.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Generate compelling headlines from your site",
                                "Identify key features and benefits",
                                "Match your existing brand voice",
                                "Remove website clutter for a clean layout"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[var(--foreground)]/80">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="order-1 md:order-2 perspective-[2000px]"
                    >
                        <TiltCard>
                            <img
                                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
                                alt="Professional Office Space"
                                className="w-full aspect-square object-cover rounded-[2rem]"
                            />
                        </TiltCard>
                    </motion.div>
                </div>
            </section>

            {/* Feature 2: Smart Layout */}
            <section className="py-32 px-6 bg-[var(--background)] relative">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="perspective-[2000px]"
                    >
                        <TiltCard>
                            <img
                                src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80"
                                alt="Modern UI Design"
                                className="w-full aspect-square object-cover rounded-[2rem]"
                            />
                        </TiltCard>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-secondary)] mb-8">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                        </div>
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 italic tracking-tighter uppercase">
                            Automated Professional Layouts
                        </h2>
                        <p className="text-lg text-[var(--foreground)]/80 font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            Our engine automatically organizes your content into clean, professional layouts optimized for tri-fold and one-page brochures.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Professional placement of text and images",
                                "Optimized panel distribution for readability",
                                "Full support for standard 8.5\" x 11\" printing",
                                "Smart use of whitespace for a modern look"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[var(--foreground)]/80">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_10px_var(--accent-secondary)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* Feature 3: Export */}
            <section className="py-32 px-6 bg-[var(--background)] border-t border-[var(--foreground)]/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 md:order-1"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent-tertiary)] mb-8">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </div>
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-6 italic tracking-tighter uppercase">
                            High-Resolution Exports
                        </h2>
                        <p className="text-lg text-[var(--foreground)]/80 font-bold leading-relaxed mb-8 uppercase tracking-widest">
                            Export high-resolution PDF files ready for professional printing or digital distribution.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "300 DPI Print-Ready Resolution",
                                "CMYK Color Optimization for Printing",
                                "High-Quality Typography",
                                "Standard PDF Compatibility"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[var(--foreground)]/80">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-tertiary)] shadow-[0_0_10px_var(--accent-tertiary)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="order-1 md:order-2 perspective-[2000px]"
                    >
                        <TiltCard>
                            <img
                                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
                                alt="High Quality Print"
                                className="w-full aspect-square object-cover rounded-[2rem]"
                            />
                        </TiltCard>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
