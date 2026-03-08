"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BrochureCarousel from '@/components/BrochureCarousel';
import { useAuth } from '@/context/AuthContext';

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const { isAuthenticated, user, getToken } = useAuth();

    const handleUpgrade = async (plan: string) => {
        if (!user) {
            window.location.href = '/signup';
            return;
        }

        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/payment/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.id,
                    email: user.email,
                    plan: plan,
                    billing_cycle: billingCycle
                }),
            });

            const result = await res.json();
            if (result.url) {
                window.location.href = result.url;
            } else {
                console.error("Checkout Error:", result);
                alert(`Failed to initiate checkout: ${result.detail || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            alert("Error communicating with payment server");
        }
    };

    const prices = {
        starter: billingCycle === 'monthly' ? 99 : 79,
        professional: billingCycle === 'monthly' ? 299 : 239,
        enterprise: billingCycle === 'monthly' ? 999 : 799,
        ultimate: billingCycle === 'monthly' ? 2499 : 1999,
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-primary)]/30 selection:text-[var(--foreground)] transition-colors duration-500">
            <Navbar />
            <div className="fixed inset-0 scanline opacity-[0.03] dark:opacity-20 pointer-events-none z-50"></div>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12 animate-in slide-in-from-bottom-5 fade-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)] mb-8 mx-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Neural Upgrade Protocol
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 text-[var(--foreground)] tracking-tighter italic uppercase">
                        Scale your impact <br />
                        <span className="gradient-text">with God-Tier Design.</span>
                    </h1>
                    <p className="text-lg text-[var(--foreground)]/80 font-bold max-w-2xl mx-auto mb-12 uppercase tracking-widest leading-relaxed">
                        The ultimate AI Studio for precision marketing. <br />Initialize your protocol today.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-6 mb-20 p-2 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl w-fit mx-auto">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-[var(--foreground)] text-[var(--background)] shadow-lg' : 'text-[var(--foreground)]/80 hover:text-[var(--foreground)]/80'}`}
                        >
                            Monthly Sync
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-[var(--accent-secondary)] text-white shadow-lg' : 'text-[var(--foreground)]/80 hover:text-[var(--foreground)]/80'}`}
                        >
                            Annual Sync <span className="ml-2 opacity-60">(-20%)</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-32">
                    {[
                        {
                            name: 'Starter',
                            price: prices.starter,
                            features: [
                                '15 Neural Syncs',
                                'Leads Vault Basic',
                                'Neural SEO Meta',
                                'Modern Themes',
                                'Standard Export'
                            ],
                            color: 'cyan',
                            border: 'border-white/10'
                        },
                        {
                            name: 'Professional',
                            price: prices.professional,
                            features: [
                                '60 Neural Syncs',
                                'Studio Insights (Analytics)',
                                'A/B Testing Protocol',
                                'Live Collaboration (2 Nodes)',
                                'Precision Refiner'
                            ],
                            color: 'fuchsia',
                            border: 'border-fuchsia-500/50',
                            popular: true
                        },
                        {
                            name: 'Enterprise',
                            price: prices.enterprise,
                            features: [
                                '250 Neural Syncs',
                                'Autonomous Retargeting',
                                'Live Collaboration (Unlimited)',
                                'Neural Follow-up Sync',
                                'Brand Vault Synchronization'
                            ],
                            color: 'amber',
                            border: 'border-white/10'
                        },
                        {
                            name: 'Ultimate',
                            price: prices.ultimate,
                            features: [
                                'Unlimited Neural Syncs',
                                'White-Label Protocol',
                                'SSO / Enterprise Sync',
                                'Custom Model Tuning',
                                'Executive Concierge'
                            ],
                            color: 'white',
                            border: 'border-white/20'
                        }
                    ].map((plan, i) => (
                        <div key={i} className={`premium-card p-10 flex flex-col relative group overflow-hidden ${plan.border} ${plan.popular ? 'scale-105 shadow-[0_0_50px_rgba(255,0,255,0.1)]' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-fuchsia-500 text-white text-[8px] font-black px-4 py-1.5 uppercase tracking-widest">
                                    Status: Optimal
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${plan.color === 'cyan' ? 'text-[var(--accent-primary)]' : plan.color === 'fuchsia' ? 'text-[var(--accent-secondary)]' : plan.color === 'amber' ? 'text-[var(--accent-tertiary)]' : 'text-[var(--foreground)]'}`}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-2 text-[var(--foreground)]">
                                    <span className="text-5xl font-black italic tracking-tighter">${plan.price}</span>
                                    {typeof plan.price === 'number' && <span className="text-[var(--foreground)]/80 text-[10px] font-black uppercase tracking-widest">/sync cycle</span>}
                                </div>
                            </div>

                            <ul className="flex-1 space-y-5 mb-10">
                                {plan.features.map((feat, fi) => (
                                    <li key={fi} className="flex items-center gap-3 text-[var(--foreground)]/80 text-xs font-bold uppercase tracking-wide">
                                        <div className={`w-1.5 h-1.5 rounded-full ${plan.color === 'cyan' ? 'bg-[var(--accent-primary)]' : plan.color === 'fuchsia' ? 'bg-[var(--accent-secondary)]' : plan.color === 'amber' ? 'bg-[var(--accent-tertiary)]' : 'bg-[var(--foreground)]'}`} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            {plan.name === 'Ultimate' ? (
                                <Link href="/enterprise" className="w-full py-4 text-center bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all">
                                    Contact Intake
                                </Link>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(plan.name.toLowerCase())}
                                    className={`w-full py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all hover:scale-105 active:scale-95 ${plan.popular ? 'bg-[var(--accent-secondary)] text-white shadow-lg' : 'bg-[var(--foreground)] text-[var(--background)] shadow-lg'}`}
                                >
                                    Initialize Protocol
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* System FAQ */}
                <div className="max-w-4xl mx-auto mb-32 premium-card p-16 border-[var(--glass-border)] glass relative overflow-hidden transition-colors duration-500">
                    <div className="absolute inset-0 scanline opacity-5 pointer-events-none"></div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] mb-16 text-center italic tracking-tighter uppercase">Protocol Diagnostics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[
                            { q: "What are Neural Syncs?", a: "Each sync facilitates one full-spectrum AI brochure generation, including SEO metadata, OpenGraph tags, and persistent storage in your Enterprise Suite." },
                            { q: "What is the Leads Vault?", a: "A centralized node for capturing and managing prospects directly from your brochure assets. Professional and Enterprise tiers include advanced CSV exports and AI-generated follow-up sequences." },
                            { q: "Is Studio Insights included?", a: "Affirmative. Real-time engagement analytics and Protocol A/B variant testing are active on all Professional and Enterprise operational nodes." },
                            { q: "Does it support team collaboration?", a: "The Enterprise Matrix allows for shared organization-level ownership of brochures, brand assets, and leads, powered by the Clerk Enterprise infrastructure." }
                        ].map((faq, i) => (
                            <div key={i}>
                                <h3 className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.2em] mb-4">{faq.q}</h3>
                                <p className="text-[var(--foreground)]/80 text-xs font-bold leading-relaxed uppercase tracking-widest">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Protocol CTA */}
                <div className="max-w-5xl mx-auto p-20 premium-card bg-gradient-to-br from-[var(--background)] via-[var(--accent-secondary)]/5 to-[var(--background)] border-[var(--accent-secondary)]/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-secondary)]/10 rounded-full blur-[150px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-[150px] -ml-32 -mb-32"></div>

                    <h2 className="text-4xl md:text-7xl font-black text-[var(--foreground)] mb-12 relative z-10 italic tracking-tighter uppercase">
                        Master the matrix. <br /> Initialize BrochureGen.
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
                        <Link href="/signup" className="px-16 py-6 bg-[var(--foreground)] text-[var(--background)] font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                            SYNC NOW
                        </Link>
                        <Link href="/enterprise" className="px-16 py-6 bg-transparent border border-[var(--foreground)] text-[var(--foreground)] font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-[var(--foreground)]/5 transition-all">
                            ENTERPRISE INTAKE
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
