"use client";
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeuralLoading() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/πΩΣΔ";
        const fontSize = 16;
        const columns = Math.floor(width / fontSize);
        const drops: number[] = new Array(columns).fill(0);

        const draw = () => {
            // Theme aware backdrop sync
            const isDark = document.documentElement.classList.contains('dark');
            ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = isDark ? "#0ff" : "#6366f1"; // Cyan for Dark, Indigo for Light
            ctx.font = `black ${fontSize}px monospace`;
            ctx.shadowBlur = isDark ? 10 : 0;
            ctx.shadowColor = isDark ? "#0ff" : "transparent";

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.985) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 45);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            const newColumns = Math.floor(width / fontSize);
            drops.length = newColumns;
            drops.fill(0);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)] backdrop-blur-3xl transition-colors duration-1000"
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 dark:opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />

            <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-12">
                <div className="w-32 h-32 mb-12 relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 bottom-0 top-0 border-[1px] border-[var(--accent-primary)]/20 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-[1px] border-[var(--accent-primary)]/40 rounded-full border-t-transparent"
                    />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_40px_rgba(var(--accent-primary-rgb),0.4)] animate-pulse">
                        <span className="text-3xl font-black italic text-white underline-offset-4">BG</span>
                    </div>
                </div>

                <div className="text-center space-y-6">
                    <h2 className="text-5xl font-black text-[var(--foreground)] italic tracking-tighter uppercase mb-4 leading-none">
                        Neural <span className="text-[var(--accent-primary)]">Synthesis</span>
                    </h2>
                    <p className="text-[10px] font-black text-[var(--accent-primary)]/60 uppercase tracking-[0.5em] animate-pulse">
                        Orchestrating Cluster Node Sync...
                    </p>
                </div>

                <div className="mt-16 w-full space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[8px] font-black text-[var(--foreground)]/20 uppercase tracking-[0.2em]">Matrix Load Sequence</span>
                        <span className="text-[10px] font-mono text-[var(--accent-primary)] italic">94%</span>
                    </div>
                    <div className="h-[2px] w-full bg-[var(--foreground)]/5 rounded-full overflow-hidden border border-[var(--glass-border)]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.6)]"
                            initial={{ width: "0%", x: "-100%" }}
                            animate={{ width: "100%", x: "0%" }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <div className="mt-12 flex gap-8">
                    {['SECURE_SYNC', 'DEEP_CRAWL', 'ELITE_NODE'].map(label => (
                        <div key={label} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-ping" />
                            <span className="text-[7px] font-black text-[var(--foreground)]/30 uppercase tracking-widest">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Elite Diagnostic Overlay */}
            <div className="absolute top-12 left-12 p-6 border-l border-[var(--glass-border)] space-y-4">
                <p className="text-[9px] font-mono text-[var(--foreground)]/20 uppercase tracking-[0.3em] leading-relaxed">
                    ID: CLUSTER_0x921<br />
                    LOAD: NOMINAL<br />
                    SYNC: v3.0.2_STABLE
                </p>
            </div>

            <div className="absolute bottom-12 right-12 text-right">
                <p className="text-[10px] font-black text-[var(--accent-primary)] italic tracking-tighter uppercase">
                    Institutional Elite Operating System
                </p>
            </div>
        </motion.div>
    );
}
