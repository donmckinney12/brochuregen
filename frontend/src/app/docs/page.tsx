"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('getting-started');

    const sections = [
        { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
        { id: 'core-concepts', title: 'Core Concepts', icon: '🧠' },
        { id: 'protocol-cli', title: 'Protocol CLI', icon: '💻' },
        { id: 'api-nexus', title: 'API Nexus', icon: '🔌' },
        { id: 'security', title: 'Security', icon: '🛡️' },
    ];

    const protocolCommands = [
        { cmd: 'brochuregen initiate --url <target>', desc: 'Start a new neural sync with a target URL.' },
        { cmd: 'brochuregen refine --id <uuid> --tone <vibe>', desc: 'Adjust the brand voice of a generated asset.' },
        { cmd: 'brochuregen export --format pdf', desc: 'Generate a print-ready CMYK document.' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Navigation */}
                <aside className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-8 hidden lg:block">
                    <div className="sticky top-40 space-y-2">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic">Documentation</h3>
                        {sections.map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSection(sec.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === sec.id ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                            >
                                <span className="text-lg">{sec.icon}</span>
                                {sec.title}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <header className="mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black mb-6 border border-cyan-500/20 uppercase tracking-widest">
                            Official Protocol Documentation v0.5.4
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-8 italic uppercase">Systems <span className="gradient-text">Manual</span></h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            Welcome to the Archive. This database contains all necessary directives for controlling the BrochureGen neural cluster.
                        </p>
                    </header>

                    {/* Dynamic Section Content */}
                    <div className="space-y-12">
                        {activeSection === 'getting-started' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" transition={{ duration: 0.3 }}>
                                <h2 className="text-2xl font-black uppercase tracking-tight">01. Initialization</h2>
                                <p className="text-slate-400 leading-relaxed italic">Begin your journey by connecting your primary node to the BrochureGen cluster. Once synchronized, you can manifest high-fidelity marketing assets in seconds.</p>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <h4 className="font-bold text-cyan-400 mb-2 uppercase text-xs tracking-widest">Protocol Setup</h4>
                                    <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2">
                                        <li>Register your Node ID via the Auth Gate.</li>
                                        <li>Configure your Brand Vault parameters.</li>
                                        <li>Enter a target URL for neural scanning.</li>
                                    </ol>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'core-concepts' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" transition={{ duration: 0.3 }}>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Neural Manifestation</h2>
                                <p className="text-slate-400 leading-relaxed italic">Our system utilizes a decentralized cluster of GPU nodes to analyze, synthesize, and render brand-accurate collateral.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900 border border-white/10 rounded-xl">
                                        <div className="text-cyan-500 mb-2 text-xl">⚡</div>
                                        <div className="font-bold text-xs uppercase mb-1 text-white">Scraper Layer</div>
                                        <div className="text-[10px] text-slate-500 italic">High-bandwidth DOM traversal and asset extraction.</div>
                                    </div>
                                    <div className="p-4 bg-slate-900 border border-white/10 rounded-xl">
                                        <div className="text-fuchsia-500 mb-2 text-xl">🧠</div>
                                        <div className="font-bold text-xs uppercase mb-1 text-white">Inference Engine</div>
                                        <div className="text-[10px] text-slate-500 italic">LLM-driven copywriting and layout analysis.</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'protocol-cli' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <h2 className="text-2xl font-black tracking-tight mb-8 uppercase flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 text-xs font-mono border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]">$</span>
                                    Protocol CLI Reference
                                </h2>
                                <div className="space-y-6">
                                    {protocolCommands.map((item, i) => (
                                        <div key={i} className="bg-slate-900 rounded-2xl p-6 border border-white/5 group hover:border-cyan-500/30 transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <code className="text-cyan-400 font-mono text-sm font-bold tracking-tight">
                                                    {item.cmd}
                                                </code>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(item.cmd)}
                                                    className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-cyan-500 transition-colors"
                                                >
                                                    Copy CMD
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-400 font-medium italic">
                                                {item.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'api-nexus' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" transition={{ duration: 0.3 }}>
                                <h2 className="text-2xl font-black uppercase tracking-tight">API Nexus Integration</h2>
                                <p className="text-slate-400 leading-relaxed italic">Connect your external applications directly to the BrochureGen manifold via RESTful JSON protocols.</p>
                                <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 font-mono text-[10px]">
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-green-500">POST</span>
                                        <span className="text-white/40">/api/v1/scrape/scrape</span>
                                    </div>
                                    <div className="text-white">
                                        {`{`} <br />
                                        &nbsp;&nbsp;&quot;url&quot;: &quot;https://nexus.io&quot;, <br />
                                        &nbsp;&nbsp;&quot;layout_theme&quot;: &quot;holographic&quot; <br />
                                        {`}`}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'security' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" transition={{ duration: 0.3 }}>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Security Directives</h2>
                                <p className="text-slate-400 leading-relaxed italic">All data transmitted through the BrochureGen cluster is protected by AES-256 neural encryption.</p>
                                <ul className="space-y-4">
                                    {[
                                        { t: 'Encryption', d: 'Data at rest and in transit uses bank-grade protocols.' },
                                        { t: 'Isolation', d: 'Each workspace operates in a sandboxed neural environment.' },
                                        { t: 'Compliance', d: 'SOC2 Type II and GDPR ready infrastructure.' }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-cyan-500 font-black">#0{i + 1}</span>
                                            <div>
                                                <div className="font-bold text-xs uppercase">{item.t}</div>
                                                <div className="text-[10px] text-slate-500">{item.d}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer FAQ */}
                    <section className="mt-32 pt-16 border-t border-white/5">
                        <h2 className="text-2xl font-black tracking-tight mb-8 uppercase">Common Inquiries</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {[
                                { q: "Neural Sync Limit?", a: "Each tier has a defined credit allocation. Synced profiles reset every 30 terrestrial days." },
                                { q: "Data Preservation?", a: "Your brand vault is encrypted and stored in a decentralized cluster." },
                                { q: "Custom Models?", a: "Enterprise nodes can request dedicated training on proprietary brand assets." }
                            ].map((faq, i) => (
                                <div key={i} className="p-8 bg-black/20 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all">
                                    <h3 className="font-bold text-white mb-3 tracking-tight">{faq.q}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium italic">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

import { motion } from 'framer-motion';
