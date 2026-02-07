"use client";
import React, { useState } from 'react';

const BROCHURES = [
    {
        id: 1,
        title: "Modern Minimalist",
        category: "Real Estate",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        color: "from-slate-200 to-slate-100",
        description: "clean lines and ample whitespace to highlight architectural details."
    },
    {
        id: 2,
        title: "Luxury Estate",
        category: "Premium",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        color: "from-orange-100 to-amber-50",
        description: "Elegant serif typography and gold accents for high-end properties."
    },
    {
        id: 3,
        title: "Urban Loft",
        category: "City Living",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        color: "from-blue-100 to-indigo-50",
        description: "Bold layouts and modern fonts perfect for downtown apartments."
    }
];

export default function BrochureCarousel() {
    const [selectedBrochure, setSelectedBrochure] = useState<typeof BROCHURES[0] | null>(null);

    return (
        <div className="w-full max-w-7xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Product Showcase</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4">
                    Stunning Brochures, <br /> Generated in Seconds
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Our AI analyzes your property listing and automatically designs professional-grade marketing assets.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 perspective-1000">
                {BROCHURES.map((brochure, index) => (
                    <div
                        key={brochure.id}
                        className={`group relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl border border-slate-200 dark:border-slate-700 ${index === 1 ? 'md:-mt-8' : ''}`}
                    >
                        {/* Image Container */}
                        <div className="h-64 overflow-hidden relative cursor-pointer" onClick={() => setSelectedBrochure(brochure)}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                            <img
                                src={brochure.image}
                                alt={brochure.title}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 z-20">
                                <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                                    {brochure.category}
                                </span>
                            </div>
                            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white inline-flex">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 relative">
                            <div className={`absolute -top-10 right-6 w-16 h-16 rounded-full bg-gradient-to-br ${brochure.color} border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center z-20`}>
                                <svg className="w-8 h-8 text-slate-700 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{brochure.title}</h3>
                            <div className="space-y-2 mb-6">
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 dark:bg-slate-600 w-3/4"></div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 dark:bg-slate-600 w-1/2"></div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedBrochure(brochure)}
                                className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 group/btn"
                            >
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                Preview Design
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox / Modal */}
            {selectedBrochure && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedBrochure(null)}>
                    <div
                        className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            onClick={() => setSelectedBrochure(null)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <div className="w-full md:w-2/3 h-64 md:h-auto bg-slate-100 dark:bg-slate-900 relative">
                            <img
                                src={selectedBrochure.image}
                                alt={selectedBrochure.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-full md:w-1/3 p-8 flex flex-col justify-center">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{selectedBrochure.category}</span>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{selectedBrochure.title}</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                This template features {selectedBrochure.description || "a professional layout designed to maximize engagement."}
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Auto-generated Layout
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    AI Copywriting Included
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Print-Ready Export
                                </div>
                            </div>

                            <button className="mt-8 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg shadow-blue-500/30">
                                Use This Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
