"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import { Trophy, Star, Zap, Lock } from 'lucide-react';

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    xp: number;
    unlocked: boolean;
}

interface GamificationProfile {
    level: number;
    xp: number;
    xp_to_next_level: number;
    achievements: Achievement[];
    stats: { brochures_created: number };
}

export default function AchievementBadges() {
    const { getToken } = useAuth();
    const [profile, setProfile] = useState<GamificationProfile | null>(null);

    useEffect(() => {
        const fetch_profile = async () => {
            try {
                const token = await getToken();
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/gamification/profile`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                if (res.ok) setProfile(await res.json());
            } catch { /* ignore */ }
        };
        fetch_profile();
    }, []);

    if (!profile) return null;

    const xpProgress = profile.xp / ((profile.level + 1) * 100) * 100;

    return (
        <div className="premium-card p-6 sm:p-8 border border-white/10 bg-white/5 space-y-6">
            {/* Level & XP */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{profile.level}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-2">
                            <Trophy size={16} className="text-amber-400" />
                            Level {profile.level}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{profile.xp} XP</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, xpProgress)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        />
                    </div>
                    <p className="text-[9px] font-bold opacity-30 mt-1">{profile.xp_to_next_level} XP to next level</p>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {profile.achievements.map((ach, i) => (
                    <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`relative p-4 rounded-2xl border text-center transition-all ${ach.unlocked
                                ? 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/30'
                                : 'border-white/5 bg-white/[0.02] opacity-50'
                            }`}
                    >
                        <span className="text-2xl">{ach.icon}</span>
                        <p className="text-[9px] font-black uppercase tracking-widest mt-2">{ach.name}</p>
                        <p className="text-[8px] opacity-40 mt-1">{ach.description}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            {ach.unlocked ? (
                                <Star size={10} className="text-amber-400" fill="currentColor" />
                            ) : (
                                <Lock size={10} className="opacity-30" />
                            )}
                            <span className="text-[8px] font-black text-amber-400">{ach.xp} XP</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
                <div className="text-center">
                    <p className="text-xl font-black">{profile.stats.brochures_created}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Brochures</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-black text-amber-400">{profile.achievements.filter(a => a.unlocked).length}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Unlocked</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-black text-purple-400">{profile.achievements.length}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Total</p>
                </div>
            </div>
        </div>
    );
}
