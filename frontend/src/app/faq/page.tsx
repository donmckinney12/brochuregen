"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: "How does the AI analyze my URL?",
        a: "Our neural engine uses Playwright to perform a deep-scan of your DOM. It extracts visual hierarchy, brand colors, and semantic content, which is then processed by GPT-4o to generate high-conversion marketing copy."
    },
    {
        q: "Are the PDFs print-ready?",
        a: "Yes. Every brochure is exported in high-resolution CMYK format, optimized for professional offset and digital printing house specifications."
    },
    {
        q: "Can I manage multiple brand identities?",
        a: "Currently, our Pro and Agency tiers support one primary Neural Vault. Multi-brand management is part of our v0.4 Protocol Update (Enterprise API)."
    },
    {
        q: "How do credits work?",
        a: "1 Credit = 1 Full Brochure Generation. Credits reset monthly. Pro and Agency plans include intelligent rollover for up to 50% of unused capacity."
    },
    {
        q: "What is the 'Refine' feature?",
        a: "Refining allows you to use secondary AI passes to tweak specific sections of your brochure without regenerating the entire layout, saving you 50% on credit costs."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen text-[var(--foreground)] relative overflow-hidden bg-transparent">

            <Navbar />

            <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <span className="px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block border border-[var(--accent-primary)]/30 backdrop-blur-md">
                        Protocol Knowledge Base
                    </span>
                    <h1 className="text-6xl font-black mb-6 tracking-tighter glitch-text text-[var(--foreground)]">
                        Frequently <span className="gradient-text">Asked Questions</span>
                    </h1>
                    <p className="text-lg text-[var(--foreground)]/80 max-w-2xl mx-auto leading-relaxed font-medium">
                        Everything you need to know about the neural brochure generation engine and account management.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="premium-card p-2 bg-[var(--background)]/40 border-[var(--glass-border)] overflow-hidden transition-all duration-500">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full text-left p-6 md:p-8 flex items-center justify-between group"
                            >
                                <span className={`text-lg font-black italic tracking-tight transition-colors ${openIndex === idx ? 'text-[var(--accent-primary)]' : 'text-[var(--foreground)]/80 group-hover:text-[var(--foreground)]'}`}>
                                    {idx + 1}. {faq.q}
                                </span>
                                <span className={`w-8 h-8 rounded-full border border-[var(--glass-border)] flex items-center justify-center transition-transform duration-500 ${openIndex === idx ? 'rotate-180 bg-[var(--accent-primary)] text-[var(--background)] border-[var(--accent-primary)]' : 'text-[var(--foreground)]/80 group-hover:text-[var(--foreground)]'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    >
                                        <div className="px-6 pb-8 md:px-8 md:pb-10 italic">
                                            <div className="p-6 bg-[var(--foreground)]/5 rounded-2xl border-l-4 border-[var(--accent-primary)] text-[var(--foreground)]/80 leading-relaxed font-medium">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-20 premium-card p-12 bg-gradient-to-br from-[var(--background)] to-[var(--accent-secondary)]/5 border-[var(--accent-secondary)]/20 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-secondary)]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <h3 className="text-2xl font-black text-[var(--foreground)] italic tracking-tighter uppercase mb-2">Still have questions?</h3>
                    <p className="text-[var(--foreground)]/80 mb-8 max-w-sm mx-auto text-sm font-medium">Can't find the answer you're looking for? Reach out to our neural support team.</p>
                    <button className="px-10 py-4 bg-[var(--accent-secondary)] text-[var(--foreground)] font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-lg">
                        Initialize Contact Sync
                    </button>
                </div>
            </main>
        </div>
    );
}
