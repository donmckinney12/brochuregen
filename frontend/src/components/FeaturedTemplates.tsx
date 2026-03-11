"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Zap, Target, Rocket, Globe } from 'lucide-react';

export default function FeaturedTemplates() {
    const templates = [
        {
            title: "Tri-Fold Protocol",
            category: "Institutional",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
            color: "from-blue-600 to-indigo-600",
            desc: "Standard tri-fold for global corporate distribution."
        },
        {
            title: "SaaS Launch Stack",
            category: "Growth",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            color: "from-purple-600 to-pink-600",
            desc: "Optimized for high-growth digital product scaling."
        },
        {
            title: "Property Matrix",
            category: "Real Estate",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            color: "from-emerald-600 to-teal-600",
            desc: "High-fidelity one-pager for luxury estate marketing."
        },
        {
            title: "Neural Report",
            category: "Analytics",
            image: "https://images.unsplash.com/photo-1551288049-bb8c83345199?auto=format&fit=crop&w=800&q=80",
            color: "from-orange-600 to-amber-600",
            desc: "Data-heavy institutional reporting for stakeholders."
        },
        {
            title: "Healthcare Nexus",
            category: "Medical",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
            color: "from-cyan-600 to-blue-600",
            desc: "Secure, compliant layout for medical infrastructure."
        },
        {
            title: "Brand DNA Book",
            category: "Branding",
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80",
            color: "from-rose-600 to-orange-600",
            desc: "Complete visual guidelines for institutional scale."
        }
    ];

    return (
        <section className="py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-20 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
                    <Layers size={12} className="text-[var(--accent-primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">Layout Repository</span>
                </div>
                <h2 className="text-4xl font-black text-[var(--foreground)] uppercase italic tracking-tighter">
                    Neural <span className="text-[var(--accent-primary)]">Visual</span> Assets
                </h2>
                <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase tracking-[0.4em] max-w-xl mx-auto italic">
                    Doubled capacity for high-fidelity global distribution.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
                {templates.map((template, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-500 bg-[var(--background)] border border-white/5"
                    >
                        <div className="aspect-[4/5] relative overflow-hidden">
                            <img
                                src={template.image}
                                alt={template.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-60 group-hover:opacity-100"
                            />

                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-80`} />

                            {/* Metadata */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                <span className={`inline-block w-fit px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest mb-3 border border-white/20`}>
                                    {template.category}
                                </span>
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                                    {template.title}
                                </h3>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-tight leading-relaxed italic opacity-0 group-hover:opacity-100 transition-opacity">
                                    {template.desc}
                                </p>
                            </div>

                            {/* Hover Action */}
                            <div className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl">
                                    <Rocket size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Protocol Ready</span>
                            </div>
                            <Zap size={12} className="text-white/10" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Expansion Notice */}
            <div className="mt-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--foreground)]/10">Institutional Expansion v29.1 • Library Updated</p>
            </div>
        </section>
    );
}
