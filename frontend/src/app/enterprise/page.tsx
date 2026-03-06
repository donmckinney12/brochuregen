"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EnterprisePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
            <Navbar />

            <main className="pt-32 pb-20 overflow-hidden">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-xs font-bold mb-8 border border-purple-100 dark:border-purple-800 backdrop-blur-md">
                            ENTERPRISE SOLUTIONS
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                            Scale Your <br />
                            <span className="gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Brand Globally.</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                            BrochureGen Enterprise provides the security, control, and automation capabilities large organizations need to generate brand-accurate collateral across thousands of local agents or departments.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            {['SSO/SAML', 'Audit Logs', 'Custom AI Training', 'Priority Support'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
                        <div className="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-2xl font-bold mb-6">Request a Demo</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                                        <input type="text" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                                        <input type="text" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Email</label>
                                    <input type="email" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Organization Size</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                                        <option>50 - 200 employees</option>
                                        <option>201 - 500 employees</option>
                                        <option>500+ employees</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status !== 'idle'}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Contact Sales'}
                                </button>
                                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">Priority response within 24 hours</p>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Enterprise Features Detail */}
                <div className="bg-slate-50 dark:bg-slate-900/50 py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Corporate Governance</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Maintain total control over your brand assets while giving your team the power of generative AI.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "Centralized Brand Vault",
                                    desc: "Lock down your brand colors, logos, and fonts globally. Ensure every brochure generated meets your strict compliance standards.",
                                    icon: "🔒"
                                },
                                {
                                    title: "Team Workspaces",
                                    desc: "Structure your organization by departments or locations. Manage credits and visibility at the manager level.",
                                    icon: "👥"
                                },
                                {
                                    title: "Custom AI Model Training",
                                    desc: "We can fine-tune our AI on your past successful collateral and brand voice to ensure perfect alignment.",
                                    icon: "🧠"
                                },
                                {
                                    title: "API-First Infrastructure",
                                    desc: "Integrate brochure generation directly into your CRM (Salesforce, HubSpot) or internal portals.",
                                    icon: "🔌"
                                },
                                {
                                    title: "Bank-Grade Security",
                                    desc: "SOC2 Type II compliant infrastructure with SSO, advanced audit logs, and data residency options.",
                                    icon: "🛡️"
                                },
                                {
                                    title: "Infinite Scalability",
                                    desc: "Generate 100,000+ pieces of collateral monthly with dedicated high-performance GPU clusters.",
                                    icon: "⚡"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
                                >
                                    <div className="text-3xl mb-6">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
