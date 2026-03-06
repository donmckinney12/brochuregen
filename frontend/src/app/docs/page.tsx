"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { title: "Getting Started", count: 12, icon: "🚀" },
        { title: "Account & Billing", count: 8, icon: "💳" },
        { title: "Brochure Creation", count: 15, icon: "📄" },
        { title: "AI Customization", count: 10, icon: "🤖" },
        { title: "Integrations & API", count: 6, icon: "🔌" },
        { title: "Troubleshooting", count: 20, icon: "🛠️" },
    ];

    const faqs = [
        { q: "How do I generate a brochure?", a: "Simply paste your website URL into the generator on your dashboard and click 'Generate'. The AI will handle the rest!" },
        { q: "Can I edit the generated content?", a: "Yes! Every brochure is fully editable. You can refine the copy or regenerate specific sections using our refinement tool." },
        { q: "What is your refund policy?", a: "We offer a 14-day money-back guarantee if you haven't used more than 5 credits. Check our Legal Center for details." },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-40 pb-20">
                {/* Hero Search */}
                <section className="px-6 mb-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8">How can we help?</h1>
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for articles, guides..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="px-6 max-w-7xl mx-auto mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat, idx) => (
                            <Link
                                key={idx}
                                href="#"
                                className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center hover:shadow-lg hover:border-blue-500 transition-all group"
                            >
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                                <h3 className="font-bold text-sm mb-1">{cat.title}</h3>
                                <p className="text-xs text-slate-500">{cat.count} articles</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="px-6 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm italic">Q</span>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
