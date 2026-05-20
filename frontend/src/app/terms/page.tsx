import React from 'react';
import Navbar from '@/components/Navbar';
import { User, CreditCard, Lock, Power, Scale, Globe, RefreshCcw, ChevronRight, Gavel } from 'lucide-react';

export default function TermsOfService() {
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold mb-6 border border-indigo-500/20 tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Usage Protocol Entity
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 italic uppercase">
                        Terms of <span className="gradient-text">Service</span>
                    </h1>
                    <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto text-lg leading-relaxed">
                        Establishing the technical and legal framework for our partnership. Please review these operational parameters carefully.
                    </p>
                    <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-[0.3em] mt-8">
                        Last Sync: February 6, 2026
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* 1. Accounts */}
                    <div className="premium-card p-10 bg-[var(--card-bg)] border-[var(--glass-border)] group hover:border-indigo-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <User size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Account Integrity</h2>
                        <div className="space-y-4 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <p>
                                When you create an account, you must provide accurate, complete, and current information at all times.
                            </p>
                            <p>
                                Failure to do so constitutes a breach of terms, which may result in immediate termination of your service node.
                            </p>
                        </div>
                    </div>

                    {/* 2. Subscriptions */}
                    <div className="premium-card p-10 bg-[var(--foreground)]/[0.02] border-[var(--glass-border)] group hover:border-blue-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <CreditCard size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Billing Matrix</h2>
                        <div className="space-y-4 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <p>
                                Service parts are billed on a recurring and periodic basis (monthly or annually).
                            </p>
                            <p>
                                You will be billed in advance. You may cancel your subscription at any time to prevent further automatic renewals.
                            </p>
                        </div>
                    </div>

                    {/* 3. Intellectual Property */}
                    <div className="premium-card p-10 bg-[var(--foreground)]/[0.02] border-[var(--glass-border)] group hover:border-cyan-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-8 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                            <Lock size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Asset Ownership</h2>
                        <div className="space-y-4 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <p>
                                The Service and its original content remain the exclusive property of BrochureGen.
                            </p>
                            <p className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 italic text-xs">
                                Note: Brochures generated using your own content remain your exclusive property.
                            </p>
                        </div>
                    </div>

                    {/* 4. Termination */}
                    <div className="premium-card p-10 bg-[var(--card-bg)] border-[var(--glass-border)] group hover:border-rose-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 group-hover:scale-110 transition-transform">
                            <Power size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Node Termination</h2>
                        <div className="space-y-4 text-[var(--foreground)]/70 text-sm leading-relaxed">
                            <p>
                                We may terminate or suspend access immediately, without prior notice or liability, for any reason whatsoever.
                            </p>
                            <p>
                                This includes, without limitation, a breach of the operational protocols defined in these Terms.
                            </p>
                        </div>
                    </div>

                    {/* 5. Limitation of Liability */}
                    <div className="premium-card p-10 bg-[var(--card-bg)] border-[var(--glass-border)] group hover:border-amber-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 border border-amber-500/20 group-hover:scale-110 transition-transform">
                            <Scale size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Liability Limits</h2>
                        <p className="text-[var(--foreground)]/70 text-sm leading-relaxed">
                            In no event shall BrochureGen or its affiliates be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
                        </p>
                    </div>

                    {/* 6. Governing Law */}
                    <div className="premium-card p-10 bg-[var(--foreground)]/[0.02] border-[var(--glass-border)] group hover:border-teal-500/30 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-8 border border-teal-500/20 group-hover:scale-110 transition-transform">
                            <Globe size={28} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 italic uppercase tracking-tighter">Governing Law</h2>
                        <p className="text-[var(--foreground)]/70 text-sm leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                        </p>
                    </div>

                    {/* 7. Changes */}
                    <div className="premium-card p-10 bg-[var(--foreground)]/[0.02] border-[var(--glass-border)] group hover:border-fuchsia-500/30 transition-all duration-500 md:col-span-2">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 border border-fuchsia-500/20 shrink-0">
                                <RefreshCcw size={28} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black mb-2 italic uppercase tracking-tighter">Protocol Revisions</h2>
                                <p className="text-[var(--foreground)]/70 text-sm leading-relaxed">
                                    We reserve the right to modify or replace these Terms at any time. For material revisions, we will attempt to provide 30 days notice prior to any new terms taking effect.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Disclaimer */}
                <div className="mt-20 text-center space-y-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--glass-border)]" />
                        <Gavel className="text-[var(--foreground)]/20" size={20} />
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--glass-border)]" />
                    </div>
                    <p className="text-[10px] font-bold text-[var(--foreground)]/30 uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed">
                        If you have any questions about these Terms, contact us at <strong className="text-[var(--foreground)]/50">support@brochuregen.com</strong>
                    </p>
                </div>
            </main>
        </div>
    );
}
