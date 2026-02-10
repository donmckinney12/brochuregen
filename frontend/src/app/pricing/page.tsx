"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BrochureCarousel from '@/components/BrochureCarousel';
import { useAuth } from '@/context/AuthContext';

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const { isAuthenticated, user } = useAuth();

    const handleUpgrade = async (plan: string) => {
        if (!user) {
            window.location.href = '/signup';
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';
            const res = await fetch(`${apiUrl}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    email: user.email,
                    plan: plan // We can pass this for future use
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
        starter: billingCycle === 'monthly' ? 25 : 20,
        professional: billingCycle === 'monthly' ? 49 : 39,
        agency: billingCycle === 'monthly' ? 199 : 159,
    };

    return (
        <div className="min-h-screen transition-colors duration-300 ease-in-out font-sans bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900 dark:bg-slate-950 dark:text-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-in slide-in-from-bottom-5 fade-in duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 mb-6 mx-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Powered by <span className="font-bold text-slate-900 dark:text-white">GPT-4</span> & <span className="font-bold text-slate-900 dark:text-white">DALL·E 3</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
                        Choose the plan that fits your business needs. Upgrade or cancel anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none"
                        >
                            <span
                                className={`absolute top-1 left-1 bg-white dark:bg-slate-900 w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}
                            ></span>
                        </button>
                        <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            Yearly <span className="text-green-500 font-bold">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">

                    {/* Starter Plan */}
                    <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative group">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Starter</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${prices.starter}</span>
                                <span className="text-slate-500 dark:text-slate-400">/mo</span>
                            </div>
                            {billingCycle === 'yearly' && <p className="text-xs text-green-500 font-semibold mt-1">Billed ${prices.starter * 12} yearly</p>}
                            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm h-10">
                                Perfect for solo entrepreneurs or local shops just starting out.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300"><span className="font-bold">5 Credits</span> / month</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300">Standard Templates</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300">Basic AI Copywriting</span>
                                </li>
                                <li className="flex items-start gap-3 group/tooltip relative">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 border-b border-dotted border-slate-400 cursor-help">Rollover Credits</span>
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-20">
                                        Unused credits roll over to the next month (up to 15).
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {isAuthenticated ? (
                            <button onClick={() => handleUpgrade('starter')} className="w-full py-3 rounded-xl border border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors block text-center">
                                Subscribe
                            </button>
                        ) : (
                            <Link href="/signup" className="w-full py-3 rounded-xl border border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors block text-center">
                                Start Free Trial
                            </Link>
                        )}
                    </div>

                    {/* Professional Plan - Highlighted */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-blue-500 shadow-2xl scale-105 z-10 flex flex-col relative">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                            MOST POPULAR
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Professional</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">${prices.professional}</span>
                                <span className="text-slate-500 dark:text-slate-400">/mo</span>
                            </div>
                            {billingCycle === 'yearly' && <p className="text-xs text-blue-500 font-semibold mt-1">Billed ${prices.professional * 12} yearly</p>}
                            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm h-10">
                                For real estate agents and growing businesses who need more volume.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200 font-medium"><span className="font-bold">25 Credits</span> / month</span>
                                </li>
                                <li className="flex items-start gap-3 group/tooltip relative">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200 font-medium border-b border-dotted border-slate-400 cursor-help">10 "Refine" AI Credits</span>
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-56 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-20">
                                        Perfectionist? Use Refine credits to tweak specific sections without spending a full generation credit.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200">Brand Vault (Save Logos/Colors)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200">High-Res CMYK Export</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-700 dark:text-slate-200">QR Code Tracking</span>
                                </li>
                            </ul>
                        </div>

                        {isAuthenticated ? (
                            <button onClick={() => handleUpgrade('professional')} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 block text-center">
                                Upgrade to Pro
                            </button>
                        ) : (
                            <Link href="/signup" className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 block text-center">
                                Start Free Trial
                            </Link>
                        )}
                    </div>

                    {/* Agency Plan */}
                    <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/50 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative group">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Agency</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-500 dark:text-slate-400 mr-1">Starting at</span>
                                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${prices.agency}</span>
                                <span className="text-slate-500 dark:text-slate-400">/mo</span>
                            </div>
                            {billingCycle === 'yearly' && <p className="text-xs text-green-500 font-semibold mt-1">Billed ${prices.agency * 12} yearly</p>}
                            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm h-10">
                                Built for agencies producing brochures for clients at scale.
                            </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300"><span className="font-bold">Unlimited</span> Generation Credits</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300"><span className="font-bold">Unlimited</span> Refine Credits</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300">Team Collaboration</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300 font-semibold text-blue-600 dark:text-blue-400">White-labeling</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-slate-600 dark:text-slate-300">Priority Support</span>
                                </li>
                            </ul>
                        </div>

                        {isAuthenticated ? (
                            <button onClick={() => handleUpgrade('agency')} className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors block text-center">
                                Contact Sales
                            </button>
                        ) : (
                            <Link href="/signup" className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors block text-center">
                                Start Free Trial
                            </Link>
                        )}
                    </div>

                </div>

                {/* Product Previews */}
                <div className="bg-slate-50 dark:bg-slate-900/50 -mx-6 px-6 py-20 mt-20 mb-20 border-y border-slate-200 dark:border-slate-800">
                    <BrochureCarousel />
                </div>

                {/* Testimonials Section */}
                <div className="mt-24 mb-24 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Trusted by Professionals</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Join thousands of businesses creating stunning brochures in seconds.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                ))}
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                                "BrochureGen saved me hours of work. I just paste the Zillow link and boom—open house ready PDF. My clients love the speed."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">SJ</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah Jenkins</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Real Estate Agent</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                ))}
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                                "The design quality is surprisingly good. It looks like I hired a professional designer, but it only cost me a few clicks."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">MT</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mike Thompson</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Coffee Shop Owner</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-1 mb-4 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                ))}
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                                "We use the Agency plan to churn out client assets effectively. It's paid for itself 10x over in the first month alone."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">ER</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Elena Rodriguez</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Marketing Director</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-white/60 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Can I cancel anytime?</h3>
                            <p className="text-slate-600 dark:text-slate-400">Yes, absolutely. There are no long-term contracts for the monthly plan. You can cancel your subscription at any time from your dashboard.</p>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What happens if I run out of credits?</h3>
                            <p className="text-slate-600 dark:text-slate-400">If you reach your limit, you can easily upgrade to the next tier or purchase a one-time credit pack. Unused credits on the Professional plan roll over (up to 30).</p>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Do I own the copyrights to the designs?</h3>
                            <p className="text-slate-600 dark:text-slate-400">Yes! Once you export a brochure, you own 100% of the rights to the design and can use it for any commercial purpose.</p>
                        </div>
                    </div>
                </div>

                {/* Final CTA Banner */}
                <div className="max-w-5xl mx-auto mb-20 p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
                        Ready to create your first brochure?
                    </h2>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 relative z-10">
                        Join thousands of real estate agents and marketers saving hours every week. No credit card required to start.
                    </p>
                    <Link href="/signup" className="inline-block px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all transform hover:-translate-y-1 relative z-10">
                        Get Started for Free
                    </Link>
                </div>

            </main>
        </div>
    );
}
