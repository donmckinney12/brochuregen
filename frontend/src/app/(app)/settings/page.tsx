"use client";
import React, { useState } from 'react';
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
    { id: 'general', title: "General", icon: Settings, desc: "Global system defaults and interface preferences." },
    { id: 'security', title: "Security & Access", icon: Shield, desc: "Manage your security settings and access permissions." },
    { id: 'api', title: "API & Integrations", icon: Zap, desc: "API key management and external service integrations." },
    { id: 'alerts', title: "Notifications", icon: Bell, desc: "Configure how you receive updates and status alerts." },
    { id: 'data', title: "Data & Privacy", icon: Database, desc: "Manage data usage and privacy preferences." }
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

    const [notificationSettings, setNotificationSettings] = useState({
        brochureStatus: true,
        marketingTips: false,
        securityAlerts: true,
        systemUpdates: true
    });

    const [privacySettings, setPrivacySettings] = useState({
        anonymizedAnalytics: true
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
        <>
            <div className="max-w-[1600px] space-y-16 pb-24 relative px-6 md:px-16">
                {/* Atmospheric Background Layers [v30.2] */}
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 px-4">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-[2px] bg-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500">Account Configuration</span>
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-[0.75]">
                            Platform <br />
                            <span className="gradient-text">Settings</span>
                        </h1>
                        <p className="text-[var(--foreground)]/40 font-bold tracking-[0.4em] uppercase text-xs italic max-w-xl">
                            Manage your account preferences and security standards.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="relative group overflow-hidden flex items-center gap-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={18} className="group-hover:scale-125 transition-transform" />
                        )}
                        <span className="relative z-10">{isSaving ? "SAVING..." : "Save Settings"}</span>
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-1 space-y-3">
                        {settingCategories.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-5 p-5 rounded-2xl border transition-all text-left group relative overflow-hidden ${activeTab === item.id
                                    ? 'bg-indigo-500/10 border-indigo-500/30 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                    : 'bg-white/[0.02] border-white/5 text-[var(--foreground)]/40 hover:text-[var(--foreground)] hover:bg-white/5'
                                    }`}
                            >
                                {activeTab === item.id && (
                                    <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                                )}
                                <div className={`p-2.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                    <item.icon size={20} />
                                </div>
                                <div className="min-w-0">
                                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === item.id ? 'text-indigo-400' : 'text-inherit'}`}>
                                        {item.title}
                                    </div>
                                </div>
                                <ChevronRight size={14} className={`ml-auto transition-transform ${activeTab === item.id ? 'rotate-90 text-indigo-400' : 'opacity-20'}`} />
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
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Display Preferences</h3>
                                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Customize your interface and visual experience.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[
                                                { id: 'glassmorphism' as const, label: "Glassmorphism", desc: "Enable translucent glass-like effects." },
                                                { id: 'hapticFeedback' as const, label: "Haptic Feedback", desc: "Tactile feedback on touch-enabled devices." },
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
                                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Security Settings</h3>
                                                <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Secure your account and manage access logs.</p>
                                            </div>

                                        <div className="space-y-6">
                                            <div className="p-10 bg-indigo-500/[0.02] border border-indigo-500/20 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                                <div className="flex items-center gap-8 relative z-10">
                                                    <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                                        <Shield size={40} className="group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black uppercase text-white italic leading-none mb-3">Enterprise Security <span className="text-indigo-400">Standards</span></h4>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex space-x-1">
                                                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-indigo-500/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                                            </div>
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-500/60">Data Security: AES-256 ACTIVE</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-3 relative z-10">
                                                    <span className="px-5 py-2 rounded-xl bg-indigo-500 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(99,102,241,0.5)]">Active</span>
                                                    <span className="text-[8px] font-black uppercase text-indigo-500/40 tracking-widest">Version 4.2</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <button className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-white/20 transition-all group">
                                                    <Lock className="mb-4 text-white/20 group-hover:text-[var(--accent-primary)] transition-colors" size={20} />
                                                    <div className="text-xs font-black uppercase text-white tracking-widest mb-1">Update Encryption Keys</div>
                                                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Refresh security keys for enhanced safety.</div>
                                                </button>
                                                <button className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-white/20 transition-all group">
                                                    <Eye className="mb-4 text-white/20 group-hover:text-[var(--accent-primary)] transition-colors" size={20} />
                                                    <div className="text-xs font-black uppercase text-white tracking-widest mb-1">Security Log</div>
                                                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">View recent login activity and security events.</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'api' && (
                                    <div className="space-y-10">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">API Configuration</h3>
                                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Connect your account with external developer tools.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40 px-2">API Key</label>
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
                                                <p className="text-[10px] text-white/40 leading-relaxed font-medium">Get instant events for document generation via secure webhooks.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'alerts' && (
                                    <div className="space-y-10">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Notifications</h3>
                                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Configure how you receive updates and status alerts.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[
                                                { id: 'brochureStatus' as const, label: "Brochure Status", desc: "Get updates when your brochure is ready." },
                                                { id: 'marketingTips' as const, label: "Marketing & Tips", desc: "Receive design tips and platform news." },
                                                { id: 'securityAlerts' as const, label: "Security Alerts", desc: "Instant alerts for account security events." },
                                                { id: 'systemUpdates' as const, label: "System Updates", desc: "Stay informed about new features and improvements." }
                                            ].map((pref) => (
                                                <div
                                                    key={pref.id}
                                                    onClick={() => setNotificationSettings(prev => ({ ...prev, [pref.id]: !prev[pref.id] }))}
                                                    className={`flex items-center justify-between p-6 bg-white/5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] ${notificationSettings[pref.id] ? 'border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/[0.02]' : 'border-white/5'
                                                        }`}
                                                >
                                                    <div className="space-y-1">
                                                        <div className={`text-xs font-black uppercase tracking-tight transition-colors ${notificationSettings[pref.id] ? 'text-[var(--accent-primary)]' : 'text-[var(--foreground)]'}`}>
                                                            {pref.label}
                                                        </div>
                                                        <div className="text-[9px] font-bold uppercase text-[var(--foreground)]/30 tracking-widest leading-none">
                                                            {pref.desc}
                                                        </div>
                                                    </div>
                                                    <div className={`transition-all duration-300 ${notificationSettings[pref.id] ? 'text-[var(--accent-primary)]' : 'text-white/20 group-hover:text-white/40'}`}>
                                                        {notificationSettings[pref.id] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'data' && (
                                    <div className="space-y-10">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Data & Privacy</h3>
                                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Manage data usage and privacy preferences.</p>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Data Management Card */}
                                            <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                                        <Database size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black uppercase tracking-widest">Your Data Archive</h4>
                                                        <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Download all your generated brochures and asset history.</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-[var(--foreground)] hover:text-black px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                                                        Download Archive
                                                    </button>
                                                    <button className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Analytics Toggle */}
                                            <div
                                                onClick={() => setPrivacySettings(prev => ({ ...prev, anonymizedAnalytics: !prev.anonymizedAnalytics }))}
                                                className={`flex items-center justify-between p-8 rounded-[2rem] border transition-all cursor-pointer group ${privacySettings.anonymizedAnalytics ? 'border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/[0.02]' : 'border-white/5 bg-white/5'
                                                    }`}
                                            >
                                                <div className="space-y-2">
                                                    <div className={`text-sm font-black uppercase tracking-widest transition-colors ${privacySettings.anonymizedAnalytics ? 'text-[var(--accent-primary)]' : 'text-[var(--foreground)]'}`}>
                                                        Anonymized Analytics
                                                    </div>
                                                    <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest max-w-md">Share usage data for platform optimization. No personal information is ever collected.</p>
                                                </div>
                                                <div className={`transition-all duration-300 ${privacySettings.anonymizedAnalytics ? 'text-[var(--accent-primary)]' : 'text-white/20 group-hover:text-white/40'}`}>
                                                    {privacySettings.anonymizedAnalytics ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                                </div>
                                            </div>

                                            {/* Policy Summary */}
                                            <div className="p-6 border border-white/5 rounded-2xl bg-white/[0.02] italic">
                                                <p className="text-[9px] text-[var(--foreground)]/30 leading-loose uppercase tracking-widest">
                                                    * Your data is encrypted at rest using AES-256 standards. We do not sell your brand assets to third-party entities. For more details, view our [Privacy Policy].
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
}
