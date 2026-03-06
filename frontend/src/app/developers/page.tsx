"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function DeveloperPortal() {
    const [apiKey, setApiKey] = useState('bg_live_••••••••••••••••••••••••••••');
    const [showKey, setShowKey] = useState(false);
    const [activeLang, setActiveLang] = useState<'javascript' | 'python' | 'curl'>('javascript');

    const generateNewKey = () => {
        if (confirm("Are you sure? Your old API key will stop working immediately.")) {
            setApiKey('bg_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
            setShowKey(true);
        }
    };

    const codeExamples = {
        javascript: `// Install: npm install @brochuregen/sdk
import { BrochureGen } from '@brochuregen/sdk';

const bg = new BrochureGen('${showKey ? apiKey : 'YOUR_API_KEY'}');

const brochure = await bg.generate({
  url: 'https://example.com',
  theme: 'modern',
  is_campaign: true
});

console.log(brochure.pdf_url);`,
        python: `# Install: pip install brochuregen
from brochuregen import BrochureGen

client = BrochureGen('${showKey ? apiKey : 'YOUR_API_KEY'}')

brochure = client.generate(
    url="https://example.com",
    theme="classic",
    is_campaign=True
)

print(brochure.pdf_url)`,
        curl: `curl -X POST https://api.brochuregen.com/v1/generate \\
  -H "Authorization: Bearer ${showKey ? apiKey : 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "theme": "playful"
  }'`
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-cyan-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 mesh-gradient opacity-20" />
                <div className="absolute inset-0 animate-aurora opacity-10" />
                <div className="scanline" />
            </div>

            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar - Navigation */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="sticky top-32">
                            <h3 className="text-xs font-bold text-cyan-400/80 uppercase tracking-[0.3em] mb-6">Documentation</h3>
                            <nav className="space-y-1">
                                {['Introduction', 'Authentication', 'Endpoints', 'Webhooks', 'SDKs', 'Rate Limits'].map((item) => (
                                    <button key={item} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-cyan-400 border border-transparent hover:border-cyan-500/20 transition-all duration-300">
                                        {item}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-12 p-6 premium-card border-blue-500/30 bg-blue-950/20">
                                <h4 className="font-bold mb-2 text-blue-400">Need a custom plan?</h4>
                                <p className="text-xs text-slate-400 mb-4 leading-relaxed">For high-volume API access and custom LLM tuning.</p>
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20">Contact Sales</button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-12">

                        {/* Header */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 text-cyan-400 text-[10px] font-bold mb-6 border border-cyan-500/30 backdrop-blur-md tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                DEVELOPER HUB v2.0 // STABLE
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter mb-4 glitch-text">
                                Build the <span className="gradient-text">future</span> of marketing.
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                                Use our world-class AI engine to generate print catalogs, event flyers, and digital brochures programmatically.
                            </p>
                        </div>

                        {/* API Keys Card */}
                        <div className="premium-card p-10 bg-black/40 border-cyan-500/20">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-cyan-400">
                                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 ring-1 ring-cyan-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                                </div>
                                API Authentication
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex-1 relative group">
                                            <input
                                                type={showKey ? "text" : "password"}
                                                value={apiKey}
                                                readOnly
                                                className="w-full px-5 py-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-sm outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white/90"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                        </div>
                                        <button
                                            onClick={() => setShowKey(!showKey)}
                                            className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all text-slate-400 hover:text-cyan-400"
                                        >
                                            {showKey ?
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg> :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            }
                                        </button>
                                    </div>
                                    <button onClick={generateNewKey} className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] hover:text-red-400 transition-colors">Revoke and Regenerate Key</button>
                                </div>
                                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4 font-medium italic">Never share your secret API keys in client-side code or public repositories.</p>
                                    <Link href="/docs#security" className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-widest transition-all">
                                        Security Guide <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Code Example */}
                        <div className="bg-black/60 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl group">
                            <div className="px-8 py-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                <div className="flex gap-6">
                                    {(['javascript', 'python', 'curl'] as const).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveLang(lang)}
                                            className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all relative py-2 ${activeLang === lang ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            {lang}
                                            {activeLang === lang && (
                                                <motion.div layoutId="activeLang" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                                </div>
                            </div>
                            <div className="p-10">
                                <pre className="text-sm font-mono text-cyan-100/80 leading-relaxed overflow-x-auto">
                                    <AnimatePresence mode="wait">
                                        <motion.code
                                            key={activeLang}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="block"
                                        >
                                            {codeExamples[activeLang]}
                                        </motion.code>
                                    </AnimatePresence>
                                </pre>
                            </div>
                        </div>

                        {/* API Reference Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="premium-card p-10 bg-fuchsia-950/20 border-fuchsia-500/20">
                                <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.3em] block mb-6">Core Endpoint</span>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="px-3 py-1.5 bg-fuchsia-500 text-black font-black rounded text-[10px] tracking-tighter">POST</span>
                                    <code className="text-lg font-bold text-white/90">/v1/generate</code>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-8">Generate a high-resolution brochure from a URL or raw data payload.</p>
                                <div className="space-y-4">
                                    {['url', 'theme', 'is_campaign', 'brand_id'].map(p => (
                                        <div key={p} className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
                                            <code className="font-bold text-cyan-400/80">{p}</code>
                                            <span className="text-slate-500 italic text-[10px]">string</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="premium-card p-10 bg-cyan-950/20 border-cyan-500/20">
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] block mb-6">Webhook Delivery</span>
                                <h3 className="text-2xl font-bold mb-4 text-white">Asynchronous Delivery</h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                    Subscribe to `brochure.completed` events to receive PDF URLs the moment they are generated by our GPU clusters.
                                </p>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-cyan-900/50 animate-pulse flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                                0{i}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-cyan-400/60 tracking-[0.2em] uppercase block">Average Latency</span>
                                        <span className="text-xs font-bold text-white">7ms Response Time</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
