"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BrochureCarousel from '@/components/BrochureCarousel';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const { isAuthenticated, user, getToken, isLoading, syncError } = useAuth();

    const handleUpgrade = async (plan: string) => {
        // ... (preserving handleUpgrade logic)
        if (isLoading) return;
        if (!isAuthenticated) { window.location.href = '/signup'; return; }
        if (!user) {
            if (syncError) { alert(`❌ [v28.1] Connection Failed: ${syncError}`); }
            else { alert("Profile is syncing..."); }
            return;
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/payment/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ user_id: user.id, email: user.email, plan, billing_cycle: billingCycle }),
            });
            if (!res.ok) throw new Error(`Backend Error (${res.status})`);
            const result = await res.json();
            if (result.url) window.location.href = result.url;
        } catch (e_unk: unknown) { const e = e_unk as Error; alert(`Error: ${e.message}`); }
    };

    const prices = {
        starter: billingCycle === 'monthly' ? 99 : 79,
        professional: billingCycle === 'monthly' ? 299 : 239,
        enterprise: billingCycle === 'monthly' ? 999 : 799,
        ultimate: billingCycle === 'monthly' ? 2499 : 1999,
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden transition-colors duration-500">
            {/* Background Layers - Solarized Genesis */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[var(--background)]" />
                <div className="absolute inset-0 mesh-gradient opacity-20" />
                <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-[var(--accent-primary)]/10 via-[var(--accent-secondary)]/5 to-transparent blur-[120px] opacity-40"></div>
                <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
            </div>

            <Navbar />

            <main className="pt-40 pb-32 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24 animate-in slide-in-from-top-4 fade-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-indigo-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Value Accumulation Nodes
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black mb-8 text-[var(--foreground)] tracking-tighter italic uppercase leading-[0.95]">
                        Transform your brand <br />
                        <span className="gradient-text">with Elite Design.</span>
                    </h1>
                    
                    <p className="text-lg text-[var(--foreground)]/50 font-bold max-w-2xl mx-auto mb-16 italic leading-relaxed">
                        Deploy the world's most advanced AI brochure engine. <br />
                        High-fidelity synthesis for high-performance teams.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-20 p-1.5 bg-[var(--foreground)]/[0.03] border border-[var(--glass-border)] rounded-2xl w-fit mx-auto backdrop-blur-xl">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-[var(--foreground)] text-[var(--background)] shadow-xl scale-[1.02]' : 'text-[var(--foreground)]/40 hover:text-[var(--foreground)]/60'}`}
                        >
                            Monthly Sync
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-[var(--accent-secondary)] text-white shadow-xl scale-[1.02]' : 'text-[var(--foreground)]/40 hover:text-[var(--foreground)]/60'}`}
                        >
                            Annual Matrix <span className="ml-2 opacity-60">(-20%)</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-40">
                    {[
                        {
                            name: 'Starter', price: prices.starter, color: 'indigo', border: 'border-[var(--glass-border)]',
                            features: ['50 Brochure Generations', 'Lead Management Basic', 'SEO Meta Optimization', 'Professional Themes', 'High-Res Export']
                        },
                        {
                            name: 'Professional', price: prices.professional, color: 'blue', border: 'border-blue-500/30', popular: true,
                            features: ['150 Brochure Generations', 'Analytics Dashboard', 'A/B Testing Integration', 'Team Collaboration', 'Precision Content Refiner']
                        },
                        {
                            name: 'Enterprise', price: prices.enterprise, color: 'cyan', border: 'border-[var(--glass-border)]',
                            features: ['300 Brochure Generations', 'Automated Follow-ups', 'Unlimited Team Members', 'Advanced Reporting', 'Brand Asset Management']
                        },
                        {
                            name: 'Ultimate', price: 'Custom', color: 'slate', border: 'border-[var(--glass-border)]',
                            features: ['Unlimited Generations', 'White-Label Branding', 'SSO Security', 'Custom AI Models', 'Dedicated Manager']
                        }
                    ].map((plan, i) => (
                        <div key={i} className={`premium-card p-10 flex flex-col relative group transition-all duration-500 ${plan.border} ${plan.popular ? 'bg-[var(--foreground)]/[0.01] ring-1 ring-blue-500/20' : 'bg-[var(--card-bg)]'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-10 bg-blue-500 text-white text-[8px] font-extrabold px-4 py-1.5 rounded-b-xl uppercase tracking-widest shadow-lg">
                                    Recommended
                                </div>
                            )}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[var(--foreground)]/40 italic">
                                    {plan.name} Tier
                                </h3>
                                <div className="flex items-baseline gap-2 text-[var(--foreground)]">
                                    <span className="text-5xl font-black italic tracking-tighter uppercase">{typeof plan.price === 'number' ? `$${plan.price}` : plan.price}</span>
                                    {typeof plan.price === 'number' && <span className="text-[var(--foreground)]/40 text-[10px] font-black uppercase tracking-widest">/sync</span>}
                                </div>
                            </div>

                            <ul className="flex-1 space-y-5 mb-12">
                                {plan.features.map((feat, fi) => (
                                    <li key={fi} className="flex items-start gap-3 text-[var(--foreground)]/60 text-[11px] font-bold uppercase tracking-wider leading-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 mt-1 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => plan.name === 'Ultimate' ? window.location.href='/enterprise' : handleUpgrade(plan.name.toLowerCase())}
                                className={`w-full py-5 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl ${plan.popular ? 'bg-blue-600 text-white border-b-4 border-blue-800' : 'bg-[var(--foreground)] text-[var(--background)] border-b-4 border-[var(--background)]/20'}`}
                            >
                                {plan.name === 'Ultimate' ? 'Initialize Contact' : 'Activate Node'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ Section with Premium Styling */}
                <div className="max-w-4xl mx-auto mb-40 premium-card p-20 border-[var(--glass-border)] bg-[var(--foreground)]/[0.01] relative overflow-hidden group">
                    <div className="absolute inset-0 noise-overlay opacity-[0.02]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black text-[var(--foreground)] mb-20 text-center italic tracking-tighter uppercase">Query Intelligence</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {[
                                { q: "Brochure Generations?", a: "Each generation allows you to synthesize one multi-fold brochure from a single URL node." },
                                { q: "Lead Processing?", a: "Centralized matrix for capturing prospects directly from your brochure assets." },
                                { q: "Analytics Sync?", a: "Real-time engagement telemetry and A/B variant testing active in mid-to-high tiers." },
                                { q: "Team Scaling?", a: "Multi-user organizations with shared assets and lead data sync capabilities." }
                            ].map((faq, i) => (
                                <div key={i} className="space-y-4">
                                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic">{faq.q}</h3>
                                    <p className="text-[var(--foreground)]/50 text-xs font-bold leading-relaxed uppercase tracking-widest">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="max-w-5xl mx-auto p-24 premium-card bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10 border-[var(--glass-border)] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -ml-64 -mb-64 group-hover:bg-indigo-500/20 transition-all duration-1000"></div>

                    <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-12 relative z-10 italic tracking-tighter uppercase leading-tight">
                        Ready to scale <br /> <span className="gradient-text">your operations?</span>
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
                        <Link href="/signup" className="w-full md:w-auto px-16 py-6 bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all outline outline-offset-4 outline-transparent hover:outline-[var(--foreground)]/20">
                            Deploy Now
                        </Link>
                        <Link href="/enterprise" className="w-full md:w-auto px-16 py-6 bg-white/10 backdrop-blur-3xl border border-[var(--foreground)]/10 text-[var(--foreground)] font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem] hover:bg-white/20 transition-all">
                            Consultation
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
