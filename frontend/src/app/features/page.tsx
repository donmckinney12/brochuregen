"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <header className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-bottom-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Powerful Capabilities
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 delay-100">
                        Everything you need to <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            create professional brochures.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-200">
                        Stop struggling with complex design software. BrochureGen uses AI to analyze your website and generate print-ready marketing materials in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 delay-300">
                        <Link
                            href="/signup"
                            className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
                        >
                            Start Creating for Free
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </header>

            {/* Feature 1: AI Analysis */}
            <section className="py-24 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 animate-in slide-in-from-left-8 fade-in duration-700">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Intelligent Content Extraction
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            Our AI doesn't just screenshot your page. It reads the text, identifies your unique value propositions, and restructures the content specifically for a physical brochure format.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Summarizes lengthy paragraphs into punchy headlines",
                                "Extracts key benefits and features automatically",
                                "Identifies and preserves brand voice",
                                "Filters out navigational clutter (menus, footers)"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 shadow-xl border border-slate-200 dark:border-slate-700">
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center relative overflow-hidden">
                            {/* Abstract representation of scanning */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="w-3/4 h-3/4 bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 flex flex-col gap-4">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse delay-75"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 animate-pulse delay-150"></div>
                                <div className="flex-1"></div>
                                <div className="h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                                    AI Analyzing...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2: Smart Layout */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative group perspective-1000">
                        <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 transform -rotate-2 hover:rotate-0 transition-all duration-500">
                            <div className="grid grid-cols-3 gap-2 h-64 p-4">
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg h-full"></div>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg h-full"></div>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg h-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="animate-in slide-in-from-right-8 fade-in duration-700">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Automated Tri-Fold Layouts
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            Forget about bleed lines, margins, and fold panels. Our engine automatically distributes your content across a standard 6-panel tri-fold layout.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Auto-placement of headlines and images",
                                "Optimized panel distribution (Cover, Inside, Back)",
                                "Standard letter size (8.5\" x 11\") support",
                                "Smart whitespace management for readability"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Feature 3: Export */}
            <section className="py-24 px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 animate-in slide-in-from-left-8 fade-in duration-700">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Print-Ready PDF Export
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            Download a high-resolution PDF that's ready for your office printer or a professional print shop.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "High-resolution (300 DPI) output",
                                "CMYK color profile ready",
                                "Vector text for crisp readability",
                                "Compatible with all standard PDF viewers"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 bg-slate-100 dark:bg-slate-800 rounded-3xl p-10 transform rotate-1 hover:rotate-0 transition-transform duration-500 shadow-xl border border-slate-200 dark:border-slate-700 flex justify-center">
                        <div className="w-48 bg-white dark:bg-slate-900 shadow-2xl rounded-sm h-64 flex flex-col items-center justify-center gap-2 border border-slate-200 dark:border-slate-800">
                            <div className="text-red-500">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z"></path></svg>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">brochure.pdf</span>
                            <span className="text-xs text-slate-500">2.4 MB</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why use BrochureGen?</h2>
                        <p className="text-slate-600 dark:text-slate-400">Designed for business owners, real estate agents, and marketers.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Save 90% of Time",
                                desc: "What used to take hours in InDesign now takes seconds with our AI.",
                                icon: "⏱️"
                            },
                            {
                                title: "Zero Design Skills",
                                desc: "You don't need to know about kerning or leading. We handle the aesthetics.",
                                icon: "🎨"
                            },
                            {
                                title: "Instant Iterations",
                                desc: "Don't like the copy? Regenerate it instantly until it's perfect.",
                                icon: "🔄"
                            }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">{card.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to transform your marketing?</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Join thousands of businesses using BrochureGen to create stunning print materials from their existing websites.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-slate-100 transition-colors shadow-lg relative z-10"
                    >
                        Get Started for Free
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
