"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
                    plan: plan
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
        starter: billingCycle === 'monthly' ? 79 : 63,
        professional: billingCycle === 'monthly' ? 199 : 159,
        agency: billingCycle === 'monthly' ? 499 : 399,
    };

    return (
        <div className="min-h-screen transition-colors duration-300 ease-in-out font-sans bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900 dark:bg-slate-950 dark:text-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-in slide-in-from-bottom-5 fade-in duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 mb-6 mx-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Powerful AI Studio
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
                        Power your growth <br />
                        <span className="gradient-text bg-gradient-to-r from-blue-600 to-indigo-600">with professional design.</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
                        The professional way to generate AI brochures. Build your marketing collateral instantly.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-16">
                        <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly Billing</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <span
                                className={`absolute top-1 left-1 bg-white dark:bg-slate-900 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}
                            ></span>
                        </button>
                        <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            Yearly <span className="text-green-500 font-bold ml-1">(-20% OFF)</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-24">

                    {/* Starter Plan */}
                    <div className="premium-card p-8 flex flex-col relative group">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Starter</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">${prices.starter}</span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm">/mo</span>
                            </div>
                            <p className="mt-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                                Essential AI tools for solo creators and niche websites.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm"><b>10 Credits</b> / mo</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm">Modern & Classic Themes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm">Standard PDF Export</span>
                                </li>
                            </ul>
                        </div>

                        <button onClick={() => handleUpgrade('starter')} className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm">
                            Get Started
                        </button>
                    </div>

                    {/* Professional Plan */}
                    <div className="premium-card p-8 border-2 border-blue-500 scale-105 shadow-2xl z-10 flex flex-col relative bg-white dark:bg-slate-900">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                            Value King
                        </div>
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Professional</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">${prices.professional}</span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm">/mo</span>
                            </div>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                                Growth tracking & advanced themes for serious marketers.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200 text-sm font-bold">25 Credits / mo</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200 text-sm"><b>Advanced Analytics</b> Hub</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200 text-sm">All Dynamic Layout Themes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200 text-sm">AI Refine Engine</span>
                                </li>
                            </ul>
                        </div>

                        <button onClick={() => handleUpgrade('professional')} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 text-sm uppercase tracking-wider">
                            Upgrade Now
                        </button>
                    </div>

                    {/* Agency Plan */}
                    <div className="premium-card p-8 flex flex-col relative group">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Agency</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">${prices.agency}</span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm">/mo</span>
                            </div>
                            <p className="mt-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                                White-labeling & multisite management for agencies.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm"><b>100 Credits</b> / mo</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm">Team Workspaces (Clerk Org)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm">Full API Hub Access</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 text-sm font-bold text-blue-500">White-label Branding</span>
                                </li>
                            </ul>
                        </div>

                        <button onClick={() => handleUpgrade('agency')} className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all text-sm">
                            Become Agency
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="premium-card p-8 flex flex-col relative group bg-slate-950 border-slate-800">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Enterprise</h3>
                            <div className="flex items-baseline gap-1 text-white">
                                <span className="text-4xl font-black">Custom</span>
                            </div>
                            <p className="mt-4 text-slate-400 text-xs leading-relaxed">
                                Bespoke AI compliance & unlimited scaling for global teams.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-300 text-sm">Unlimited API Throttling</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-300 text-sm">SSO / SAML Support</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-300 text-sm">Dedicated AI Tuning</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-300 text-sm">24/7 Priority Concierge</span>
                                </li>
                            </ul>
                        </div>

                        <Link href="/enterprise" className="w-full py-3 rounded-xl bg-white text-slate-900 font-black hover:bg-blue-50 transition-all text-sm text-center">
                            Contact Sales
                        </Link>
                    </div>

                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mb-20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/20 dark:border-slate-800">
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-12 text-center tracking-tight">Got Questions?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">What are credits used for?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Each credit allows you to generate one full-sized, print-ready tri-fold brochure with original AI copywriting and imagery.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Can I change my plan?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Yes! You can upgrade or downgrade at any time. Your billing will be pro-rated automatically by Stripe.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">What is "Campaign Mode"?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Professional and Agency users get automatic social media assets and email drip text generated for every brochure they create.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Is there a free tier?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Yes, we offer free credits to every new user so you can test our AI Studio before committing.</p>
                        </div>
                    </div>
                </div>

                {/* Final CTA Banner */}
                <div className="max-w-5xl mx-auto mb-20 p-16 rounded-[4rem] bg-slate-900 dark:bg-blue-600 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] -ml-32 -mb-32"></div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 tracking-tight">
                        Scale your marketing <br /> with BrochureGen.
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
                        <Link href="/signup" className="px-12 py-5 bg-white text-slate-900 font-black text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all">
                            Get Started
                        </Link>
                        <Link href="/enterprise" className="px-12 py-5 bg-transparent border-2 border-white/30 text-white font-black text-xl rounded-2xl hover:bg-white/10 transition-all">
                            Enterprise Sales
                        </Link>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
