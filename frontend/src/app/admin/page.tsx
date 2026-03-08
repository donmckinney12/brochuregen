"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminUser {
    id: string;
    email: string;
    full_name: string | null;
    plan: string;
    credits: number;
    refine_credits: number;
    created_at: string | null;
    stripe_customer_id: string | null;
}

interface AdminStats {
    total_users: number;
    total_brochures: number;
    total_leads: number;
    total_views: number;
    plan_distribution: Record<string, number>;
}

export default function AdminDashboard() {
    const { user, getToken } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [overrideForm, setOverrideForm] = useState({ credits: 0, refine_credits: 0, plan: '' });
    const [overrideStatus, setOverrideStatus] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                const headers = { 'Authorization': `Bearer ${token}` };

                const [statsRes, usersRes] = await Promise.all([
                    fetch(`${apiUrl}/api/v1/admin/stats`, { headers }),
                    fetch(`${apiUrl}/api/v1/admin/users`, { headers }),
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (usersRes.ok) setUsers(await usersRes.json());
            } catch (err) {
                console.error("Admin fetch failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [getToken, apiUrl]);

    const handleOverride = async (userId: string) => {
        try {
            const token = await getToken();
            const res = await fetch(`${apiUrl}/api/v1/admin/users/${userId}/override`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(overrideForm),
            });
            if (res.ok) {
                const data = await res.json();
                setOverrideStatus(`Updated: ${data.plan} | ${data.credits} credits`);
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: data.plan, credits: data.credits, refine_credits: data.refine_credits } : u));
                setTimeout(() => { setEditingUser(null); setOverrideStatus(null); }, 2000);
            }
        } catch (err) { console.error(err); }
    };

    if (user?.email !== 'mckinneydonald321@gmail.com') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
                <div className="border border-red-500/20 bg-red-500/5 p-12 rounded-[3rem] text-center max-w-md backdrop-blur-3xl">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-red-500 mb-4">Access Restricted</h2>
                    <p className="text-red-500/40 text-[10px] uppercase tracking-[0.2em] mb-12">Unauthorized biometric signature detected.</p>
                    <a href="/dashboard" className="inline-block px-8 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full">Return to Dashboard</a>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Nodes', value: stats?.total_users || 0, color: 'cyan' },
        { label: 'Brochures Synced', value: stats?.total_brochures || 0, color: 'emerald' },
        { label: 'Leads Captured', value: stats?.total_leads || 0, color: 'indigo' },
        { label: 'Total Views', value: stats?.total_views || 0, color: 'amber' },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-cyan-500/30 overflow-hidden relative">
            <Navbar />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.2),transparent_70%)]" />
            </div>

            <main className="relative pt-32 pb-20 px-6 max-w-[1600px] mx-auto z-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16 border-b border-white/10 pb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Primary Command Node</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">Admin <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Matrix</span></h1>
                    </div>
                    {stats?.plan_distribution && (
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px]">
                            {Object.entries(stats.plan_distribution).map(([plan, count]) => (
                                <div key={plan} className="text-center">
                                    <div className="text-lg font-black text-white">{count}</div>
                                    <div className="text-white/30 font-black uppercase tracking-widest">{plan || 'free'}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {statCards.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group backdrop-blur-md"
                        >
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">{stat.label}</h3>
                            <span className="text-5xl font-black italic tracking-tighter">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Users Table */}
                <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden backdrop-blur-md">
                    <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                        <h3 className="font-black italic tracking-tighter uppercase text-xl">Active Neural Nodes ({users.length})</h3>
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> LIVE DATA
                        </div>
                    </div>
                    <div className="p-4 sm:p-8 space-y-4 max-h-[600px] overflow-y-auto">
                        {users.map((u) => (
                            <div key={u.id} className="flex flex-col xl:flex-row xl:items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group gap-4">
                                <div className="flex items-center gap-5 min-w-0">
                                    <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shrink-0">
                                        {(u.full_name || u.email)[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black uppercase tracking-[0.05em] text-xs truncate">{u.full_name || 'Anonymous'}</p>
                                        <p className="text-[10px] text-white/30 font-mono truncate">{u.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="text-center">
                                        <span className="block text-[8px] text-white/20 font-black uppercase mb-1">Plan</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${u.plan === 'ultimate' ? 'bg-amber-500/20 text-amber-400' : u.plan === 'enterprise' ? 'bg-indigo-500/20 text-indigo-400' : u.plan === 'pro' || u.plan === 'professional' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-white/10 text-white/40'}`}>
                                            {u.plan || 'free'}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[8px] text-white/20 font-black uppercase mb-1">Credits</span>
                                        <span className="text-xs font-mono font-bold text-cyan-400">{u.credits}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[8px] text-white/20 font-black uppercase mb-1">Joined</span>
                                        <span className="text-[10px] font-mono text-white/30">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingUser(u.id);
                                            setOverrideForm({ credits: u.credits, refine_credits: u.refine_credits, plan: u.plan || 'free' });
                                        }}
                                        className="px-5 py-2 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Override
                                    </button>
                                </div>

                                {/* Override Inline Form */}
                                <AnimatePresence>
                                    {editingUser === u.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="w-full overflow-hidden"
                                        >
                                            <div className="flex flex-wrap items-end gap-4 pt-4 border-t border-white/10 mt-4">
                                                <div>
                                                    <label className="block text-[8px] text-white/30 font-black uppercase mb-1">Plan</label>
                                                    <select
                                                        value={overrideForm.plan}
                                                        onChange={e => setOverrideForm(f => ({ ...f, plan: e.target.value }))}
                                                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                                    >
                                                        {['free', 'starter', 'professional', 'enterprise', 'ultimate'].map(p => (
                                                            <option key={p} value={p} className="bg-black">{p}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[8px] text-white/30 font-black uppercase mb-1">Credits</label>
                                                    <input type="number" value={overrideForm.credits} onChange={e => setOverrideForm(f => ({ ...f, credits: +e.target.value }))} className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-24" />
                                                </div>
                                                <div>
                                                    <label className="block text-[8px] text-white/30 font-black uppercase mb-1">Refine</label>
                                                    <input type="number" value={overrideForm.refine_credits} onChange={e => setOverrideForm(f => ({ ...f, refine_credits: +e.target.value }))} className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-24" />
                                                </div>
                                                <button onClick={() => handleOverride(u.id)} className="px-6 py-2 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-cyan-400 transition-all">
                                                    Apply
                                                </button>
                                                <button onClick={() => setEditingUser(null)} className="px-4 py-2 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white/5 transition-all">
                                                    Cancel
                                                </button>
                                                {overrideStatus && <span className="text-cyan-400 text-[10px] font-bold animate-pulse">{overrideStatus}</span>}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
