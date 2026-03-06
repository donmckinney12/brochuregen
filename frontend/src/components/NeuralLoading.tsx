"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops: number[] = new Array(columns).fill(0);

        const draw = () => {
            ctx.fillStyle = document.documentElement.classList.contains('dark') ? "rgba(0, 0, 0, 0.05)" : "rgba(248, 250, 252, 0.05)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = document.documentElement.classList.contains('dark') ? "#0ff" : "#6366f1"; // Cyan for Dark, Indigo for Light
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-md transition-colors duration-500"
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-[0.2] dark:opacity-40" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 mb-8 relative">
                    <div className="absolute inset-0 border-4 border-[var(--accent-primary)]/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-4 border-[var(--accent-primary)] rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black italic text-[var(--accent-primary)]">BG</span>
                    </div>
                </div>

                <h2 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase mb-4 text-center">
                    Neural Sync <span className="gradient-text">In Progress</span>
                </h2>

                <div className="flex items-center gap-4 mb-2">
                    <div className="h-1 w-32 bg-[var(--foreground)]/5 rounded-full overflow-hidden border border-[var(--glass-border)]">
                        <motion.div
                            className="h-full bg-[var(--accent-primary)] shadow-lg"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>

                <p className="text-[10px] font-black text-[var(--accent-primary)]/60 uppercase tracking-[0.4em] animate-pulse">
                    Analyzing Cluster Nodes...
                </p>
            </div>

            <div className="absolute bottom-10 left-10 border-l border-[var(--accent-primary)]/50 pl-4 py-2">
                <p className="text-[8px] font-black text-[var(--accent-primary)]/40 uppercase tracking-widest leading-loose">
                    Matrix Status: Active<br />
                    Protocol: 0.5.4<br />
                    Secure Link Established
                </p>
            </div>
        </motion.div>
    );
}
