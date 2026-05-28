"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Globe, Loader2, Sparkles, Wand2, CheckCircle2 } from 'lucide-react';

export default function LiveDemo() {
    const [step, setStep] = useState(0); // 0: Idle, 1: Typing, 2: Loading, 3: Done
    const [typedUrl, setTypedUrl] = useState('');
    const targetUrl = 'stripe.com';

    // Sequence Orchestration
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const runSequence = async () => {
            // Reset
            setStep(0);
            setTypedUrl('');
            await new Promise(r => setTimeout(r, 1000));

            // Type URL
            setStep(1);
            for (let i = 0; i <= targetUrl.length; i++) {
                setTypedUrl(targetUrl.slice(0, i));
                await new Promise(r => setTimeout(r, 100 + Math.random() * 50));
            }
            await new Promise(r => setTimeout(r, 500));

            // Start Loading
            setStep(2);
            await new Promise(r => setTimeout(r, 4500));

            // Show Result
            setStep(3);
            await new Promise(r => setTimeout(r, 6000)); // Hold result for 6s
            
            // Loop
            runSequence();
        };

        // Start sequence when component mounts
        runSequence();

        return () => clearTimeout(timeout);
    }, []);

    const terminalLogs = [
        "[SYS] Initializing remote browser connection...",
        "[SYS] Target acquired: https://stripe.com",
        "[NET] Bypassing anti-bot protocols... OK",
        "[AI] Extracting core brand color palette...",
        "[AI] Parsing structural DOM for semantic value...",
        "[AI] Synthesizing high-conversion copy...",
        "[GPU] Rendering 3D spatial layout...",
        "[SYS] Assembly complete. Ready for deployment."
    ];

    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

    useEffect(() => {
        if (step === 2) {
            let logIndex = 0;
            setVisibleLogs([]);
            const interval = setInterval(() => {
                if (logIndex < terminalLogs.length) {
                    setVisibleLogs(prev => [...prev, terminalLogs[logIndex]]);
                    logIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        } else if (step === 0 || step === 1) {
            setVisibleLogs([]);
        }
    }, [step]);

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-secondary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-secondary)]"></span>
                        </span>
                        <span className="text-[var(--accent-secondary)] font-black uppercase tracking-[0.2em] text-[10px]">Live Infrastructure Demo</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-[var(--foreground)] uppercase italic tracking-tighter">
                        See The <span className="gradient-text">Engine</span> Work
                    </h2>
                </div>

                <div className="relative aspect-[16/10] md:aspect-video w-full rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden premium-card p-4 sm:p-8 flex flex-col items-center justify-center">
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-30 pointer-events-none" />

                    <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
                        {/* URL Input Mock */}
                        <motion.div 
                            animate={{ 
                                y: step === 3 ? -100 : 0,
                                opacity: step === 3 ? 0 : 1,
                                scale: step === 3 ? 0.9 : 1 
                            }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative flex items-center bg-black/50 border border-white/20 rounded-2xl p-4 shadow-[0_0_30px_rgba(99,102,241,0.1)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 to-transparent opacity-50" />
                            <Globe className="text-white/40 mr-4 relative z-10" size={24} />
                            <div className="flex-1 text-xl sm:text-2xl font-bold text-white font-mono relative z-10 flex items-center">
                                {typedUrl}
                                {(step === 1 || step === 0) && (
                                    <motion.div 
                                        animate={{ opacity: [1, 0] }} 
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="w-1 h-6 bg-[var(--accent-primary)] ml-1" 
                                    />
                                )}
                            </div>
                            <button 
                                className={`relative z-10 ml-4 px-6 py-2 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                                    step >= 2 ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-white/40'
                                }`}
                            >
                                {step >= 2 ? 'Generating...' : 'Generate'}
                            </button>
                        </motion.div>

                        {/* Terminal / Loading State */}
                        <AnimatePresence>
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 font-mono text-xs sm:text-sm text-green-400 space-y-2 shadow-inner overflow-hidden text-left"
                                >
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                        <Terminal size={14} className="text-white/40" />
                                        <span className="text-white/40 font-bold uppercase tracking-widest">Aether_Core Execution Log</span>
                                        <Loader2 size={14} className="ml-auto text-[var(--accent-primary)] animate-spin" />
                                    </div>
                                    {visibleLogs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            {log}
                                        </motion.div>
                                    ))}
                                    <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>_</motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Result Presentation */}
                    <AnimatePresence>
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent-primary-rgb),0.2),transparent_60%)]" />
                                
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-[2rem] blur-[40px] opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
                                    
                                    <div className="relative bg-white p-2 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <img 
                                            src="/brochure_hero.png" 
                                            alt="Generated Brochure" 
                                            className="w-[200px] sm:w-[300px] h-auto rounded-xl border border-black/5"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/20">
                                            <CheckCircle2 size={14} className="text-green-400" />
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Synthesis Complete</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
