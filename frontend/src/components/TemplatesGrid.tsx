"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Palette, FileText, Image as ImageIcon, Share2, Download, Map, HeartPulse, Layers, Utensils, BookOpen, Activity } from 'lucide-react';

const templates = [
    {
        title: "Professional Corporate",
        description: "Enforce a dominant institutional presence with structured layouts and high-contrast typography.",
        icon: Layout,
        category: "Corporate",
        image: "/images/corporate_trifold_mockup.png"
    },
    {
        title: "Creative Portfolio",
        description: "Dynamic asymmetric grids designed for high-impact visual storytelling and asset-rich content.",
        icon: Palette,
        category: "Creative",
        image: "/images/creative_portfolio_mockup.png"
    },
    {
        title: "Technical Datasheet",
        description: "Precision-engineered documentation templates for complex specifications and data visualization.",
        icon: FileText,
        category: "Technical",
        image: "/images/technical_datasheet_mockup.png"
    },
    {
        title: "Event Showcase",
        description: "Vibrant, high-energy layouts optimized for conversion and physical distribution.",
        icon: ImageIcon,
        category: "Marketing",
        image: "/images/event_showcase_mockup.png"
    },
    {
        title: "Minimalist Product",
        description: "Ultra-clean designs that prioritize negative space and product-centric focus.",
        icon: Download,
        category: "Retail",
        image: "/images/minimalist_product_mockup.png"
    },
    {
        title: "Modern Real Estate",
        description: "Luxury-oriented templates featuring immersive photography placeholders and elegant maps.",
        icon: Share2,
        category: "Real Estate",
        image: "/images/real_estate_luxury_mockup.png"
    },
    {
        title: "Luxury Travel",
        description: "Premium trifold designs for high-end boutique travel agencies and exotic resorts.",
        icon: Map,
        category: "Leisure",
        image: "/images/luxury_travel_brochure_mockup.png"
    },
    {
        title: "Healthcare Professional",
        description: "Clean, high-contrast medical flyers designed for patient trust and information clarity.",
        icon: HeartPulse,
        category: "Medical",
        image: "/images/healthcare_medical_flyer_mockup.png"
    },
    {
        title: "Start-up Pitch Deck",
        description: "Dark-themed tech aesthetic with neon accents and futuristic data visualizations.",
        icon: Layers,
        category: "Technology",
        image: "/images/tech_startup_pitch_deck_mockup.png"
    },
    {
        title: "Modern Restaurant",
        description: "Sophisticated culinary layouts that highlight high-quality food photography and menu details.",
        icon: Utensils,
        category: "Culinary",
        image: "/images/restaurant_menu_modern_mockup.png"
    },
    {
        title: "Academic Catalog",
        description: "Organized, vibrant course guides optimized for educational institutions and learning programs.",
        icon: BookOpen,
        category: "Education",
        image: "/images/educational_course_catalog_mockup.png"
    },
    {
        title: "Fitness & Wellness",
        description: "High-energy, gritty action designs for personal trainers and elite gym membership marketing.",
        icon: Activity,
        category: "Health",
        image: "/images/fitness_gym_membership_mockup.png"
    }
];

interface TemplatesGridProps {
    onSelect?: (template: Record<string, any>) => void;
    suggestedTemplate?: string | null;
}

export default function TemplatesGrid({ onSelect, suggestedTemplate }: TemplatesGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {templates.map((template, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => onSelect?.(template)}
                    className={`group cursor-pointer premium-card p-8 glass relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${suggestedTemplate === template.title ? 'ring-2 ring-[var(--accent-primary)] shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.3)]' : ''}`}
                >
                    {/* Visual Preview Background */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <img 
                            src={template.image} 
                            alt={template.title} 
                            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent group-hover:from-[var(--background)]/90" />
                    </div>

                    <div className="relative z-10">
                        {suggestedTemplate === template.title && (
                            <div className="absolute -top-4 -right-4 bg-[var(--accent-primary)] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg animate-bounce">
                                AI Recommended
                            </div>
                        )}

                        <div className="bg-[var(--accent-primary)]/5 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[var(--accent-primary)] transition-all duration-700 group-hover:shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.3)] relative overflow-hidden ring-1 ring-[var(--accent-primary)]/10 group-hover:ring-transparent">
                            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                            <template.icon className="w-6 h-6 text-[var(--accent-primary)] group-hover:text-white transition-colors relative z-10" />
                        </div>
                        
                        <span className="text-[10px] font-black tracking-[0.2em] text-[var(--accent-primary)] uppercase mb-2 block">
                            {template.category}
                        </span>
                        
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 tracking-tight italic">
                            {template.title}
                        </h3>
                        
                        <p className="text-[var(--foreground)]/60 text-sm leading-relaxed mb-8 group-hover:text-[var(--foreground)] transition-colors line-clamp-2">
                            {template.description}
                        </p>

                        <div className="flex items-center text-[10px] font-black tracking-widest text-[var(--foreground)] uppercase group-hover:text-[var(--accent-primary)] transition-colors">
                            <span>Select Template</span>
                            <div className="ml-2 w-4 h-px bg-[var(--foreground)] group-hover:bg-[var(--accent-primary)] transition-all flex-1 max-w-[2rem]" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
