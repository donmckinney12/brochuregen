"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, MessageSquare, Shield, Activity, Target } from 'lucide-react';

interface VoiceTrainerProps {
    initialCalibration: string;
    onSave: (calibration: string) => void;
    isScanning?: boolean;
    onScan: (url: string) => void;
}

const MARKERS = [
    { name: 'Tonal Sharpness', value: 85, color: 'text-cyan-400' },
    { name: 'Lexical Density', value: 72, color: 'text-purple-400' },
    { name: 'Empathy Index', value: 64, color: 'text-emerald-400' },
    { name: 'Urgency Bias', value: 91, color: 'text-amber-400' }
];

export default function VoiceTrainer({ initialCalibration, onSave, isScanning, onScan }: VoiceTrainerProps) {
    const [text, setText] = useState(initialCalibration);
    const [scanUrl, setScanUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate neural analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            onSave(text);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Analysis Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-inner">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black italic uppercase tracking-tighter text-[var(--foreground)]">Vocal Pattern Analysis</h4>
                        <p className="text-[10px] text-[var(--foreground)]/30 font-bold uppercase tracking-widest">Neural Calibration Lab</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Engine Online</span>
                </div>
            </div>

            {/* Matrix View */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MARKERS.map((marker, i) => (
                    <div key={i} className="p-4 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Target size={12} />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-[var(--foreground)]/30">{marker.name}</p>
                        <div className="flex items-end justify-between">
                            <span className={`text-xl font-black italic tracking-tighter ${marker.color}`}>{marker.value}%</span>
                            <div className="h-1 w-12 bg-[var(--foreground)]/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${marker.value}%` }}
                                    className={`h-full bg-current ${marker.color}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Stream */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-30 transition-opacity"></div>
                <div className="relative bg-[var(--background)] border border-[var(--glass-border)] rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="px-8 py-4 border-b border-[var(--glass-border)] bg-[var(--foreground)]/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[var(--foreground)]/40">
                            <MessageSquare size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Calibration Input Stream</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400/20" />
                            <div className="w-2 h-2 rounded-full bg-amber-400/20" />
                            <div className="w-2 h-2 rounded-full bg-emerald-400/20" />
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-48 p-8 bg-transparent text-sm text-[var(--foreground)] font-medium leading-relaxed focus:outline-none placeholder:text-[var(--foreground)]/10 resize-none"
                        placeholder="Paste sample copy, mission statements, or brand manifestos here..."
                    />
                    <div className="px-8 py-6 bg-[var(--foreground)]/5 border-t border-[var(--glass-border)] flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <input
                                    type="url"
                                    value={scanUrl}
                                    onChange={(e) => setScanUrl(e.target.value)}
                                    placeholder="Enter Protocol URL to scan..."
                                    className="w-full bg-[var(--background)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-[10px] text-[var(--foreground)] focus:ring-1 focus:ring-[var(--accent-primary)]/50 outline-none placeholder:text-[var(--foreground)]/20"
                                />
                            </div>
                            <button
                                onClick={() => onScan(scanUrl)}
                                disabled={isScanning || !scanUrl}
                                className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-white transition-all disabled:opacity-30"
                            >
                                {isScanning ? 'Syncing...' : 'Neural Scan'}
                            </button>
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || text === initialCalibration}
                            className="w-full md:w-auto px-10 py-4 bg-[var(--accent-primary)] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent-primary)]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Zap size={16} className="animate-pulse" />
                                    Calibrating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    Initial Pattern Analysis
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Neural Shield */}
            <div className="p-6 bg-[var(--accent-secondary)]/5 border border-[var(--accent-secondary)]/10 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-secondary)]/10 flex items-center justify-center text-[var(--accent-secondary)]">
                    <Shield size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] italic">Neural Guard Enabled</p>
                    <p className="text-[9px] text-[var(--foreground)]/40 font-bold uppercase tracking-tighter mt-0.5">Brand Voice consistency enforced across all generation nodes.</p>
                </div>
            </div>
        </div>
    );
}
