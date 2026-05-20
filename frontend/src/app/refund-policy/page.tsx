import React from 'react';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Clock, AlertTriangle, LifeBuoy, CreditCard, ChevronRight } from 'lucide-react';

export const metadata = {
    title: 'Refund Policy - BrochureGen AI',
    description: 'Our refund policy and satisfaction guarantee.',
};

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden transition-colors duration-500">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[var(--background)]" />
                <div className="absolute inset-0 mesh-gradient opacity-20" />
                <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-[var(--accent-primary)]/10 via-[var(--accent-secondary)]/5 to-transparent blur-[120px] opacity-40"></div>
                <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
            </div>

            <Navbar />

            <main className="pt-32 pb-32 px-6 max-w-5xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold mb-6 border border-blue-500/20 tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Customer Protection Protocol
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 italic uppercase">
                        Refund <span className="gradient-text">Policy</span>
                    </h1>
                    <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto text-lg leading-relaxed">
                        Transparent, fair, and focused on your success. Our commitment to quality means we stand behind every generation.
                    </p>
                    <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-[0.3em] mt-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* 1. Satisfaction Guarantee */}
                    <div className="premium-card p-10 bg-[var(--card-bg)] border-[var(--glass-border)] group hover:border-blue-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Satisfaction Guarantee</h2>
                        <div className="space-y-4 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <p>
                                We offer a <strong className="text-blue-500">7-day money-back guarantee</strong> on all first-time subscriptions.
                            </p>
                            <p>
                                If you are not satisfied with our service within the first 7 days of your initial purchase, you may request a full refund, no questions asked.
                            </p>
                            <p className="text-xs italic bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                                Free trials: You will not be charged until the trial ends. Cancel anytime to avoid charges.
                            </p>
                        </div>
                    </div>

                    {/* 2. Eligibility */}
                    <div className="premium-card p-10 bg-[var(--foreground)]/[0.02] border-[var(--glass-border)] group hover:border-cyan-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-8 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                            <Clock size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Eligibility</h2>
                        <ul className="space-y-4 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <li className="flex gap-3">
                                <ChevronRight size={16} className="text-cyan-500 shrink-0 mt-1" />
                                <span><strong>First-Time Subscribers:</strong> Full refund within 7 days.</span>
                            </li>
                            <li className="flex gap-3">
                                <ChevronRight size={16} className="text-cyan-500 shrink-0 mt-1" />
                                <span><strong>Technical Issues:</strong> Persistent errors our team can't resolve in reasonable time.</span>
                            </li>
                            <li className="flex gap-3">
                                <ChevronRight size={16} className="text-cyan-500 shrink-0 mt-1" />
                                <span><strong>Duplicate Charges:</strong> Immediate refund for accidental double billing.</span>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Non-Refundable */}
                    <div className="premium-card p-10 bg-[var(--foreground)]/[0.02] border-[var(--glass-border)] group hover:border-rose-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 group-hover:scale-110 transition-transform">
                            <AlertTriangle size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Non-Refundable</h2>
                        <ul className="space-y-4 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <li className="flex gap-3">
                                <ChevronRight size={16} className="text-rose-500 shrink-0 mt-1" />
                                <span>Requests made after the 7-day initial purchase window.</span>
                            </li>
                            <li className="flex gap-3">
                                <ChevronRight size={16} className="text-rose-500 shrink-0 mt-1" />
                                <span>Renewal charges where cancellation happened after the billing date.</span>
                            </li>
                            <li className="flex gap-3">
                                <ChevronRight size={16} className="text-rose-500 shrink-0 mt-1" />
                                <span>Accounts in violation of our Terms of Service.</span>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Support & Processing */}
                    <div className="premium-card p-10 bg-[var(--card-bg)] border-[var(--glass-border)] group hover:border-emerald-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <LifeBuoy size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Support & Process</h2>
                        <div className="space-y-6 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <p>
                                Contact <strong>support@brochuregen.ai</strong> with your account details to initiate a refund request.
                            </p>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <CreditCard size={20} className="text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Processing Time: 5-10 Business Days</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Disclaimer */}
                <div className="mt-20 text-center">
                    <p className="text-[10px] font-bold text-[var(--foreground)]/30 uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed">
                        BrochureGen AI reserves the right to update this protocol. Changes are active immediately upon deployment.
                    </p>
                </div>
            </main>
        </div>
    );
}
