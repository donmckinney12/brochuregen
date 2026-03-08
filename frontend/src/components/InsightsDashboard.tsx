"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Activity, Shield, Zap, Target } from 'lucide-react';

export default function InsightsDashboard({ onOpenVault }: { onOpenVault?: () => void }) {
    const { getToken } = useAuth();
    const [data, setData] = useState<{ date: string; generations: number; views: number; visitors: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartType, setChartType] = useState<'generation' | 'visitors'>('generation');
    const [variantData, setVariantData] = useState<{ variant_id: number; views: number }[]>([]);
    const [activities, setActivities] = useState<{ id: number; action: string; details: string; created_at: string }[]>([]);
    const [engagementData, setEngagementData] = useState<{ section_id: string; hover_count: number; total_hover_time: number }[]>([]);
    const [feedback, setFeedback] = useState<{ id: number; text: string; section_id: string; created_at: string; brochure?: any }[]>([]);
    const [funnel, setFunnel] = useState<{ views: number; leads: number; feedback: number; view_to_lead_rate: number; lead_to_feedback_rate: number } | null>(null);
    const [topPerformers, setTopPerformers] = useState<{ id: number; title: string; share_uuid: string; views: number; leads: number }[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/brochures/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const payload = await res.json();
                    setVariantData(payload.variant_performance || []);
                    const timeline = payload.timeline || [];
                    const formatted = timeline.map((item: any) => ({
                        ...item,
                        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        views: item.views || 0,
                        visitors: item.visitors || 0
                    }));
                    if (formatted.length === 0) {
                        const today = new Date();
                        setData(Array.from({ length: 7 }).map((_, i) => ({
                            date: new Date(new Date().setDate(today.getDate() - (6 - i))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            generations: 0, views: 0, visitors: 0
                        })));
                    } else {
                        setData(formatted);
                    }
                }
            } catch (err) { console.error("Analytics failure", err); }
            finally { setIsLoading(false); }
        };

        const fetchActivities = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/brochures/activities/stream`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setActivities(await res.json());
            } catch (err) { console.error("Activity failure", err); }
        };

        const fetchEngagement = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/brochures/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const brochures = await res.json();
                    if (brochures.length > 0) {
                        const engRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analytics/${brochures[0].id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (engRes.ok) setEngagementData(await engRes.json());
                    }
                }
            } catch (err) { console.error("Engagement failure", err); }
        };

        const fetchFeedback = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/brochures/feedback/all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setFeedback(await res.json());
            } catch (err) { console.error("Feedback failure", err); }
        };

        const fetchFunnel = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analytics/funnel/data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setFunnel(await res.json());
            } catch (err) { console.error("Funnel failure", err); }
        };

        const fetchTopPerformers = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analytics/top-performers/data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setTopPerformers(await res.json());
            } catch (err) { console.error("Top performers failure", err); }
        };

        fetchAnalytics(); fetchActivities(); fetchEngagement(); fetchFeedback(); fetchFunnel(); fetchTopPerformers();
    }, [getToken]);

    const totalBrochures = data.reduce((sum, item) => sum + (item.generations || 0), 0);
    const totalViews = data.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalVisitors = data.reduce((sum, item) => sum + (item.visitors || 0), 0);

    if (isLoading) return <div className="h-64 flex items-center justify-center"><Zap className="animate-pulse text-blue-500" /></div>;

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Neural Syncs', value: totalBrochures, icon: <Activity className="w-5 h-5" />, color: 'text-indigo-400' },
                    { label: 'Data Echoes', value: totalViews, icon: <Zap className="w-5 h-5" />, color: 'text-cyan-400' },
                    { label: 'Active Nodes', value: totalVisitors, icon: <Shield className="w-5 h-5" />, color: 'text-emerald-400' },
                    { label: 'Protocol Value', value: `$${(totalBrochures * 150).toLocaleString()}`, icon: <Target className="w-5 h-5" />, color: 'text-amber-400' }
                ].map((stat, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="premium-card p-6 border border-white/5 bg-white/5 backdrop-blur-xl rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`${stat.color} opacity-50`}>{stat.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</span>
                        </div>
                        <div className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Flux Analysis */}
            <div className="premium-card p-8 border border-white/5 bg-white/5 backdrop-blur-xl rounded-[2rem]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black italic uppercase tracking-tighter">Network Flux</h2>
                    <div className="flex gap-2 p-1 bg-black/20 rounded-xl">
                        {['generation', 'visitors'].map((type) => (
                            <button key={type} onClick={() => setChartType(type as any)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${chartType === type ? 'bg-white text-black' : 'opacity-40 hover:opacity-60'}`}>
                                {type === 'generation' ? 'Syncs' : 'Nodes'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="fluxGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartType === 'generation' ? '#6366f1' : '#22d3ee'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={chartType === 'generation' ? '#6366f1' : '#22d3ee'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" hide />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey={chartType === 'generation' ? 'generations' : 'visitors'} stroke={chartType === 'generation' ? '#6366f1' : '#22d3ee'} strokeWidth={4} fill="url(#fluxGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Variant Performance */}
                <div className="premium-card p-8 border border-white/5 bg-white/5 rounded-[2rem]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-8">Protocol Optimization</h3>
                    {variantData.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center opacity-20"><Zap className="w-12 h-12" /></div>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={variantData.map(v => ({ ...v, name: `Variant ${String.fromCharCode(65 + v.variant_id - 1)}` }))}>
                                    <XAxis dataKey="name" hide />
                                    <Bar dataKey="views" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Resonance Heatmap */}
                <div className="premium-card p-8 border border-white/10 bg-indigo-500/5 rounded-[2rem]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Resonance Heatmap</h3>
                        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>
                    {engagementData.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center opacity-20"><Activity className="w-12 h-12" /></div>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={engagementData.sort((a, b) => b.total_hover_time - a.total_hover_time)}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="section_id" type="category" width={80} tick={{ fontSize: 8, fill: '#fff', opacity: 0.4 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={({ active, payload }) => {
                                        if (active && payload?.length) {
                                            const d = payload[0].payload;
                                            return <div className="bg-black border border-white/10 p-3 rounded-xl shadow-2xl">
                                                <p className="text-[8px] font-black uppercase opacity-40 mb-1">{d.section_id}</p>
                                                <div className="text-xs font-black">{(d.total_hover_time / 1000).toFixed(1)}s Attention</div>
                                            </div>;
                                        }
                                        return null;
                                    }} />
                                    <Bar dataKey="total_hover_time" radius={[0, 4, 4, 0]}>
                                        {engagementData.map((_, i) => <Cell key={i} fill="#6366f1" opacity={1 - i * 0.15} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Stream */}
            <div className="premium-card p-8 border border-white/5 bg-white/5 rounded-[2rem]">
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Studio Stream</h3>
                <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                    {activity.action.substring(0, 3)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">{activity.details}</h4>
                                    <p className="text-[10px] font-black uppercase opacity-30">{activity.action}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black opacity-20">{new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Neural Echoes (Feedback) */}
            <div className="premium-card p-8 border border-white/5 bg-cyan-500/5 rounded-[2rem]">
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Client Pulse Feedback</h3>
                <div className="space-y-4">
                    {feedback.length === 0 ? (
                        <div className="h-32 flex items-center justify-center opacity-40 text-xs font-bold uppercase tracking-widest">No feedback detected yet.</div>
                    ) : (
                        feedback.map((fb) => (
                            <div key={fb.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-sm font-bold italic leading-relaxed text-white/90">"{fb.text}"</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest border border-cyan-400/20 px-2 py-0.5 rounded-full bg-cyan-400/10">
                                            {fb.section_id.replace('_', ' ')}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">
                                            {new Date(fb.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Conversion Funnel */}
            {funnel && (
                <div className="premium-card p-6 sm:p-8 border border-white/10 bg-white/5">
                    <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 mb-8">
                        <Target size={20} className="text-cyan-400" />
                        Conversion Funnel
                    </h3>
                    <div className="grid grid-cols-3 gap-4 sm:gap-6">
                        {[
                            { label: 'Views', value: funnel.views, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Leads', value: funnel.leads, color: 'from-purple-500 to-pink-500', rate: funnel.view_to_lead_rate },
                            { label: 'Feedback', value: funnel.feedback, color: 'from-amber-500 to-orange-500', rate: funnel.lead_to_feedback_rate },
                        ].map((step, i) => (
                            <div key={step.label} className="text-center">
                                <div className={`w-full h-24 sm:h-32 bg-gradient-to-t ${step.color} rounded-2xl flex items-end justify-center pb-3 relative overflow-hidden`}
                                    style={{ opacity: Math.max(0.3, 1 - i * 0.25) }}>
                                    <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">{step.value}</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest mt-3 opacity-60">{step.label}</p>
                                {step.rate !== undefined && (
                                    <p className="text-[9px] font-bold text-emerald-400 mt-1">{step.rate}% conversion</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Top Performers */}
            {topPerformers.length > 0 && (
                <div className="premium-card p-6 sm:p-8 border border-white/10 bg-white/5">
                    <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 mb-8">
                        <Sparkles size={20} className="text-amber-400" />
                        Top Performers
                    </h3>
                    <div className="space-y-3">
                        {topPerformers.map((b, i) => (
                            <div key={b.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : 'bg-orange-700/20 text-orange-400'
                                    }`}>
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{b.title}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">{b.share_uuid || 'Draft'}</p>
                                </div>
                                <div className="flex gap-6 shrink-0">
                                    <div className="text-center">
                                        <p className="text-lg font-black">{b.views}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Views</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-black text-cyan-400">{b.leads}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Leads</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="premium-card p-12 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-[3rem] flex flex-col items-center text-center">
                <Target className="w-12 h-12 text-indigo-400 mb-6" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Initialize Synergy</h3>
                <p className="text-sm opacity-40 mb-8 max-w-sm">Synchronized brand nodes increase resonance by 42%. Scale the protocol now.</p>
                <button onClick={onOpenVault} className="px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                    Access Brand Vault
                </button>
            </div>
        </div>
    );
}
