"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { FlaskConical, Trophy, ArrowUpRight, BarChart3, Eye, Users, Activity, TrendingUp, Target, Zap, Clock, ChevronRight, Filter, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { API_URL } from '@/config';

interface Variant {
    id: number;
    variant_label: string;
    content: Record<string, unknown>;
}

interface BrochureWithVariants {
    id: number;
    title: string;
    share_uuid: string;
    views: number;
    leads: number;
    variants: Variant[];
}

export default function ABTestDashboard() {
    const { getToken } = useAuth();
    const [brochures, setBrochures] = useState<BrochureWithVariants[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${API_URL}/api/v1/brochures/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Only show brochures that have variants
                    const withVariants = data.filter((b: any) => b.variants && b.variants.length > 0);
                    setBrochures(withVariants);
                }
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const getConfidence = (originalViews: number, variantViews: number): { level: string; color: string } => {
        const total = originalViews + variantViews;
        if (total < 30) return { level: 'Low', color: 'text-amber-400' };
        if (total < 100) return { level: 'Medium', color: 'text-blue-400' };
        return { level: 'High', color: 'text-emerald-400' };
    };

    if (loading) {
        return (
            <div className="h-48 flex items-center justify-center">
                <FlaskConical className="w-8 h-8 animate-pulse text-purple-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <FlaskConical size={20} className="text-purple-400" />
                <h3 className="text-lg font-black italic uppercase tracking-tighter">A/B Test Lab</h3>
            </div>

            {brochures.length === 0 ? (
                <div className="premium-card p-12 border border-white/10 bg-white/5 text-center">
                    <FlaskConical size={32} className="mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No A/B tests yet</p>
                    <p className="text-xs opacity-40 mt-2">Generate a variant from any brochure to start testing</p>
                </div>
            ) : (
                brochures.map(brochure => (
                    <motion.div
                        key={brochure.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card p-6 border border-white/10 bg-white/5 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black italic uppercase tracking-tight truncate">{brochure.title || 'Untitled'}</h4>
                            <div className="flex gap-4 shrink-0">
                                <div className="flex items-center gap-1.5">
                                    <Eye size={12} className="text-blue-400" />
                                    <span className="text-sm font-black">{brochure.views || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users size={12} className="text-cyan-400" />
                                    <span className="text-sm font-black">{brochure.leads || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Variant Comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Original */}
                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Original</span>
                                    <Trophy size={14} className="text-amber-400 opacity-50" />
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-2xl font-black">{brochure.views || 0}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Views</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-cyan-400">{brochure.leads || 0}</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Leads</p>
                                    </div>
                                </div>
                            </div>

                            {/* Variants */}
                            {brochure.variants.map(variant => {
                                const confidence = getConfidence(brochure.views || 0, 0);
                                return (
                                    <div key={variant.id} className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">
                                                {variant.variant_label || `Variant ${variant.id}`}
                                            </span>
                                            <span className={`text-[8px] font-black uppercase ${confidence.color}`}>
                                                {confidence.level} Confidence
                                            </span>
                                        </div>
                                        <div className="flex gap-6">
                                            <div>
                                                <p className="text-2xl font-black">-</p>
                                                <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Views</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black text-cyan-400">-</p>
                                                <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Leads</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
}
