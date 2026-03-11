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
            // High-contrast elite background sync
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#0ff"; // Primary Cyan
            ctx.font = `black ${fontSize}px monospace`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#0ff";

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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-colors duration-1000"
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />

            <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-12">
                <div className="w-32 h-32 mb-12 relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 bottom-0 top-0 border-[1px] border-cyan-500/20 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-[1px] border-cyan-400/40 rounded-full border-t-transparent"
                    />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse">
                        <span className="text-3xl font-black italic text-white">BG</span>
                    </div>
                </div>

                <div className="text-center space-y-6">
                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">
                        Neural <span className="text-cyan-400">Synthesis</span>
                    </h2>
                    <p className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.5em] animate-pulse">
                        Orchestrating Cluster Node Sync...
                    </p>
                </div>

                <div className="mt-16 w-full space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Matrix Load Sequence</span>
                        <span className="text-[10px] font-mono text-cyan-400 italic">88%</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                            initial={{ width: "0%", x: "-100%" }}
                            animate={{ width: "100%", x: "0%" }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <div className="mt-12 flex gap-8">
                    {['SECURE_SYNC', 'DEEP_CRAWL', 'ELITE_NODE'].map(label => (
                        <div key={label} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
                            <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Elite Diagnostic Overlay */}
            <div className="absolute top-12 left-12 p-6 border-l border-white/10 space-y-4">
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] leading-relaxed">
                    ID: CLUSTER_0x921<br />
                    LOAD: NOMINAL<br />
                    SYNC: v3.0.1_STABLE
                </p>
            </div>

            <div className="absolute bottom-12 right-12 text-right">
                <p className="text-[10px] font-black text-cyan-500 italic tracking-tighter uppercase">
                    Institutional Elite Operating System
                </p>
            </div>
        </motion.div>
    );
}
