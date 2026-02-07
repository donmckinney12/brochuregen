"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-purple-100 dark:selection:bg-purple-900/30">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        BrochureGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Blog</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Tips, tricks, and guides on how to automate your marketing materials and grow your business with AI.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Article Card 1 */}
                    <Link href="/blog/real-estate-brochure-guide" className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                                alt="Modern Real Estate Brochure Design"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                                <span className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">Real Estate</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500 dark:text-slate-400">5 min read</span>
                            </div>
                            <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                How to Design a Real Estate Brochure in 5 Minutes with AI
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                                Forget expensive designers. Learn how to turn your property listing URL into a stunning, print-ready PDF using BrochureGen's AI engine.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                                Read Article <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </div>
                        </div>
                    </Link>

                    {/* Placeholder Card 2 */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl flex items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-400 dark:text-slate-600 mb-2">More coming soon...</h3>
                            <p className="text-sm text-slate-400 dark:text-slate-600 max-w-xs mx-auto">
                                We're writing guides on corporate profiles, event flyers, and more. Stay tuned!
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
