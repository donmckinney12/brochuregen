"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, ChevronRight, ArrowRight, Sparkles, TrendingUp, Target } from "lucide-react";

const blogPosts = [
    {
        title: "How to Design a Real Estate Brochure in 5 Minutes with AI",
        excerpt: "Forget expensive designers. Learn how to turn your property listing URL into a stunning, print-ready PDF using AI.",
        href: "/blog/real-estate-brochure-guide",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
        category: "Real Estate",
        readTime: "5 min read",
        color: "blue"
    },
    {
        title: "Mastering Brand Voice: Maintaining Professional Consistency with AI",
        excerpt: "Learn how to use AI to reflect your brand's unique character and maintain a consistent tone across all marketing materials.",
        href: "/blog/brand-voice-guide",
        image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80",
        category: "Strategy",
        readTime: "6 min read",
        color: "indigo"
    },
    {
        title: "Marketing Evolution: Top 5 Trends Reshaping Business in 2026",
        excerpt: "Explore the hyper-personalization, interactive content, and tech stack consolidation trends winning in 2026.",
        href: "/blog/marketing-trends-2024",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        category: "Insights",
        readTime: "7 min read",
        color: "rose"
    },
    {
        title: "Scaling Lead Generation: The Power of Interactive Content",
        excerpt: "Turn your marketing materials into live, trackable experiences that convert and provide behavioral intelligence.",
        href: "/blog/scaling-lead-gen",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        category: "Growth",
        readTime: "5 min read",
        color: "emerald"
    }
];

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            </div>

            <Navbar />

            <main className="pt-40 pb-32 px-6 max-w-7xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 backdrop-blur-md">
                            <BookOpen size={14} /> Insights & Guides
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-8 uppercase">
                            BrochureGen <span className="gradient-text">Resources</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed italic">
                            Strategies and technical insights on automating high-end marketing materials and scaling your professional reach.
                        </p>
                    </motion.div>
                </div>

                {/* Featured Post (Optional, but let's go with a balanced grid first) */}

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, idx) => (
                        <motion.div
                            key={post.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Link href={post.href} className="group block h-full">
                                <div className="relative h-full flex flex-col bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-indigo-500/10">
                                    {/* Image Container */}
                                    <div className="aspect-[16/10] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60 z-10"></div>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 z-20">
                                            <span className={`px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white`}>
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-4 opacity-40">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{post.readTime}</span>
                                        </div>
                                        <h2 className="text-2xl font-black italic tracking-tighter mb-4 leading-tight group-hover:text-indigo-400 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-white/40 font-medium leading-relaxed mb-8 italic">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                                            Read Article <ArrowRight size={14} className="transform group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Newsletter / CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: blogPosts.length * 0.1 }}
                        className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[center_top] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
                        <Sparkles className="w-12 h-12 text-indigo-400 mb-6 animate-pulse" />
                        <h3 className="text-2xl font-black italic tracking-tighter mb-4 uppercase">Stay Informed</h3>
                        <p className="text-sm text-white/50 font-medium italic mb-8 leading-relaxed">
                            Subscribe to receive the latest sales strategies and AI insights directly to your inbox.
                        </p>
                        <button className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all active:scale-95">
                            Join Newsletter
                        </button>
                    </motion.div>
                </div>
            </main>

            {/* Subtle Footer Watermark */}
            <div className="absolute bottom-12 w-full text-center opacity-10">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">BrochureGen Resources Matrix // Build 2026</p>
            </div>
        </div>
    );
}
