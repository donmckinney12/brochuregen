"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Eye, Users, MessageSquare, Zap } from 'lucide-react';

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
        const wsUrl = `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('http', 'ws')}/ws/${orgId}`;

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
                            prev[data.type === 'view' ? 'views' : data.type === 'lead' ? 'leads' : 'feedback'] + 1,
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
        <div className="premium-card p-6 border border-white/10 bg-white/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-2">
                    {isConnected ? (
                        <Wifi size={14} className="text-emerald-400 animate-pulse" />
                    ) : (
                        <WifiOff size={14} className="text-red-400" />
                    )}
                    Live Pulse
                </h3>
                <div className="flex gap-4">
                    {[
                        { label: 'Views', value: liveCounts.views, color: 'text-blue-400' },
                        { label: 'Leads', value: liveCounts.leads, color: 'text-cyan-400' },
                        { label: 'Feedback', value: liveCounts.feedback, color: 'text-purple-400' },
                    ].map(stat => (
                        <div key={stat.label} className="text-center">
                            <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-30">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Feed */}
            <div ref={feedRef} className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                <AnimatePresence initial={false}>
                    {events.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">
                                {isConnected ? 'Waiting for activity...' : 'Connecting to live feed...'}
                            </p>
                        </div>
                    ) : (
                        events.map(event => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-3 p-3 rounded-xl border ${EVENT_COLORS[event.type]} transition-all`}
                            >
                                <div className="shrink-0">{EVENT_ICONS[event.type]}</div>
                                <p className="text-xs flex-1 truncate">{event.message}</p>
                                <span className="text-[9px] opacity-40 shrink-0">{timeAgo(event.timestamp)}</span>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
