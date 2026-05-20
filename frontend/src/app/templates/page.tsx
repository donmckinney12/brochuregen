"use client";
import React from 'react';
import SuiteLayout from '@/components/SuiteLayout';
import TemplatesGrid from '@/components/TemplatesGrid';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, Brain, Search, Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TemplatesPage() {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestedTemplate, setSuggestedTemplate] = useState<string | null>(null);

    const handleAIsuggest = () => {
        setIsAnalyzing(true);
        setSuggestedTemplate(null);
        
        // Simulate advanced AI analysis
        setTimeout(() => {
            const templates = [
                "Professional Corporate", 
                "Creative Portfolio", 
                "Technical Datasheet", 
                "Event Showcase", 
                "Minimalist Product", 
                "Modern Real Estate",
                "Luxury Travel",
                "Healthcare Professional",
                "Start-up Pitch Deck",
                "Modern Restaurant",
                "Academic Catalog",
                "Fitness & Wellness"
            ];
            const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
            setSuggestedTemplate(randomTemplate);
            setIsAnalyzing(false);
        }, 2500);
    };

    return (
        <SuiteLayout>
            <div className="max-w-[1600px] space-y-24 py-24 px-6 md:px-16 relative overflow-hidden">
                {/* Atmospheric Background Layers [v30.2] */}
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 blur-[140px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[140px] rounded-full" />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 px-4">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-[var(--accent-primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-primary)]">Template Selection</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-[0.9]">
                            Template <br />
                            <span className="gradient-text">Library</span>
                        </h1>
                        <p className="text-[var(--foreground)]/50 font-bold tracking-[0.4em] uppercase text-xs italic max-w-xl">
                            Initialize professional brochure generation with our curated business templates.
                        </p>
                    </div>

                    <button
                        onClick={handleAIsuggest}
                        disabled={isAnalyzing}
                        className="relative group overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] italic hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-4 self-start md:self-auto"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="relative z-10">Analyzing Brand...</span>
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span className="relative z-10">Suggest For Me</span>
                            </>
                        )}
                    </button>
                </div>

                {isAnalyzing && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-12 p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(59,130,246,0.1),transparent)] translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                        <div className="flex flex-col items-center gap-4 text-center">
                            <Search className="w-8 h-8 text-blue-500 animate-bounce" />
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">ML Visual Analysis Active</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identifying optimal layout structures based on brand geometry...</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <TemplatesGrid
                    suggestedTemplate={suggestedTemplate}
                    onSelect={(template) => {
                        router.push(`/dashboard?template=${encodeURIComponent(template.title)}`);
                    }}
                />

                {/* Premium CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 mb-12 relative group px-4"
                >
                    <div className="absolute inset-x-0 top-[-20%] h-[140%] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity" />
                    
                    <div className="relative premium-card p-10 md:p-16 rounded-[2.5rem] border border-white/5 flex flex-col xl:flex-row items-center justify-between gap-10 overflow-hidden shadow-2xl max-w-6xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                        
                        <div className="space-y-6 max-w-xl text-center xl:text-left relative z-10">
                            <div className="flex items-center gap-3 justify-center xl:justify-start">
                                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                    <Rocket size={20} className="text-indigo-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Enterprise Customization</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-[var(--foreground)] leading-[0.9]">
                                Need a <br />
                                <span className="gradient-text">Custom Solution?</span>
                            </h2>
                            
                            <p className="text-[var(--foreground)]/40 font-bold uppercase tracking-widest text-[10px] italic leading-relaxed">
                                Our platform can be tailored for bespoke visual requirements. Initialize a consultation to design a unique brand signature.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/contact')}
                            className="relative group/btn overflow-hidden bg-white text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] shrink-0 z-10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            <span className="relative z-10 group-hover/btn:text-white transition-colors">Request Custom Design</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </SuiteLayout>
    );
}
