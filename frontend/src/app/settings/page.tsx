"use client";
import React from 'react';
import SuiteLayout from '@/components/SuiteLayout';
import { Settings, Shield, Zap, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
    return (
        <SuiteLayout>
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
                <div>
                    <h1 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Command Settings</h1>
                    <p className="text-[var(--foreground)]/80 font-bold tracking-[0.3em] uppercase mt-2 text-xs italic">
                        Configure Protocol Parameters & Security Clearances
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {[
                        { title: "General Parameters", icon: Settings, desc: "Global system defaults and interface preferences." },
                        { title: "Security & Access", icon: Shield, desc: "Encryption standards and institutional clearance levels." },
                        { title: "Neural Sync", icon: Zap, desc: "API key management and third-party node integrations." },
                        { title: "Alert Protocols", icon: Bell, desc: "Notification matrix and real-time status updates." },
                        { title: "Data Governance", icon: Database, desc: "Retention policies and institutional export controls." }
                    ].map((item, i) => (
                        <div key={i} className="premium-card p-8 border border-white/5 bg-white/5 active:scale-[0.98] transition-all cursor-pointer group">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-[var(--foreground)]/5 border border-white/10 rounded-2xl text-[var(--foreground)] group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                                    <item.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black uppercase italic tracking-tight text-[var(--foreground)]">{item.title}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SuiteLayout>
    );
}
