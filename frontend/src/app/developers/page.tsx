"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Code2, Key, Shield, Zap, Cpu, Terminal, Copy, Check, Trash2, Plus, Sparkles, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/config';

interface APIKey {
    id: number;
    name: string;
    prefix: string;
    is_active: boolean;
    last_used_at: string | null;
    created_at: string;
}

export default function DeveloperPortal() {
    const { getToken } = useAuth();
    const [keys, setKeys] = useState<APIKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);
    const [recentlyCreatedKey, setRecentlyCreatedKey] = useState<{ id: number, secret: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeLang, setActiveLang] = useState<'javascript' | 'python' | 'curl'>('javascript');

    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('introduction');

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id.toLowerCase());
        if (element) {
            const offset = 120; // Account for fixed navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveSection(id.toLowerCase());
        }
    };

    const sections = [
        { id: 'introduction', title: 'Introduction' },
        { id: 'authentication', title: 'Authentication' },
        { id: 'endpoints', title: 'Endpoints' },
        { id: 'webhooks', title: 'Webhooks' },
        { id: 'sdks', title: 'SDKs' },
        { id: 'rate-limits', title: 'Rate Limits' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            const currentSection = sections.find(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    return scrollPosition >= top && scrollPosition < top + height;
                }
                return false;
            });
            if (currentSection && currentSection.id !== activeSection) {
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection]);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/keys/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setKeys(data);
            }
        } catch (error) {
            console.error("Failed to fetch API keys", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;
        setCreating(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/keys/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newKeyName.trim() })
            });

            if (res.ok) {
                const newKey: any = await res.json();
                setKeys([...keys, newKey]);
                setRecentlyCreatedKey({ id: newKey.id, secret: newKey.secret });
                setShowNewKeyModal(false);
                setNewKeyName('');
            } else {
                const errorData = await res.json();
                alert(errorData.detail || 'Failed to create API key');
            }
        } catch (error) {
            console.error("Failed to create API key", error);
            alert("An error occurred");
        } finally {
            setCreating(false);
        }
    };

    const handleRevoke = async (id: number) => {
        if (!confirm("Are you sure you want to revoke this key? Any integrations using it will immediately stop working.")) return;

        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/keys/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setKeys(keys.filter(k => k.id !== id));
            }
        } catch (error) {
            console.error("Failed to revoke API key", error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const displayKey = recentlyCreatedKey?.secret || (keys.length > 0 ? keys[0].prefix + '********************' : 'YOUR_API_KEY');

    const codeExamples = {
        javascript: `// Install: npm install @brochuregen/sdk
import { BrochureGen } from '@brochuregen/sdk';

const bg = new BrochureGen('${displayKey}');

const brochure = await bg.generate({
  url: 'https://example.com',
  theme: 'modern',
  is_campaign: true
});

console.log(brochure.pdf_url);`,
        python: `# Install: pip install brochuregen
from brochuregen import BrochureGen

client = BrochureGen('${displayKey}')

brochure = client.generate(
    url="https://example.com",
    theme="classic",
    is_campaign=True
)

print(brochure.pdf_url)`,
        curl: `curl -X POST https://api.brochuregen.com/v1/generate \\
  -H "Authorization: Bearer ${displayKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "theme": "playful"
  }'`
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden transition-colors duration-500">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[var(--background)]" />
                <div className="absolute inset-0 mesh-gradient opacity-20" />
            </div>

            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar - Navigation */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="sticky top-32">
                            <h3 className="text-xs font-bold text-cyan-600 dark:text-cyan-400/80 uppercase tracking-[0.3em] mb-6">Documentation</h3>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button 
                                        key={section.id} 
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border border-transparent transition-all duration-300 ${activeSection === section.id ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]' : 'text-slate-400 hover:bg-[var(--foreground)]/5 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/10'}`}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-12 p-6 premium-card border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20">
                                <h4 className="font-bold mb-2 text-blue-400">Need a custom plan?</h4>
                                <p className="text-xs text-[var(--foreground)]/50 mb-4 leading-relaxed">For high-volume API access and custom branding requirements.</p>
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20">Contact Sales</button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-12">

                        {/* Header */}
                        <div id="introduction" className="scroll-mt-32">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold mb-6 border border-cyan-500/20 dark:border-cyan-500/30 backdrop-blur-md tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                DEVELOPER PORTAL // STABLE
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter mb-4 text-[var(--foreground)]">
                                Build the <span className="gradient-text">future</span> of marketing.
                            </h1>
                            <p className="text-xl text-[var(--foreground)]/60 max-w-2xl leading-relaxed">
                                Use our high-performance AI engine to generate print catalogs, event flyers, and digital brochures programmatically.
                            </p>
                        </div>

                        {/* API Keys Card */}
                        <div id="authentication" className="premium-card p-10 bg-[var(--card-bg)] border-cyan-500/20 scroll-mt-32">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-3 text-cyan-600 dark:text-cyan-400">
                                    <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 ring-1 ring-cyan-500/30">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    API Authentication
                                </h2>
                                <button
                                    onClick={() => setShowNewKeyModal(true)}
                                    disabled={keys.length >= 5}
                                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-black rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                                >
                                    <Plus size={14} /> Generate New Key
                                </button>
                            </div>

                            {loading ? (
                                <div className="h-32 flex items-center justify-center">
                                    <Cpu size={24} className="animate-pulse text-cyan-500/50" />
                                </div>
                            ) : keys.length === 0 ? (
                                <div className="p-8 text-center bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl">
                                    <Key size={24} className="mx-auto mb-3 text-[var(--foreground)]/20" />
                                    <h3 className="text-sm font-bold text-[var(--foreground)]/70">No API keys active</h3>
                                    <p className="text-xs text-[var(--foreground)]/50 mt-1">Generate a key to authenticate your requests.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {keys.map(key => (
                                        <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all">
                                            <div>
                                                <h4 className="text-sm font-bold text-white/90 mb-1">{key.name}</h4>
                                                <div className="flex items-center gap-3 text-xs font-mono text-cyan-600 dark:text-cyan-400/80">
                                                    <span>{key.prefix}••••••••••••••••••••</span>
                                                    <span className="text-[var(--foreground)]/30">•</span>
                                                    <span className="text-[var(--foreground)]/40 text-[10px] tracking-wider uppercase">Created {new Date(key.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRevoke(key.id)}
                                                className="px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Trash2 size={12} /> Revoke
                                            </button>
                                        </div>
                                    ))}
                                    <p className="text-[10px] text-[var(--foreground)]/40 text-center mt-4 uppercase tracking-widest">You can have up to 5 active keys deployed simultaneously.</p>
                                </div>
                            )}
                        </div>

                        {/* Interactive Code Example */}
                        <div id="sdks" className="bg-[var(--card-bg)] rounded-[2.5rem] overflow-hidden border border-[var(--glass-border)] shadow-2xl backdrop-blur-xl group scroll-mt-32">
                            <div className="px-8 py-5 bg-[var(--foreground)]/5 border-b border-[var(--glass-border)] flex items-center justify-between">
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
                                <pre className="text-sm font-mono text-cyan-950 dark:text-cyan-100/80 leading-relaxed overflow-x-auto">
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
                        <div id="endpoints" className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-32">
                            <div className="premium-card p-10 bg-fuchsia-500/5 dark:bg-fuchsia-950/20 border-fuchsia-500/20">
                                <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.3em] block mb-6">Core Endpoint</span>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="px-3 py-1.5 bg-fuchsia-500 text-black font-black rounded text-[10px] tracking-tighter">POST</span>
                                    <code className="text-lg font-bold text-white/90">/v1/generate</code>
                                </div>
                                <p className="text-sm text-[var(--foreground)]/60 leading-relaxed mb-8">Generate a high-resolution brochure from a URL or raw data payload.</p>
                                <div className="space-y-4">
                                    {['url', 'theme', 'is_campaign', 'brand_id'].map(p => (
                                        <div key={p} className="flex items-center justify-between text-xs py-2.5 border-b border-[var(--glass-border)]">
                                            <code className="font-bold text-cyan-600 dark:text-cyan-400/80">{p}</code>
                                            <span className="text-[var(--foreground)]/50 italic text-[10px]">string</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div id="webhooks" className="premium-card p-10 bg-cyan-500/5 dark:bg-cyan-950/20 border-cyan-500/20 scroll-mt-32">
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] block mb-6">Webhook Delivery</span>
                                <h3 className="text-2xl font-bold mb-4 text-white">Asynchronous Delivery</h3>
                                <p className="text-sm text-[var(--foreground)]/60 leading-relaxed mb-8">
                                    Subscribe to events to receive PDF URLs the moment they are generated by our premium servers.
                                </p>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)]">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-cyan-900/50 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                                0{i}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-cyan-400/60 tracking-[0.2em] uppercase block">Average Latency</span>
                                        <span className="text-xs font-bold text-[var(--foreground)]">7ms Response Time</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rate Limits Section */}
                        <div id="rate-limits" className="premium-card p-10 bg-[var(--foreground)]/[0.02] dark:bg-slate-900/40 border-[var(--glass-border)] scroll-mt-32">
                            <span className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.3em] block mb-6">Service Quotas</span>
                            <h2 className="text-3xl font-black tracking-tighter mb-8 italic uppercase text-[var(--foreground)]">Rate Limits</h2>
                            <p className="text-sm text-[var(--foreground)]/60 leading-relaxed mb-10">
                                To ensure high availability and premium quality of service for all users, our API enforces rate limits based on your subscription tier. All limits are enforced on a per-API-key basis.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { tier: 'Starter', limit: '60 RPM', desc: 'Perfect for small projects.' },
                                    { tier: 'Pro', limit: '300 RPM', desc: 'For growing businesses.' },
                                    { tier: 'Enterprise', limit: 'Custom', desc: 'Individually tailored quotas.' }
                                ].map((tier) => (
                                    <div key={tier.tier} className="p-6 bg-[var(--foreground)]/5 dark:bg-black/40 border border-[var(--glass-border)] rounded-2xl hover:border-cyan-500/30 transition-all">
                                        <div className="text-[10px] font-black text-[var(--foreground)]/30 uppercase mb-2 tracking-widest">{tier.tier}</div>
                                        <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 italic mb-2">{tier.limit}</div>
                                        <div className="text-[10px] text-[var(--foreground)]/50 font-medium uppercase tracking-wider">{tier.desc}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <Shield className="text-blue-600 dark:text-blue-400 w-5 h-5 shrink-0" />
                                <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                                    Higher limits and dedicated infrastructure are available for Enterprise customers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {showNewKeyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewKeyModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[var(--background)] border border-[var(--glass-border)] rounded-3xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-xl font-black text-[var(--foreground)] italic uppercase tracking-tighter mb-2">Create Access Token</h3>
                            <p className="text-[10px] font-bold text-[var(--foreground)]/50 uppercase tracking-widest mb-6">Assign a name for this API key.</p>
 
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={newKeyName}
                                    onChange={e => setNewKeyName(e.target.value)}
                                    placeholder="e.g. Zapier Integration"
                                    className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] placeholder:[var(--foreground)]/30 focus:border-cyan-500/50 outline-none uppercase font-bold tracking-widest"
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowNewKeyModal(false)} className="flex-1 py-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-[var(--glass-border)]">Cancel</button>
                                    <button onClick={handleCreateKey} disabled={creating || !newKeyName.trim()} className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex justify-center items-center">
                                        {creating ? <Cpu size={14} className="animate-pulse" /> : 'Generate'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {recentlyCreatedKey && recentlyCreatedKey.secret && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-gradient-to-b from-slate-900 to-black border border-emerald-500/30 rounded-[2rem] p-8 max-w-xl w-full shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50">
                                <ShieldAlert size={20} />
                            </div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Token Generated</h3>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-8">Save this key now. It will never be shown again.</p>

                            <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center gap-4 mb-8 relative overflow-hidden group">
                                <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500"></div>
                                <code className="text-sm text-cyan-600 dark:text-cyan-300 font-mono flex-1 break-all select-all">{recentlyCreatedKey.secret}</code>
                                <button onClick={() => copyToClipboard(recentlyCreatedKey.secret!)} className="p-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded-lg transition-all shrink-0">
                                    {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} className="text-[var(--foreground)]/60" />}
                                </button>
                            </div>

                            <button onClick={() => setRecentlyCreatedKey(null)} className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg">
                                I Have Saved This Token securely
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
