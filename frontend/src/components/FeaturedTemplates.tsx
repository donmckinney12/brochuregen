"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Zap, Target, Rocket, Globe, BarChart3, ShieldCheck, Truck, Landmark, Building2, Leaf, Presentation, CalendarDays } from 'lucide-react';

export default function FeaturedTemplates() {
    const templates = [
        {
            title: "Tri-Fold Protocol",
            category: "Institutional",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
            color: "from-blue-600 to-indigo-600",
            desc: "Standard tri-fold for global corporate distribution.",
            icon: Target
        },
        {
            title: "SaaS Launch Stack",
            category: "Growth",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            color: "from-purple-600 to-pink-600",
            desc: "Optimized for high-growth digital product scaling.",
            icon: Rocket
        },
        {
            title: "Property Matrix",
            category: "Real Estate",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            color: "from-emerald-600 to-teal-600",
            desc: "High-fidelity one-pager for luxury estate marketing.",
            icon: Globe
        },
        {
            title: "Neural Report",
            category: "Analytics",
            image: "https://images.unsplash.com/photo-1543286386-713bcd53baae?auto=format&fit=crop&w=800&q=80",
            color: "from-orange-600 to-amber-600",
            desc: "Data-heavy institutional reporting for stakeholders.",
            icon: BarChart3
        },
        {
            title: "Healthcare Nexus",
            category: "Medical",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
            color: "from-cyan-600 to-blue-600",
            desc: "Secure, compliant layout for medical infrastructure.",
            icon: ShieldCheck
        },
        {
            title: "Brand DNA Book",
            category: "Branding",
            image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80",
            color: "from-rose-600 to-orange-600",
            desc: "Complete visual guidelines for institutional scale.",
            icon: Layers
        },
        {
            title: "Logistics Flow",
            category: "Supply Chain",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            color: "from-slate-600 to-gray-700",
            desc: "Operational mapping for global supply node distribution.",
            icon: Truck
        },
        {
            title: "FinTech Ledger",
            category: "Financial",
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
            color: "from-blue-700 to-indigo-900",
            desc: "Encrypted visual data for decentralized asset management.",
            icon: Landmark
        },
        {
            title: "Architecture Alpha",
            category: "Design",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
            color: "from-stone-600 to-stone-800",
            desc: "Minimalist structural layouts for enterprise projects.",
            icon: Building2
        },
        {
            title: "Eco-System Audit",
            category: "Sustainability",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            color: "from-green-600 to-emerald-700",
            desc: "Environmental impact metrics for corporate governance.",
            icon: Leaf
        },
        {
            title: "Venture Pitch",
            category: "Venture",
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
            color: "from-violet-600 to-purple-800",
            desc: "High-stakes presentation nodes for institutional capital.",
            icon: Presentation
        },
        {
            title: "Event Protocol",
            category: "Special",
            image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80",
            color: "from-red-600 to-rose-700",
            desc: "Secure scheduling for mission-critical summit events.",
            icon: CalendarDays
        }
    ];

    return (
        <section className="py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-20 space-y-4 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.1)]">
                    <Layers size={12} className="text-[var(--accent-primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">Infinite Layout Node</span>
                </div>
                <h2 className="text-5xl font-black text-[var(--foreground)] uppercase italic tracking-tighter">
                    Institutional <span className="text-[var(--accent-primary)]">Layout</span> Library
                </h2>
                <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase tracking-[0.4em] max-w-2xl mx-auto italic">
                    Universal distribution capacity enabled • 12 High-fidelity clusters detected.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto px-6">
                {templates.map((template, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                        className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[0_0_80px_rgba(0,0,0,0.4)] transition-all duration-700 bg-[var(--background)] border border-white/5 active:scale-[0.98]"
                    >
                        <div className="aspect-[4/5] relative overflow-hidden bg-black">
                            <img
                                src={template.image}
                                alt={template.title}
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"; // Abstract fallback
                                }}
                                className="w-full h-full object-cover transform group-hover:scale-110 grayscale-[0.8] group-hover:grayscale-0 transition-all duration-1000 opacity-50 group-hover:opacity-100"
                            />

                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10 opacity-90`} />

                            {/* Metadata */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                <span className={`inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-white/5 backdrop-blur-xl text-white/60 text-[8px] font-black uppercase tracking-widest mb-3 border border-white/10 group-hover:border-[var(--accent-primary)]/40 group-hover:text-white transition-all`}>
                                    <template.icon size={10} className="text-[var(--accent-primary)]" />
                                    {template.category}
                                </span>
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2 group-hover:text-[var(--accent-primary)] transition-all translate-y-2 group-hover:translate-y-0 duration-500">
                                    {template.title}
                                </h3>
                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-tight leading-relaxed italic opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                                    {template.desc}
                                </p>
                            </div>

                            {/* Hover Action Ornaments */}
                            <div className="absolute top-8 right-8 z-30 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                                <div className="w-14 h-14 rounded-3xl bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform cursor-pointer">
                                    <Rocket size={24} className="group-hover:animate-bounce" />
                                </div>
                            </div>
                        </div>

                        {/* Status Matrix */}
                        <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex items-center justify-between backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute opacity-20" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-emerald-400 transition-colors">Cluster Sync V3</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-20 group-hover:opacity-60 transition-opacity">
                                <div className="w-4 h-[1px] bg-white/40" />
                                <Zap size={10} className="text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Version Stamp */}
            <div className="mt-24 text-center pb-12">
                <div className="inline-block px-10 py-4 border border-white/5 rounded-2xl bg-white/[0.02]">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[var(--foreground)]/10 animate-pulse">
                        Global Distribution Hub • v29.4 • 100% Operational
                    </p>
                </div>
            </div>
        </section>
    );
}
