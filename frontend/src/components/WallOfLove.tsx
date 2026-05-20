"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck, Heart } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah Chen",
        role: "VP of Marketing, AetherFlow",
        content: "BrochureGen transformed our collateral pipeline. What used to take weeks of back-and-forth with designers now happens in seconds. The AI's brand DNA extraction is uncanny.",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5
    },
    {
        name: "Marcus Thorne",
        role: "Creative Director, Nexus Labs",
        content: "The output quality is institutional-grade. We've replaced our manual design workflows for all sector reports with BrochureGen's holographic synthesis. It's a game changer.",
        avatar: "https://i.pravatar.cc/150?u=marcus",
        rating: 5
    },
    {
        name: "Elena Rodriguez",
        role: "Brand Lead, Stratos Digital",
        content: "Finally, an AI that actually understands typography and layout balance. The vector-perfect exports make our print production seamless. Absolute perfection.",
        avatar: "https://i.pravatar.cc/150?u=elena",
        rating: 5
    },
    {
        name: "David Park",
        role: "Operations Manager, Zenith Pulse",
        content: "Scale was our biggest challenge. BrochureGen handles our high-bandwidth scanning and generation needs with millisecond latency. The governance controls are top-tier.",
        avatar: "https://i.pravatar.cc/150?u=david",
        rating: 5
    },
    {
        name: "Jessica Wu",
        role: "Product Designer, HyperLink",
        content: "The 3D preview environment gives our team instant confidence in the final product. It's the most polished SaaS tool in our stack. Design protocols are always in sync.",
        avatar: "https://i.pravatar.cc/150?u=jessica",
        rating: 5
    },
    {
        name: "Thomas Miller",
        role: "CMO, Vertex Point",
        content: "Institutional-grade creative infrastructure at machine speed. Our global teams are now fully aligned on brand assets. It's not just a tool, it's a force multiplier.",
        avatar: "https://i.pravatar.cc/150?u=thomas",
        rating: 5
    }
];

export default function WallOfLove() {
    return (
        <section id="testimonials" className="py-32 relative overflow-hidden bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/20 shadow-sm"
                    >
                        <Heart size={12} className="text-[var(--accent-tertiary)] fill-[var(--accent-tertiary)]" />
                        <span className="text-[var(--accent-tertiary)] font-black uppercase tracking-[0.2em] text-[8px]">Ecosystem Trust</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black text-[var(--foreground)] uppercase leading-tight tracking-tighter"
                    >
                        Reviews & <span className="gradient-text">Testimonials</span>
                    </motion.h2>
                    
                    <p className="text-[var(--foreground)]/40 font-bold max-w-xl mx-auto uppercase tracking-widest text-[10px]">
                        Voices from the leaders of the next generation of creative infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="premium-card p-10 flex flex-col space-y-8 bg-white/[0.02] backdrop-blur-3xl hover:border-[var(--accent-primary)]/30 transition-all duration-500 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <Quote className="text-[var(--foreground)]/10 group-hover:text-[var(--accent-primary)]/20 transition-colors" size={24} />
                            </div>

                            <p className="text-sm font-bold text-[var(--foreground)]/70 leading-relaxed italic grow">
                                "{item.content}"
                            </p>

                            <div className="flex items-center gap-5 pt-4 border-t border-white/5">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[var(--accent-primary)]/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <img
                                        src={item.avatar}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white/10 relative z-10"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase text-[var(--foreground)] tracking-tight">{item.name}</h4>
                                    <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest leading-none mt-1">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/30"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        Verified Institutional Users
                    </div>
                    <div className="w-1 h-1 bg-[var(--foreground)]/10 rounded-full hidden sm:block" />
                    <div>Enterprise Grade Security Protocols</div>
                    <div className="w-1 h-1 bg-[var(--foreground)]/10 rounded-full hidden sm:block" />
                    <div className="text-[var(--accent-primary)] animate-pulse">Live from Global Clusters</div>
                </motion.div>
            </div>

            {/* Ambient Nebula Ornament */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[var(--accent-tertiary)]/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
        </section>
    );
}
