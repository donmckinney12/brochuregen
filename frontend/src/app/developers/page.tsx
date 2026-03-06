"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar - Navigation */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="sticky top-32">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Documentation</h3>
                            <nav className="space-y-1">
                                {['Introduction', 'Authentication', 'Endpoints', 'Webhooks', 'SDKs', 'Rate Limits'].map((item) => (
                                    <button key={item} className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-blue-600 transition-all">
                                        {item}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-12 p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                                <h4 className="font-bold mb-2">Need a custom plan?</h4>
                                <p className="text-xs text-blue-100 mb-4 leading-relaxed">For high-volume API access and custom LLM tuning.</p>
                                <button className="w-full py-2 bg-white text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50">Contact Sales</button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-12">

                        {/* Header */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800 backdrop-blur-md">
                                DEVELOPER HUB v2.0
                            </div>
                            <h1 className="text-5xl font-black tracking-tight mb-4">Build the future of marketing.</h1>
                            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                                Use our world-class AI engine to generate print catalogs, event flyers, and digital brochures programmatically.
                            </p>
                        </div>

                        {/* API Keys Card */}
                        <div className="premium-card p-8 bg-white dark:bg-slate-900 border-blue-100/50 dark:border-blue-900/50">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                                </div>
                                API Authentication
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <div className="flex items-center gap-2 mb-4">
                                        <input
                                            type={showKey ? "text" : "password"}
                                            value={apiKey}
                                            readOnly
                                            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => setShowKey(!showKey)}
                                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            {showKey ?
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg> :
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            }
                                        </button>
                                    </div>
                                    <button onClick={generateNewKey} className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline">Revoke and Regenerate</button>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-xs text-slate-500 leading-relaxed mb-4">Never share your secret API keys in client-side code or public repositories.</p>
                                    <Link href="/docs#security" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-tight">
                                        Security Guide <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Code Example */}
                        <div className="bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl">
                            <div className="px-6 py-4 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
                                <div className="flex gap-4">
                                    {(['javascript', 'python', 'curl'] as const).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setActiveLang(lang)}
                                            className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeLang === lang ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                                </div>
                            </div>
                            <div className="p-8">
                                <pre className="text-sm font-mono text-blue-200/90 leading-relaxed overflow-x-auto">
                                    <AnimatePresence mode="wait">
                                        <motion.code
                                            key={activeLang}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
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
                            <div className="premium-card p-8">
                                <span className="text-xs font-bold text-green-500 uppercase tracking-[0.2em] block mb-4">Endpoint</span>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 font-black rounded text-xs">POST</span>
                                    <code className="text-sm font-bold">/v1/generate</code>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6">Generate a high-resolution brochure from a URL or raw data payload.</p>
                                <div className="space-y-3">
                                    {['url', 'theme', 'is_campaign', 'brand_id'].map(p => (
                                        <div key={p} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                                            <code className="font-bold text-blue-500">{p}</code>
                                            <span className="text-slate-400 italic">string</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="premium-card p-8 bg-slate-900 border-slate-800 text-white">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] block mb-4">Webhook Ready</span>
                                <h3 className="text-xl font-bold mb-4">Asynchronous Delivery</h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                    Subscribe to `brochure.completed` events to receive PDF URLs the moment they are generated by our GPU clusters.
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 animate-pulse"></div>)}
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">7ms Avg Latency</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
