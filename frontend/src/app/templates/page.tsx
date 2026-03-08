"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import SuiteLayout from '@/components/SuiteLayout';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
    { id: "real-estate-one-pager", name: "Real Estate One-Pager", category: "Real Estate", premium: false, description: "Perfect for single property listings. Highlights hero image and key specs.", gradient: "from-cyan-600 to-blue-700", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" },
    { id: "corporate-profile", name: "Corporate Profile", category: "Business", premium: false, description: "Professional layout for company overviews and team introductions.", gradient: "from-slate-600 to-zinc-800", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
    { id: "restaurant-menu", name: "Restaurant & Menu", category: "Hospitality", premium: false, description: "Elegant menu design with sections for appetizers, mains, and drinks.", gradient: "from-amber-600 to-orange-700", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
    { id: "event-flyer", name: "Event Flyer", category: "Events", premium: false, description: "Eye-catching design for conferences, parties, and meetups.", gradient: "from-purple-600 to-pink-600", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80" },
    { id: "product-catalog", name: "Product Catalog", category: "Retail", premium: false, description: "Clean grid layout to showcase your product line with pricing.", gradient: "from-emerald-600 to-teal-700", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
    { id: "travel-guide", name: "Travel Guide", category: "Travel", premium: false, description: "Inspiring layout for destination guides and tour packages.", gradient: "from-sky-500 to-indigo-600", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
    { id: "saas-landing", name: "SaaS Landing", category: "Technology", premium: true, description: "Conversion-optimized layout for software products and digital services.", gradient: "from-fuchsia-600 to-purple-700", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
    { id: "nonprofit-impact", name: "Nonprofit Impact Report", category: "Nonprofit", premium: true, description: "Storytelling layout for annual reports, fundraisers, and impact metrics.", gradient: "from-rose-500 to-red-700", image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80" },
    { id: "fitness-studio", name: "Fitness & Wellness", category: "Health", premium: false, description: "High-energy design for gyms, studios, and wellness programs.", gradient: "from-lime-500 to-green-700", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" },
    { id: "luxury-brand", name: "Luxury Brand Lookbook", category: "Fashion", premium: true, description: "Minimal, editorial layout for high-end fashion and lifestyle brands.", gradient: "from-neutral-600 to-stone-800", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" },
    { id: "education-course", name: "Course Prospectus", category: "Education", premium: false, description: "Structured layout for online courses, bootcamps, and training programs.", gradient: "from-blue-600 to-cyan-700", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" },
    { id: "agency-portfolio", name: "Agency Portfolio", category: "Creative", premium: true, description: "Case-study driven portfolio layout for marketing and design agencies.", gradient: "from-violet-600 to-indigo-800", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80" },
];

const CATEGORIES = ["All", ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const filteredTemplates = TEMPLATES.filter(t =>
        selectedCategory === "All" || t.category === selectedCategory
    );

    return (
        <SuiteLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-secondary)]">Template Protocol</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">
                        Template <span className="bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] bg-clip-text text-transparent">Marketplace</span>
                    </h1>
                    <p className="text-xs text-[var(--foreground)]/60 font-bold uppercase tracking-[0.2em] mt-3 max-w-xl">
                        Select a neural template to pre-populate your Generation Studio. AI adapts content to your brand automatically.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                ? 'bg-[var(--foreground)] text-[var(--background)] shadow-lg'
                                : 'bg-[var(--foreground)]/5 text-[var(--foreground)]/60 border border-[var(--glass-border)] hover:bg-[var(--foreground)]/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredTemplates.map((template, index) => (
                            <motion.div
                                key={template.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative"
                                onMouseEnter={() => setHoveredId(template.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl overflow-hidden hover:border-[var(--accent-secondary)]/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.08)]">
                                    {/* Template Preview */}
                                    <div className={`aspect-[4/3] bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                                        {/* Image */}
                                        <img
                                            src={template.image}
                                            alt={template.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Gradient overlay on image */}
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent`} />

                                        {/* Template label */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                                            <div className="text-white/60 text-[8px] font-black uppercase tracking-[0.4em] mb-2">{template.category}</div>
                                            <div className="text-white text-xl font-black italic tracking-tight drop-shadow-lg">{template.name}</div>
                                        </div>

                                        {/* Premium badge */}
                                        {template.premium && (
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/90 text-black text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                Pro+
                                            </div>
                                        )}

                                        {/* Hover overlay */}
                                        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${hoveredId === template.id ? 'opacity-100' : 'opacity-0'}`}>
                                            <Link
                                                href={`/dashboard?template=${template.id}`}
                                                className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-xl"
                                            >
                                                Use Template
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Template Info */}
                                    <div className="p-6">
                                        <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight mb-2">{template.name}</h3>
                                        <p className="text-[10px] text-[var(--foreground)]/50 font-bold uppercase tracking-wider leading-relaxed line-clamp-2">
                                            {template.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* CTA */}
                <div className="mt-16 p-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl text-center">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[var(--foreground)] mb-4">Need a Custom Template?</h2>
                    <p className="text-[10px] text-[var(--foreground)]/50 font-bold uppercase tracking-[0.2em] mb-8 max-w-lg mx-auto">
                        New templates are added weekly. Enterprise users can request custom templates built to their specifications.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">
                        Request Template
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </div>
        </SuiteLayout>
    );
}
