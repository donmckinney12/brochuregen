"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Eye, Users, MessageSquare, Activity, Shield, Zap } from 'lucide-react';
import { API_URL } from '@/config';

interface LiveEvent {
    id: string;
    type: 'view' | 'lead' | 'feedback' | 'generation';
    message: string;
    timestamp: Date;
}

const EVENT_ICONS = {
    view: <Eye size={12} className="text-blue-400" />,
    lead: <Users size={12} className="text-cyan-400" />,
    feedback: <MessageSquare size={12} className="text-purple-400" />,
    generation: <Zap size={12} className="text-amber-400" />,
};

const EVENT_COLORS = {
    view: 'border-blue-500/20 bg-blue-500/5',
    lead: 'border-cyan-500/20 bg-cyan-500/5',
    feedback: 'border-purple-500/20 bg-purple-500/5',
    generation: 'border-amber-500/20 bg-amber-500/5',
};

interface LivePulseProps {
    orgId?: string;
}

export default function LivePulse({ orgId = "default" }: LivePulseProps) {
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [liveCounts, setLiveCounts] = useState({ views: 0, leads: 0, feedback: 0 });
    const wsRef = useRef<WebSocket | null>(null);
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wsUrl = `${API_URL.replace('http', 'ws')}/ws/${orgId}`;

        try {
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => setIsConnected(true);
            ws.onclose = () => setIsConnected(false);
            ws.onerror = () => setIsConnected(false);

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const newEvent: LiveEvent = {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        type: data.type || 'view',
                        message: data.message || 'Activity detected',
                        timestamp: new Date(),
                    };

                    setEvents(prev => [...prev.slice(-19), newEvent]);

                    setLiveCounts(prev => ({
                        ...prev,
                        [data.type === 'view' ? 'views' : data.type === 'lead' ? 'leads' : 'feedback']:
                            (prev[data.type === 'view' ? 'views' : data.type === 'lead' ? 'leads' : 'feedback'] || 0) + 1,
                    }));
                } catch { /* ignore parse errors */ }
            };

            return () => ws.close();
        } catch {
            setIsConnected(false);
        }
    }, [orgId]);

    // Auto-scroll feed
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [events]);

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        return `${Math.floor(seconds / 60)}m ago`;
    };

    return (
        <div className="premium-card p-12 md:p-16 border border-indigo-500/20 bg-indigo-500/[0.02] backdrop-blur-3xl shadow-[0_0_50px_rgba(99,102,241,0.1)] group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-[var(--foreground)]">
                        {isConnected ? (
                            <div className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            </div>
                        ) : (
                            <WifiOff size={18} className="text-red-500" />
                        )}
                        Live Activity <span className="text-indigo-400">Feed</span>
                    </h3>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 italic">Real-time engagement tracking active</p>
                </div>
                
                <div className="flex gap-8 px-8 py-4 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-xl">
                    {[
                        { label: 'Views', value: liveCounts.views, color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
                        { label: 'Leads', value: liveCounts.leads, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
                        { label: 'Feedback', value: liveCounts.feedback, color: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
                    ].map(stat => (
                        <div key={stat.label} className="text-center group/stat">
                            <p className={`text-2xl font-black ${stat.color} leading-none mb-1 transition-transform group-hover/stat:scale-110`}>{stat.value}</p>
                            <p className="text-[7px] font-black uppercase tracking-[0.2em] opacity-30">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Feed */}
            <div ref={feedRef} className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-4 relative z-10">
                <AnimatePresence initial={false}>
                    {events.length === 0 ? (
                        <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                            <Activity className="w-10 h-10 mx-auto mb-4 text-[var(--foreground)]/10 animate-pulse" />
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/20 italic">
                                {isConnected ? 'Awaiting activity signals...' : 'Connecting...'}
                            </p>
                        </div>
                    ) : (
                        events.map(event => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl border ${EVENT_COLORS[event.type]} transition-all hover:translate-x-1 group/event`}
                            >
                                <div className="shrink-0 p-2.5 bg-black/20 rounded-xl border border-white/5 group-hover/event:scale-110 transition-transform">
                                    {EVENT_ICONS[event.type]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-[var(--foreground)]/90 truncate uppercase tracking-tight">{event.message}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="w-1 h-1 rounded-full bg-[var(--foreground)]/20" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground)]/20">{event.type} system</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-[var(--foreground)]/20 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                                    {timeAgo(event.timestamp)}
                                </span>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
