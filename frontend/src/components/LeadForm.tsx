"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, ShieldCheck, Mail, User, Phone } from 'lucide-react';
import { API_URL } from '@/config';

interface LeadFormProps {
    shareUuid: string;
    primaryColor: string;
    onSuccess?: () => void;
}

export default function LeadForm({ shareUuid, primaryColor, onSuccess }: LeadFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const apiUrl = API_URL;
            const res = await fetch(`${apiUrl}/api/v1/leads/submit/${shareUuid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData
                })
            });

            if (!res.ok) throw new Error('Submission failed');

            setStatus('success');
            onSuccess?.();
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-[2rem] shadow-2xl backdrop-blur-xl"
            >
                <div className="w-16 h-16 bg-[var(--accent-primary)] text-[var(--background)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--accent-primary)]/20 rotate-12">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="font-black text-[var(--foreground)] italic uppercase tracking-tighter text-xl mb-2">Protocol Sync Complete</h3>
                <p className="text-[var(--foreground)]/80 text-[10px] font-bold uppercase tracking-[0.2em]">Transmission secured. A representative will reach out shortly.</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto p-2">
            <div className="grid grid-cols-2 gap-3">
                <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:ring-2 focus:ring-[var(--accent-primary)]/50 outline-none transition-all font-bold uppercase tracking-widest"
                />
                <input
                    type="text"
                    placeholder="Organization"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:ring-2 focus:ring-[var(--accent-primary)]/50 outline-none transition-all font-bold uppercase tracking-widest"
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Business Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:ring-2 focus:ring-[var(--accent-primary)]/50 outline-none transition-all font-bold uppercase tracking-widest"
                />
            </div>
            <div>
                <textarea
                    placeholder="Neural Brief / Requirements"
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:ring-2 focus:ring-[var(--accent-primary)]/50 outline-none transition-all resize-none font-bold uppercase tracking-widest"
                />
            </div>
            <button
                type="submit"
                disabled={status === 'loading'}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-4 rounded-xl font-black text-[12px] text-white uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group"
            >
                <span className="relative z-10">{status === 'loading' ? 'Encrypting Node...' : 'Initialize Protocol'}</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
            </button>
            {status === 'error' && (
                <p className="text-red-500 text-[8px] text-center font-black uppercase tracking-[0.2em] animate-pulse">
                    Node Error: Sync Interrupted
                </p>
            )}
        </form>
    );
}
