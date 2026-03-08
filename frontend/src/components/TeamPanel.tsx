"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { UserPlus, Users, Trash2, Shield, Edit3, Eye, Loader2 } from 'lucide-react';

const ROLES = [
    { value: 'editor', label: 'Editor', icon: <Edit3 size={12} />, color: 'text-blue-400' },
    { value: 'viewer', label: 'Viewer', icon: <Eye size={12} />, color: 'text-slate-400' },
];

interface Member {
    email: string;
    role: string;
    status: string;
}

export default function TeamPanel() {
    const { getToken } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('editor');
    const [isInviting, setIsInviting] = useState(false);
    const [error, setError] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const fetchMembers = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${apiUrl}/api/v1/teams/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMembers(data.members);
            }
        } catch { /* ignore */ }
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleInvite = async () => {
        if (!email.includes('@')) { setError('Please enter a valid email'); return; }
        setIsInviting(true);
        setError('');

        try {
            const token = await getToken();
            const res = await fetch(`${apiUrl}/api/v1/teams/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email, role }),
            });
            if (res.ok) {
                setEmail('');
                fetchMembers();
            } else {
                const data = await res.json();
                setError(data.detail || 'Invite failed');
            }
        } catch { setError('Network error'); }
        finally { setIsInviting(false); }
    };

    const handleRemove = async (memberEmail: string) => {
        const token = await getToken();
        await fetch(`${apiUrl}/api/v1/teams/members/${encodeURIComponent(memberEmail)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        fetchMembers();
    };

    return (
        <div className="premium-card p-6 sm:p-8 border border-white/10 bg-white/5 space-y-6">
            <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3">
                <Shield size={20} className="text-cyan-400" />
                Team Management
            </h3>

            {/* Invite Form */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    placeholder="team@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] appearance-none"
                >
                    {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <button
                    onClick={handleInvite}
                    disabled={isInviting || !email}
                    className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] transition-all disabled:opacity-30 flex items-center gap-2"
                >
                    {isInviting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    Invite
                </button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}

            {/* Members List */}
            <div className="space-y-2">
                <AnimatePresence>
                    {members.length === 0 ? (
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-20 py-6 text-center">No team members yet</p>
                    ) : (
                        members.map(m => (
                            <motion.div
                                key={m.email}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all"
                            >
                                <Users size={16} className="text-cyan-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{m.email}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-30">{m.role} &middot; {m.status}</p>
                                </div>
                                <button
                                    onClick={() => handleRemove(m.email)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400/50 hover:text-red-400 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
