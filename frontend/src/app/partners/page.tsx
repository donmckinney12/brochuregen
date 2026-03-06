"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
                {/* Hero Section */}
                <div className="text-center mb-20 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 border border-blue-100 dark:border-blue-800 backdrop-blur-md"
                    >
                        PARTNER PROGRAM
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]"
                    >
                        Grow With Us. <br />
                        <span className="gradient-text">Future-Proof Your Earnings.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        Join the BrochureGen partner network and help businesses transform their websites into premium collateral. Earn lifetime recurring commissions for every referral.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/25 hover:scale-105 inline-block">
                            Become a Partner
                        </Link>
                    </motion.div>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        {
                            title: "30% Lifetime Commission",
                            desc: "Not just a one-time bonus. Earn 30% of every payment your referrals make, forever.",
                            icon: "💰"
                        },
                        {
                            title: "60-Day Cookie Window",
                            desc: "Our long attribution window ensures you get credit for the traffic you drive.",
                            icon: "🍪"
                        },
                        {
                            title: "Agency Ready",
                            desc: "Perfect for marketing agencies who want to provide value-add services to their clients.",
                            icon: "🏢"
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-8 group hover:border-blue-500/50 transition-colors"
                        >
                            <div className="text-4xl mb-6">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Payout Calculator */}
                <div className="premium-card p-12 bg-slate-50 dark:bg-slate-900/50 mb-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Commission Calculator</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                See how much you can earn by referring customers to BrochureGen. Our Pro and Agency plans are high-converting!
                            </p>
                            <div className="space-y-6">
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Referrals Per Month</span>
                                        <span className="text-blue-600 font-bold">10 Customers</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 w-1/4"></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Average Plan Value</span>
                                        <span className="text-blue-600 font-bold">$199 / mo</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-2">Estimated Monthly Revenue</span>
                            <div className="text-6xl font-extrabold gradient-text mb-4">$597.00</div>
                            <p className="text-sm text-slate-500 mb-8">Recurring every single month as long as they stay subscribed.</p>
                            <Link href="/signup" className="block w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl transition-all hover:scale-105">
                                Start Earning Today
                            </Link>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "How are referrals tracked?",
                                a: "We use professional-grade cookie tracking. When a user clicks your link, a 60-day cookie is placed on their browser. If they sign up within that window, they are permanently linked to your account."
                            },
                            {
                                q: "When do I get paid?",
                                a: "Payouts are made on the 1st of every month via PayPal or Stripe Connect once your balance reaches the $50 minimum threshold."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
                                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
