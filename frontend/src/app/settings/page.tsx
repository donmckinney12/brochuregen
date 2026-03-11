"use client";
import React, { useState } from 'react';
import SuiteLayout from '@/components/SuiteLayout';
import {
    Settings,
    Shield,
    Zap,
    Bell,
    Database,
    ChevronRight,
    Cpu,
    Key,
    Globe,
    Eye,
    Lock,
    ToggleLeft,
    ToggleRight,
    Save,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const settingCategories = [
    { id: 'general', title: "General Parameters", icon: Settings, desc: "Global system defaults and interface preferences." },
    { id: 'security', title: "Security & Access", icon: Shield, desc: "Encryption standards and institutional clearance levels." },
    { id: 'api', title: "Neural Sync (API)", icon: Zap, desc: "API key management and third-party node integrations." },
    { id: 'alerts', title: "Alert Protocols", icon: Bell, desc: "Notification matrix and real-time status updates." },
    { id: 'data', title: "Data Governance", icon: Database, desc: "Retention policies and institutional export controls." }
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    // Toggle States [v29.6]
    const [interfaceSettings, setInterfaceSettings] = useState({
        nightMode: true,
        glassmorphism: true,
        hapticFeedback: false,
        microAnimations: true
    });

    const toggleSetting = (key: keyof typeof interfaceSettings) => {
        setInterfaceSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <SuiteLayout>
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                    <div>
                        <h1 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Command Settings</h1>
                        <p className="text-[var(--foreground)]/80 font-bold tracking-[0.3em] uppercase mt-2 text-xs italic">
                            Configure Protocol Parameters • [v29.6] Operational
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl transition-all hover:opacity-90 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{isSaving ? "Syncing..." : "Sync Matrix"}</span>
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-1 space-y-2">
                        {settingCategories.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${activeTab === item.id
                                    ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--foreground)]'
                                    : 'bg-white/5 border-white/5 text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-white/10'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-white/5 group-hover:bg-white/20'}`}>
                                    <item.icon size={18} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-black uppercase tracking-tight truncate">{item.title}</div>
                                </div>
                                <ChevronRight size={14} className={`ml-auto transition-transform ${activeTab === item.id ? 'rotate-90 text-[var(--accent-primary)]' : 'opacity-20'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="premium-card p-10 border-white/5 bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] min-h-[500px]"
                            >
                                {activeTab === 'general' && (
                                    <div className="space-y-10">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Interface Core</h3>
                                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Configure primary operational display parameters.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[
                                                { id: 'nightMode' as const, label: "Neural Night Mode", desc: "Optimal contrast during high-frequency synthesis." },
                                                { id: 'glassmorphism' as const, label: "Glassmorphic Focus", desc: "Enable blur protocols for depth perception." },
                                                { id: 'hapticFeedback' as const, label: "Haptic Feedback", desc: "Initialize mechanical resonance on interaction." },
                                                { id: 'microAnimations' as const, label: "Micro-Animations", desc: "Smooth state transitions for better awareness." }
                                            ].map((pref) => (
                                                <div
                                                    key={pref.id}
                                                    onClick={() => toggleSetting(pref.id)}
                                                    className={`flex items-center justify-between p-6 bg-white/5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] ${interfaceSettings[pref.id] ? 'border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/[0.02]' : 'border-white/5'
                                                        }`}
                                                >
                                                    <div className="space-y-1">
                                                        <div className={`text-xs font-black uppercase tracking-tight transition-colors ${interfaceSettings[pref.id] ? 'text-[var(--accent-primary)]' : 'text-[var(--foreground)]'}`}>
                                                            {pref.label}
                                                        </div>
                                                        <div className="text-[9px] font-bold uppercase text-[var(--foreground)]/30 tracking-widest leading-none">
                                                            {pref.desc}
                                                        </div>
                                                    </div>
                                                    <div className={`transition-all duration-300 ${interfaceSettings[pref.id] ? 'text-[var(--accent-primary)]' : 'text-white/20 group-hover:text-white/40'}`}>
                                                        {interfaceSettings[pref.id] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-10">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Security Clearance</h3>
                                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Manage institutional encryption and access protocols.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                                        <Shield size={32} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black uppercase text-emerald-400 italic leading-none mb-2">SOC2 Type II Standard</h4>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/40">Encryption Protocol: AES-256 Enabled</p>
                                                    </div>
                                                </div>
                                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest animate-pulse">Station Secure</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <button className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-white/20 transition-all group">
                                                    <Lock className="mb-4 text-white/20 group-hover:text-[var(--accent-primary)] transition-colors" size={20} />
                                                    <div className="text-xs font-black uppercase text-white tracking-widest mb-1">Rotate Master Salt</div>
                                                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Update institutional hash seed.</div>
                                                </button>
                                                <button className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-white/20 transition-all group">
                                                    <Eye className="mb-4 text-white/20 group-hover:text-[var(--accent-primary)] transition-colors" size={20} />
                                                    <div className="text-xs font-black uppercase text-white tracking-widest mb-1">Access Audit Log</div>
                                                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Review node entry timestamps.</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'api' && (
                                    <div className="space-y-10">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Neural Sync Matrix</h3>
                                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Integrate protocol nodes with external developer clusters.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40 px-2">Production Protocol Key</label>
                                                <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-6 group focus-within:border-[var(--accent-primary)]/50 transition-all">
                                                    <Key size={18} className="text-white/20 group-focus-within:text-[var(--accent-primary)]" />
                                                    <code className="flex-1 font-mono text-xs text-[var(--foreground)]/80 tracking-widest truncate">brgen_live_7x923nf9230m942f...</code>
                                                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Copy Key</button>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Globe size={16} className="text-blue-400" />
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Webhook Endpoint</h4>
                                                    </div>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Node Active</span>
                                                </div>
                                                <p className="text-[10px] text-white/40 leading-relaxed font-medium">Receive real-time brochure generation events at institutional speed via the secure Protocol stream.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'alerts' && (
                                    <div className="h-full flex items-center justify-center opacity-40 italic font-medium uppercase tracking-[0.4em] text-xs">
                                        [Alert Matrix Initializing...]
                                    </div>
                                )}

                                {activeTab === 'data' && (
                                    <div className="h-full flex items-center justify-center opacity-40 italic font-medium uppercase tracking-[0.4em] text-xs">
                                        [Governance Vault Encrypted...]
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </SuiteLayout>
    );
}
