"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, 
    TrendingUp, 
    Target, 
    Zap, 
    ChevronRight, 
    BrainCircuit,
    Loader2,
    ShieldCheck,
    Lightbulb
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/config';

interface StrategyData {
    conversion_score: number;
    strategic_tips: string[];
    recommended_cta: string;
    persona_insight: string;
}

interface StrategyWidgetProps {
    brochureContent: any;
}

export default function StrategyWidget({ brochureContent }: StrategyWidgetProps) {
    const { getToken } = useAuth();
    const [strategy, setStrategy] = useState<StrategyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStrategy = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/strategy/analyze`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: brochureContent }),
            });

            if (!res.ok) throw new Error('Failed to synchronize with AI Strategy Engine');
            
            const result = await res.json();
            setStrategy(result.strategy);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (brochureContent) {
            fetchStrategy();
        }
    }, [brochureContent?.headline]); // Refresh if headline (key content) changes

    return (
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 space-y-8 backdrop-blur-3xl shadow-xl relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <BrainCircuit size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[var(--foreground)] uppercase italic tracking-tighter">AI Strategist</h3>
                        <p className="text-[9px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest leading-none mt-1">Conversion Intelligence v4.0</p>
                    </div>
                </div>
                {loading && <Loader2 className="animate-spin text-purple-400" size={20} />}
            </div>

            {strategy ? (
                <div className="space-y-8 relative z-10">
                    {/* Persona Insight */}
                    <div className="p-6 bg-purple-500/5 border border-purple-500/10 rounded-3xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Target size={14} className="text-purple-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Target Persona Insight</span>
                        </div>
                        <p className="text-xs font-bold text-[var(--foreground)]/70 italic leading-relaxed">
                            "{strategy.persona_insight}"
                        </p>
                    </div>

                    {/* Score Meter */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Conversion Resonance</span>
                            <span className="text-2xl font-black text-purple-400 italic">{strategy.conversion_score}%</span>
                        </div>
                        <div className="h-2 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${strategy.conversion_score}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                            />
                        </div>
                    </div>

                    {/* Strategic Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {strategy.strategic_tips.map((tip, i) => (
                            <div key={i} className="p-4 bg-[var(--foreground)]/[0.02] border border-[var(--glass-border)] rounded-2xl flex gap-4 hover:border-purple-500/30 transition-all group/tip">
                                <div className="shrink-0 w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-[10px] font-black">
                                    {i + 1}
                                </div>
                                <p className="text-[11px] font-bold text-[var(--foreground)]/60 group-hover/tip:text-[var(--foreground)] transition-colors leading-snug">
                                    {tip}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Recommended CTA */}
                    <div className="pt-6 border-t border-[var(--glass-border)]">
                        <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">Optimized CTA</p>
                                    <p className="text-sm font-black text-[var(--foreground)] uppercase italic tracking-tight">{strategy.recommended_cta}</p>
                                </div>
                            </div>
                            <button className="p-3 bg-emerald-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center space-y-4">
                    {loading ? (
                        <>
                            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 animate-pulse">Analyzing Content Vectors...</p>
                        </>
                    ) : (
                        <>
                            <Lightbulb size={32} className="text-[var(--foreground)]/20" />
                            <button 
                                onClick={fetchStrategy}
                                className="px-8 py-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Initialize Strategy Analysis
                            </button>
                        </>
                    )}
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase text-center tracking-widest">
                    {error}
                </div>
            )}
        </div>
    );
}
