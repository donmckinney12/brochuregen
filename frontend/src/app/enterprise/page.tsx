"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Shield, Zap, Globe, MessageSquare, ArrowRight, CheckCircle2, Star, Sparkles, Loader2 } from 'lucide-react';
import { API_URL } from '@/config';
import Navbar from '@/components/Navbar';

export default function EnterprisePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        size: '50-200 employees',
        useCase: 'Brand Scalability',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch(`${API_URL}/api/v1/enterprise/intake`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    company: formData.company,
                    size: formData.size,
                    use_case: formData.useCase,
                    message: formData.message
                }),
            });

            if (res.ok) {
                setStatus('success');
            } else {
                throw new Error('Failed to submit inquiry');
            }
        } catch (err: any) {
            console.error(err);
            setStatus('idle');
            alert(`❌ [v28.1] Submission Failed: ${err.message || 'Connection Error'}\n\nCause: The frontend cannot reach the backend at ${API_URL}.\n\nFix: Ensure NEXT_PUBLIC_API_URL is set correctly in your Netlify dashboard.`);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500 overflow-hidden">
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
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                            Scale Your <br />
                            <span className="gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Brand Globally.</span>
                        </h1>
                        <p className="text-xl text-[var(--foreground)]/60 leading-relaxed mb-10">
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
                        <div className="relative bg-[var(--background)] dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-[var(--glass-border)] dark:border-slate-800">
                            <h3 className="text-2xl font-bold mb-6 italic tracking-tighter uppercase">Enterprise Inquiry</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-bold shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-[var(--foreground)]/5 dark:bg-slate-950/80 border border-[var(--glass-border)] dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-bold shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Work Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-bold shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Org Size</label>
                                        <select
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                            className="w-full px-4 py-3 bg-[var(--foreground)]/5 dark:bg-slate-950/80 border border-[var(--glass-border)] dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-sm font-bold shadow-sm"
                                        >
                                            <option>50-200 employees</option>
                                            <option>201-500 employees</option>
                                            <option>500+ employees</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Primary Objective</label>
                                        <select
                                            value={formData.useCase}
                                            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                                            className="w-full px-4 py-3 bg-[var(--foreground)]/[0.02] dark:bg-slate-950/80 border border-[var(--glass-border)] dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-sm font-bold shadow-sm"
                                        >
                                            <option>Brand Scalability</option>
                                            <option>Custom AI Training</option>
                                            <option>API Integration</option>
                                            <option>SSO / Security</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status !== 'idle'}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Processing...' : status === 'success' ? 'Inquiry Received' : 'Submit Inquiry'}
                                </button>
                                <p className="text-[10px] text-[var(--foreground)]/40 text-center uppercase tracking-[0.2em] font-black">Secure transmission active</p>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Enterprise Case Study Section */}
                <div className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden rounded-[3rem] bg-[var(--foreground)]/[0.03] dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950 p-12 lg:p-20 text-[var(--foreground)] dark:text-white border border-[var(--glass-border)] dark:border-white/10 shadow-3xl overflow-visible"
                        >
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-20 mask-gradient-to-l pointer-events-none"></div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-8 text-blue-400 font-bold tracking-widest uppercase text-xs">
                                        <Building2 className="w-5 h-5" />
                                        Case Study: Illustrative Success Pattern
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tight leading-tight italic uppercase">
                                        "BrochureGen transformed our <br />
                                        <span className="text-blue-400">enterprise content engine."</span>
                                    </h2>
                                    <blockquote className="text-xl text-[var(--foreground)]/70 dark:text-slate-300 italic mb-10 leading-relaxed border-l-4 border-blue-500 pl-8">
                                        "Scaling professional marketing material for thousands of local agents used to be a massive bottleneck. We achieved total brand consistency while reducing design overhead by over 60%."
                                    </blockquote>
                                    <div>
                                        <div className="text-lg font-bold">Alex Rivera</div>
                                        <div className="text-blue-400 text-sm italic font-medium uppercase tracking-widest">Director of Brand Strategy, Global Fortune 500</div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div className="grid grid-cols-2 gap-8 items-center mb-12">
                                        <div className="p-8 bg-[var(--foreground)]/[0.04] dark:bg-white/5 backdrop-blur-md rounded-3xl border border-[var(--glass-border)] dark:border-white/10 text-center hover:bg-white/10 transition-all">
                                            <div className="text-5xl font-black text-blue-400 mb-2">400%</div>
                                            <div className="text-xs uppercase tracking-widest font-black text-slate-400">Lead Quality Increase</div>
                                        </div>
                                        <div className="p-8 bg-[var(--foreground)]/[0.04] dark:bg-white/5 backdrop-blur-md rounded-3xl border border-[var(--glass-border)] dark:border-white/10 text-center hover:bg-white/10 transition-all">
                                            <div className="text-5xl font-black text-blue-400 mb-2">10k+</div>
                                            <div className="text-xs uppercase tracking-widest font-black text-slate-400">Monthly Generations</div>
                                        </div>
                                        <div className="p-8 bg-[var(--foreground)]/[0.04] dark:bg-white/5 backdrop-blur-md rounded-3xl border border-[var(--glass-border)] dark:border-white/10 text-center hover:bg-white/10 transition-all">
                                            <div className="text-5xl font-black text-blue-400 mb-2">60%</div>
                                            <div className="text-xs uppercase tracking-widest font-black text-slate-400">Cost Reduction</div>
                                        </div>
                                        <div className="p-8 bg-[var(--foreground)]/[0.04] dark:bg-white/5 backdrop-blur-md rounded-3xl border border-[var(--glass-border)] dark:border-white/10 text-center hover:bg-white/10 transition-all">
                                            <div className="text-5xl font-black text-blue-400 mb-2">24h</div>
                                            <div className="text-xs uppercase tracking-widest font-black text-slate-400">Global Launch Time</div>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-[var(--foreground)]/30 text-center lg:text-right uppercase tracking-[0.2em] font-bold">
                                        * Note: This case study is for illustrative purposes and uses hypothetical success metrics based on aggregate user data.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
