"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ThreeDBrochure from '@/components/ThreeDBrochure';
import AIRefinerModal from '@/components/AIRefinerModal';

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/scrape/scrape`, {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/pdf/generate-pdf`, {
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
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 relative">

            {/* Refiner Modal */}
            <AIRefinerModal
                isOpen={refinerState.isOpen}
                initialText={refinerState.text}
                fieldType={refinerState.fieldType}
                onClose={() => setRefinerState({ ...refinerState, isOpen: false })}
                onApply={handleRefineApply}
            />

            {/* Header / Progress */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm">
                        {step === 'input' ? '1' : step === 'processing' ? '2' : step === 'preview' ? '3' : step === 'generating' ? '4' : '✓'}
                    </span>
                    Brochure Generator
                </h2>
                {step === 'preview' && (
                    <button onClick={() => setStep('input')} className="text-sm text-slate-500 hover:text-red-500">
                        Cancel
                    </button>
                )}
            </div>

            <div className="p-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                {/* STEP 1: INPUT */}
                {step === 'input' && (
                    <form onSubmit={handleScrape} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Website URL to Convert
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="example.com"
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full min-w-0"
                                required
                            />
                            <div className="flex gap-3">
                                <select
                                    value={layoutTheme}
                                    onChange={(e) => setLayoutTheme(e.target.value)}
                                    className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                                >
                                    <option value="modern">Modern Theme</option>
                                    <option value="classic">Classic Theme</option>
                                    <option value="playful">Playful Theme</option>
                                </select>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 animate-in fade-in">
                            Credits available: <span className="font-bold text-slate-800 dark:text-slate-200">
                                {user?.credits && user.credits > 10000 ? 'Unlimited' : (user?.credits || 0)}
                            </span>
                        </p>
                    </form>
                )}

                {/* STEP 2: PROCESSING */}
                {step === 'processing' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                        <div className="relative w-16 h-16 mb-6">
                            <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analyzing Website...</h3>
                        <div className="space-y-1">
                            {logs.map((log, i) => (
                                <p key={i} className="text-sm text-slate-500 dark:text-slate-400 animate-in slide-in-from-bottom-2 fade-in">
                                    {log}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: PREVIEW / EDIT */}
                {step === 'preview' && data && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Review Presentation</h3>
                                <p className="text-sm text-slate-500">Interact with your 3D brochure. Click elements to refine with AI.</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                Draft
                            </span>
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-950/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-8 relative">
                            {/* 3D Preview Environment */}
                            <ThreeDBrochure
                                data={{
                                    ai_content: data,
                                    brand_logo: user?.brand_logo_url,
                                    primary_color: user?.brand_primary_color || '#4F46E5',
                                    secondary_color: user?.brand_secondary_color || '#EC4899',
                                    brand_font: user?.brand_font || 'Outfit',
                                    bespoke_image: localStorage.getItem('bespoke_image_url') || undefined,
                                    layout_theme: layoutTheme
                                }}
                                onOpenRefiner={(text, fieldType) => {
                                    setRefinerState({ isOpen: true, text, fieldType });
                                }}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setStep('input')}
                                className="px-5 py-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Download PDF (1 Credit)
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: GENERATING */}
                {step === 'generating' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                        <div className="relative w-16 h-16 mb-6">
                            <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Generating PDF...</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Rendering high-quality graphics. This may take a moment.</p>
                    </div>
                )}

                {/* STEP 5: SUCCESS */}
                {step === 'success' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Brochure Ready!</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
                            Your download should have started automatically. You can also find it in your downloads folder.
                        </p>
                        <button
                            onClick={() => { setStep('input'); setUrl(''); setData(null); }}
                            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-all"
                        >
                            Create Another
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
