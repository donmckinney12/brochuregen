"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    Users,
    Trash2,
    Search,
    Download,
    Mail,
    Calendar,
    ChevronRight,
    Filter,
    ShieldCheck,
    Activity,
    Database,
    Loader2
} from 'lucide-react';
import { API_URL } from '@/config';

interface Lead {
    id: number;
    email: string;
    name?: string;
    company?: string;
    message?: string;
    created_at: string;
    brochure_id: number;
}

export default function LeadsVault() {
    const { getToken } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [followupLoading, setFollowupLoading] = useState<number | null>(null);
    const [selectedFollowup, setSelectedFollowup] = useState<{ step: number; subject: string; body: string }[] | null>(null);
    const [selectedLeadEmail, setSelectedLeadEmail] = useState<string>('');
    const [sendingStep, setSendingStep] = useState<number | null>(null);
    const [sentSteps, setSentSteps] = useState<Set<number>>(new Set());
    const [sendingAll, setSendingAll] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${API_URL}/api/v1/leads/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLeads(data);
                }
            } catch (err) {
                console.error("Failed to load leads", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, [getToken]);

    const handleExport = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/leads/export`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    const handleGenerateFollowup = async (leadId: number) => {
        setFollowupLoading(leadId);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/leads/followup/${leadId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedFollowup(data.sequence);
            }
        } catch (err) {
            console.error("Follow-up generation failed", err);
        } finally {
            setFollowupLoading(null);
        }
    };

    const handleSendStep = async (step: { step: number; subject: string; body: string }) => {
        if (!selectedLeadEmail) return;
        setSendingStep(step.step);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/email/send-followup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ to_email: selectedLeadEmail, subject: step.subject, body: step.body })
            });
            if (res.ok) setSentSteps(prev => new Set([...prev, step.step]));
        } catch (err) { console.error(err); }
        finally { setSendingStep(null); }
    };

    const handleSendAll = async () => {
        if (!selectedFollowup || !selectedLeadEmail) return;
        setSendingAll(true);
        try {
            const token = await getToken();
            await fetch(`${API_URL}/api/v1/email/send-sequence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ to_email: selectedLeadEmail, sequence: selectedFollowup })
            });
            setSentSteps(new Set(selectedFollowup.map(s => s.step)));
        } catch (err) { console.error(err); }
        finally { setSendingAll(false); }
    };

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Neural Lead Vault</h2>
                    <p className="text-[10px] text-[var(--foreground)]/50 font-bold tracking-[0.3em] uppercase mt-1">Status: Monitoring Incoming Nodes</p>
                </div>
                <button
                    onClick={handleExport}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                    Neural Export (.CSV)
                </button>
            </div>

            {leads.length === 0 ? (
                <div className="premium-card p-12 border-[var(--glass-border)] text-center">
                    <div className="w-16 h-16 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-6 opacity-20">
                        <svg className="w-8 h-8 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--foreground)]/80 italic">No Leads Detected</h3>
                    <p className="text-sm text-[var(--foreground)]/80 mt-2">Activate Lead Magnets in your brochures to begin capture.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {leads.map((lead) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-card p-6 border-[var(--glass-border)] flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:border-[var(--accent-primary)]/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-black italic text-xl shadow-inner">
                                    {lead.name ? lead.name[0] : lead.email[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-black text-[var(--foreground)] italic tracking-tight text-lg">{lead.name || 'Anonymous Node'}</h4>
                                        <span className="px-2 py-0.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded text-[8px] font-black text-[var(--accent-primary)] uppercase tracking-widest leading-none">Verified</span>
                                    </div>
                                    <p className="text-sm text-[var(--foreground)]/80 font-medium font-mono">{lead.email}</p>
                                </div>
                            </div>

                            <div className="flex flex-col xl:items-end gap-1 relative z-10">
                                <span className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.2em]">{lead.company || 'Direct Protocol'}</span>
                                <span className="text-[10px] text-[var(--foreground)]/80 font-bold uppercase tracking-widest">Captured: {new Date(lead.created_at).toLocaleDateString()}</span>
                            </div>

                            {lead.message && (
                                <div className="flex-1 max-w-sm p-4 bg-[var(--foreground)]/5 rounded-xl border border-[var(--glass-border)] text-xs text-[var(--foreground)]/50 italic font-medium leading-relaxed relative z-10">
                                    <div className="absolute -top-2 -left-2 text-[var(--accent-primary)]/30 text-2xl font-black">"</div>
                                    {lead.message}
                                </div>
                            )}

                            <div className="flex gap-2 relative z-10">
                                <button
                                    onClick={() => {
                                        handleGenerateFollowup(lead.id);
                                        setSelectedLeadEmail(lead.email);
                                        setSentSteps(new Set());
                                    }}
                                    disabled={followupLoading === lead.id}
                                    className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {followupLoading === lead.id ? (
                                        <>
                                            <span className="w-2 h-2 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin"></span>
                                            Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            Neural Follow-up
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedFollowup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-2xl bg-[var(--background)]/80 transition-colors duration-500"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[var(--background)] border border-[var(--glass-border)] rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-8 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Neural Follow-up Matrix</h2>
                                    <p className="text-[10px] text-[var(--accent-primary)] font-bold tracking-[0.4em] uppercase mt-1">Status: Sequenced & Ready</p>
                                </div>
                                <button onClick={() => setSelectedFollowup(null)} className="p-2 hover:bg-[var(--foreground)]/5 rounded-xl transition-all">
                                    <svg className="w-6 h-6 text-[var(--foreground)]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-8 bg-[var(--foreground)]/5">
                                {selectedFollowup.map((step) => (
                                    <div key={step.step} className="space-y-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="px-3 py-1 bg-[var(--accent-primary)] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Step {step.step}</div>
                                                <div className="text-sm font-black text-[var(--foreground)] italic tracking-tight">{step.subject}</div>
                                            </div>
                                            <button
                                                onClick={() => handleSendStep(step)}
                                                disabled={sendingStep === step.step || sentSteps.has(step.step)}
                                                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all shrink-0 ${sentSteps.has(step.step)
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-[var(--accent-primary)] text-white hover:opacity-90'
                                                    } disabled:opacity-50`}
                                            >
                                                {sentSteps.has(step.step) ? 'Sent' : sendingStep === step.step ? 'Sending...' : 'Send Email'}
                                            </button>
                                        </div>
                                        <div className="p-6 bg-[var(--background)] border border-[var(--glass-border)] rounded-2xl text-xs text-[var(--foreground)]/80 leading-relaxed font-medium whitespace-pre-wrap">
                                            {step.body}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 border-t border-[var(--glass-border)] flex flex-wrap gap-4 bg-[var(--background)]">
                                <button
                                    onClick={handleSendAll}
                                    disabled={sendingAll}
                                    className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {sendingAll ? 'Dispatching...' : 'Send Entire Sequence'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedFollowup) {
                                            navigator.clipboard.writeText(selectedFollowup.map(s => `Subject: ${s.subject}\n\n${s.body}`).join('\n\n---\n\n'));
                                        }
                                    }}
                                    className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all"
                                >
                                    Copy Matrix
                                </button>
                                <button onClick={() => setSelectedFollowup(null)} className="px-8 py-4 border border-[var(--glass-border)] text-[var(--foreground)] font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[var(--foreground)]/5 transition-all">
                                    Close Feed
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
