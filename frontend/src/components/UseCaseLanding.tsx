"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Link from 'next/link';

interface UseCaseProps {
    industry: string;
    title: string;
    description: string;
    icon: string;
    benefits: string[];
    features: { title: string; desc: string; icon: string }[];
    ctaText?: string;
}

export default function UseCaseLanding({
    industry,
    title,
    description,
    icon,
    benefits,
    features,
    ctaText = "Start Generating Now"
}: UseCaseProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
                {/* Hero Section */}
                <div className="text-center mb-24 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -z-10"></div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-bold mb-6 border border-slate-200 dark:border-slate-800 uppercase tracking-widest"
                    >
                        {icon} AI FOR {industry}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        {description}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/25 hover:scale-105 inline-block">
                            {ctaText}
                        </Link>
                    </motion.div>
                </div>

                {/* Benefits List */}
                <div className="flex flex-wrap justify-center gap-8 mb-32">
                    {benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            {benefit}
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-8 group hover:border-blue-500/50 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-2xl mb-6 border border-blue-100 dark:border-blue-800">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Closing CTA */}
                <div className="text-center py-20 border-t border-slate-100 dark:border-slate-900">
                    <h2 className="text-4xl font-bold mb-6">Ready to transform your {industry.toLowerCase()} marketing?</h2>
                    <p className="text-slate-500 mb-10">Be one of the first professional teams to use BrochureGen's AI Studio.</p>
                    <Link href="/signup" className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold rounded-2xl transition-all hover:scale-105 shadow-2xl">
                        Get Started
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
