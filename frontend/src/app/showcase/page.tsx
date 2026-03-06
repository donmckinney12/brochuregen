"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ShowcasePage() {
    const examples = [
        { title: "Gourmet Garden Bistro", category: "Restaurant", url: "gourmetgarden.com", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
        { title: "Luxe Realty Group", category: "Real Estate", url: "luxerealty.com", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" },
        { title: "Zenith Tech Solutions", category: "Software", url: "zenithtech.io", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
        { title: "Bloom & Stem Florist", category: "Retail", url: "bloomandstem.com", img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80" },
        { title: "Everest Fitness Hub", category: "Health & Wellness", url: "everestfitness.com", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" },
        { title: "Stellar Law Firm", category: "Professional Services", url: "stellarlaw.com", img: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Community Showcase
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
                        See how businesses around the world are using BrochureGen to turn their websites into stunning physical marketing materials.
                    </p>
                    <Link href="/signup" className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-all inline-block">
                        Build Your Own &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {examples.map((item, idx) => (
                        <div key={idx} className="group bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="h-64 overflow-hidden relative">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.827a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.1 1.1"></path></svg>
                                    {item.url}
                                </p>
                                <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                                    View Full Brochure
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
