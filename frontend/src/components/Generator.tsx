"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ThreeDBrochure from '@/components/ThreeDBrochure';
import AIRefinerModal from '@/components/AIRefinerModal';
import NeuralLoading from '@/components/NeuralLoading';
import { AnimatePresence } from 'framer-motion';
import { API_URL } from '@/config';

type Step = 'input' | 'processing' | 'preview' | 'generating' | 'success';

interface BrochureData {
    headline: string;
    subheadline: string;
    about_us: string;
    features: string[];
    contact_info: string;
    testimonials?: string[];
}

export default function Generator() {
    const { user, refreshProfile, getToken } = useAuth();
    const [url, setUrl] = useState('');
    const [step, setStep] = useState<Step>('input');
    const [data, setData] = useState<BrochureData | null>(null);
    const [error, setError] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const [layoutTheme, setLayoutTheme] = useState('modern');

    // Refiner State
    const [refinerState, setRefinerState] = useState({ isOpen: false, text: '', fieldType: '' });

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const handleScrape = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStep('processing');
        setLogs(['Initializing scraper...', 'Navigating to URL...']);

        try {
            // Validate URL
            let targetUrl = url;
            if (!targetUrl.startsWith('http')) {
                targetUrl = 'https://' + targetUrl;
            }

            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/scrape/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url: targetUrl, layout_theme: layoutTheme })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Failed to scrape website');
            }

            addLog('Website scraped successfully.');
            addLog('Analyzing content with AI...');

            const result = await res.json();

            if (result.ai_content) {
                setData(result.ai_content);
                setStep('preview');
            } else {
                throw new Error('No AI content generated');
            }

        } catch (err: any) {
            setError(err.message);
            setStep('input');
        }
    };

    const handleGeneratePDF = async () => {
        if (!data || !user) return;

        setError('');
        setStep('generating');

        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/pdf/generate-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...data,
                    user_id: user.id,
                    layout_theme: layoutTheme
                })
            });

            if (!res.ok) {
                if (res.status === 402) {
                    throw new Error('Insufficient credits! Please upgrade your plan.');
                }
                const errData = await res.json();
                throw new Error(errData.detail || 'Failed to generate PDF');
            }

            // Download Blob
            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `brochure-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

            // Credits deducted, refresh UI
            await refreshProfile();
            setStep('success');

        } catch (err: any) {
            setError(err.message);
            setStep('preview'); // Go back to preview so they can try again
        }
    };

    // Update data fields
    const updateField = (field: keyof BrochureData, value: string | string[]) => {
        if (!data) return;
        setData({ ...data, [field]: value });
    };

    const updateFeature = (index: number, value: string) => {
        if (!data) return;
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData({ ...data, features: newFeatures });
    };

    const handleRefineApply = (refinedText: string, fieldType: string) => {
        if (!data) return;
        if (fieldType === 'feature') {
            // Need a smarter way to know WHICH feature if we support multiple, 
            // but for now, we'll assume the refiner modal returns the whole string to replace,
            // we will need to find which one it was or pass an index.
            // A quick fix for this demo is changing the fieldType to include the index or just matching.
            const index = data.features.findIndex(f => f === refinerState.text);
            if (index !== -1) {
                updateFeature(index, refinedText);
            }
        } else {
            updateField(fieldType as keyof BrochureData, refinedText);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-[var(--background)]/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-[var(--glass-border)] overflow-hidden transition-all duration-500 relative group">
            <div className="absolute inset-0 scanline opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>

            <AnimatePresence>
                {(step === 'processing' || step === 'generating') && (
                    <NeuralLoading />
                )}
            </AnimatePresence>

            {/* Refiner Modal */}
            <AIRefinerModal
                isOpen={refinerState.isOpen}
                initialText={refinerState.text}
                fieldType={refinerState.fieldType}
                onClose={() => setRefinerState({ ...refinerState, isOpen: false })}
                onApply={handleRefineApply}
            />

            {/* Header / Progress */}
            <div className="bg-[var(--foreground)]/5 p-8 border-b border-[var(--glass-border)] flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-black text-[var(--foreground)] italic tracking-tighter uppercase flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-sm font-black animate-pulse">
                            0{step === 'input' ? '1' : step === 'processing' ? '2' : step === 'preview' ? '3' : step === 'generating' ? '4' : '5'}
                        </span>
                        Neural Brochure Engine
                    </h2>
                    <p className="text-[9px] font-bold text-[var(--foreground)]/50 tracking-[0.3em] uppercase mt-2 ml-14">Protocol Version 4.8.2 // Active</p>
                </div>
                {step === 'preview' && (
                    <button onClick={() => setStep('input')} className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/80 hover:text-rose-500 transition-colors">
                        ABORT_SYNC
                    </button>
                )}
            </div>

            <div className="p-10">
                {error && (
                    <div className="mb-10 p-6 bg-fuchsia-900/20 border border-fuchsia-500/30 text-fuchsia-400 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div className="text-xs font-black uppercase tracking-widest">
                            {error}
                        </div>
                    </div>
                )}

                {/* STEP 1: INPUT */}
                {step === 'input' && (
                    <form onSubmit={handleScrape} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <div>
                            <label className="block text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.3em] mb-4 ml-1">
                                Remote Node URL
                            </label>
                            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                                <div className="flex-1 relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <span className="text-[var(--accent-primary)]/40 text-[10px] font-mono">HTTPS://</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="target-domain.io"
                                        className="w-full pl-24 pr-6 py-5 rounded-2xl bg-[var(--background)] border border-[var(--glass-border)] text-[var(--foreground)] font-mono text-xs focus:ring-1 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]/30 outline-none transition-all placeholder:text-[var(--foreground)]/50"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        value={layoutTheme}
                                        onChange={(e) => setLayoutTheme(e.target.value)}
                                        className="px-6 py-5 rounded-2xl bg-[var(--background)] border border-[var(--glass-border)] text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] outline-none focus:ring-1 focus:ring-[var(--foreground)]/30 transition-all cursor-pointer hover:border-[var(--foreground)]/20"
                                    >
                                        <option value="modern">Modern Matrix</option>
                                        <option value="classic">Classic Monolith</option>
                                        <option value="playful">Neon Pulse</option>
                                        <option value="holographic">Holographic Nexus</option>
                                    </select>
                                    <button
                                        type="submit"
                                        className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                    >
                                        Initialize
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[10px] text-[var(--foreground)]/80 font-black uppercase tracking-widest animate-pulse">
                                High-bandwidth scanning enabled
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/80">
                                Available Frequency: <span className="text-[var(--accent-primary)] ml-2">
                                    {user?.credits && user.credits > 10000 ? 'GOD_MODE' : (user?.credits || 0)}
                                </span>
                            </p>
                        </div>
                    </form>
                )}

                {/* STEP 2: PROCESSING */}
                {step === 'processing' && (
                    <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                        <div className="relative w-24 h-24 mb-10">
                            <div className="absolute inset-0 border-[3px] border-[var(--foreground)]/5 rounded-full"></div>
                            <div className="absolute inset-0 border-[3px] border-[var(--accent-primary)] rounded-full border-t-transparent animate-spin shadow-lg"></div>
                            <div className="absolute inset-4 border border-[var(--accent-secondary)]/30 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--foreground)] mb-4 italic tracking-tighter uppercase glitch-text">Neural Scraper Active</h3>
                        <div className="space-y-2">
                            {logs.map((log, i) => (
                                <p key={i} className="text-[10px] font-bold text-[var(--accent-primary)]/60 uppercase tracking-[0.3em] animate-in slide-in-from-bottom-2 fade-in italic">
                                    {`> ${log}`}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: PREVIEW / EDIT */}
                {step === 'preview' && data && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Visual Configuration</h3>
                                <p className="text-[10px] font-bold text-[var(--foreground)]/50 uppercase tracking-[0.2em] mt-1">Refine neural weights via direct manipulation.</p>
                            </div>
                            <span className="px-5 py-2 bg-[var(--accent-tertiary)]/10 border border-[var(--accent-tertiary)]/30 text-[var(--accent-tertiary)] text-[10px] font-black uppercase tracking-[0.3em] rounded-full backdrop-blur-md animate-pulse">
                                Provisional Node
                            </span>
                        </div>

                        <div className="w-full bg-[var(--background)] rounded-[2.5rem] overflow-hidden border border-[var(--glass-border)] mb-10 relative shadow-2xl group/preview">
                            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--background)] to-transparent z-10 pointer-events-none opacity-60"></div>
                            {/* 3D Preview Environment */}
                            <ThreeDBrochure
                                data={{
                                    ai_content: data,
                                    brand_logo: user?.brand_logo_url,
                                    primary_color: user?.brand_primary_color || '#00f3ff',
                                    secondary_color: user?.brand_secondary_color || '#ff00ff',
                                    brand_font: user?.brand_font || 'Outfit',
                                    bespoke_image: localStorage.getItem('bespoke_image_url') || undefined,
                                    layout_theme: layoutTheme
                                }}
                                onOpenRefiner={(text, fieldType) => {
                                    setRefinerState({ isOpen: true, text, fieldType });
                                }}
                            />
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--background)] to-transparent z-10 pointer-events-none opacity-60"></div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-[var(--glass-border)]">
                            <button
                                onClick={() => setStep('input')}
                                className="w-full sm:w-auto px-8 py-4 text-[var(--foreground)]/80 hover:text-[var(--foreground)] text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                            >
                                Back to Control
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                className="w-full sm:w-auto px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-4 group"
                            >
                                <svg className="w-7 h-7 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Compile PDF Asset
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: GENERATING */}
                {step === 'generating' && (
                    <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                        <div className="relative w-24 h-24 mb-10">
                            <div className="absolute inset-0 border-[3px] border-[var(--foreground)]/5 rounded-full"></div>
                            <div className="absolute inset-0 border-[3px] border-[var(--accent-secondary)] rounded-full border-t-transparent animate-spin shadow-lg"></div>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--foreground)] mb-4 italic uppercase tracking-tighter">Compiling Raster Data</h3>
                        <p className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-[0.4em] animate-pulse">Rendering 300DPI Neural Matrix...</p>
                    </div>
                )}

                {/* STEP 5: SUCCESS */}
                {step === 'success' && (
                    <div className="py-20 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-3xl border border-[var(--accent-primary)]/30 flex items-center justify-center mb-10 shadow-lg relative">
                            <div className="absolute inset-0 bg-[var(--accent-primary)]/20 blur-2xl rounded-full"></div>
                            <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-4xl font-black text-[var(--foreground)] mb-4 italic tracking-tighter uppercase glitch-text">Sync Complete</h3>
                        <p className="text-[var(--foreground)]/80 mb-12 max-w-sm text-sm font-medium leading-relaxed italic">
                            Asset successfully exported to your local file system. Protocol remains active for further generation.
                        </p>
                        <button
                            onClick={() => { setStep('input'); setUrl(''); setData(null); }}
                            className="px-12 py-5 bg-[var(--foreground)] text-[var(--background)] font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:opacity-90 hover:scale-105 transition-all shadow-lg"
                        >
                            Reset Protocol
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
