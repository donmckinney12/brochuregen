"use client";
import { useState } from 'react';
import Navbar from './Navbar';
import FeaturedTemplates from './FeaturedTemplates';
import HowItWorks from './HowItWorks';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';
import AccessModal from './AccessModal';

export default function Dashboard() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');

    const { isAuthenticated, user, deductCredit, currentPlan } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'guest' | 'limit'>('guest');

    const handleScrape = async () => {
        if (!url) return;

        // AUTH CHECK
        if (!isAuthenticated) {
            setModalMode('guest');
            setShowModal(true);
            return;
        }

        // CREDIT & RATE LIMIT CHECK (Handled by deductCredit logic, but pre-check for UX)
        if (currentPlan === 'free' && (user?.credits || 0) <= 0) {
            setModalMode('limit');
            setShowModal(true);
            return;
        }

        setLoading(true);
        setError('');
        setData(null);

        try {
            // Deduct Credit & Check Rate Limit
            if (currentPlan === 'free') {
                const result = await deductCredit('generate');
                if (!result.success) {
                    throw new Error(result.error);
                }
            }

            const res = await fetch('http://localhost:8002/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Failed to scrape');

            setData(result);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleRefine = async () => {
        const result = await deductCredit('refine');
        if (result.success) {
            alert("Refine successful! (Credit deducted)");
        } else {
            alert(result.error || "Failed to refine.");
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-300 ease-in-out font-sans bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900 dark:bg-slate-950 dark:text-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">

            <AccessModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                mode={modalMode}
            />

            <Navbar />

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-0">

                {/* User Stats & Brand Vault (Visible if logged in) */}
                {isAuthenticated && user && (
                    <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Generation Credits */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Generation Credits</h3>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{user?.credits}</span>
                                <span className="text-sm text-slate-500 mb-1">available</span>
                            </div>
                        </div>

                        {/* Refine Credits */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 dark:border-purple-900 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Refine Credits</h3>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{user?.refine_credits}</span>
                                <span className="text-sm text-slate-500 mb-1">available</span>
                            </div>
                        </div>

                        {/* Brand Vault Status */}
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-100 dark:border-amber-900 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Brand Vault</h3>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${user?.brand_vault?.active ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.brand_vault?.active ? 'Active' : 'Empty'}</span>
                                </div>
                            </div>
                            {user?.brand_vault?.active ? (
                                <div className="flex -space-x-2">
                                    {user?.brand_vault?.colors?.map((color: string, i: number) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800" style={{ backgroundColor: color }}></div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-xs text-slate-400">Upgrade to Pro</span>
                            )}
                        </div>
                    </div>
                )}

                <div className="max-w-3xl mx-auto text-center mb-16 animate-in slide-in-from-bottom-5 fade-in duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-800">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        AI-Powered Generation
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white leading-tight">
                        Turn any website into <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                            3-Fold Brochures & One-Pagers
                        </span>
                    </h1>

                    <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                        Instantly capture content, summarize key points, and generate print-ready PDFs using advanced AI — <span className="font-semibold text-blue-600 dark:text-blue-400">no design skills needed</span>.
                    </p>

                    <div className="relative max-w-2xl mx-auto group">
                        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-pink-600 opacity-20 blur-xl transition-all duration-500 ${url ? 'group-hover:opacity-40 group-hover:duration-200' : ''}`}></div>
                        <div className="relative flex items-center bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-600 rounded-2xl p-2 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 ring-1 ring-slate-900/5 dark:ring-white/10 transition-all hover:border-blue-500/50 dark:hover:border-blue-400/50 group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-500/20">
                            <div className="pl-4 text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            </div>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste website URL (e.g. https://stripe.com)"
                                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-4 text-lg text-slate-900 dark:text-white placeholder-slate-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                            />
                            <button
                                onClick={handleScrape}
                                disabled={loading || !url}
                                className={`relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 mx-1 drop-shadow-sm border border-white/20`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </span>
                                ) : 'Generate'}

                                {/* Loading Glow Effect */}
                                {loading && (
                                    <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                                )}
                            </button>
                        </div>

                        {/* Benefits Checklist */}
                        <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-2 delay-100">
                            {[
                                "No Design Skills Needed",
                                "Automated Brand Alignment",
                                "Print-Ready CMYK Exports"
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    {benefit}
                                </div>
                            ))}
                        </div>

                        {/* Social Proof */}
                        <div className="mt-8 flex items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-3 delay-200">
                            <div className="flex -space-x-2">
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="" />
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="" />
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64" alt="" />
                                <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">+2k</div>
                            </div>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-500">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Loved by 2,000+ businesses</span>
                            </div>
                        </div>
                    </div>
                </div>


                {!data && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
                        <FeaturedTemplates />
                        <HowItWorks />
                    </div>
                )}


                {error && (
                    <div className="max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-3">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {data && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                        {/* Scraped Content Card */}
                        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md p-0 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/50 dark:border-slate-700 overflow-hidden group hover:border-blue-500/30 transition-all">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Source Website</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Analyzed Content</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider">
                                    Active
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Page Title</label>
                                    <h3 className="text-xl font-medium text-slate-900 dark:text-white leading-snug">{data.title}</h3>
                                </div>

                                <div className="relative group/image overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-900">
                                    {data.screenshot ? (
                                        <img
                                            src={data.screenshot}
                                            alt="Site Screenshot"
                                            className="object-cover w-full h-auto transform transition-transform duration-700 group-hover/image:scale-105"
                                        />
                                    ) : (
                                        <div className="aspect-video flex items-center justify-center text-slate-400">
                                            <span className="flex flex-col items-center gap-2">
                                                <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                No preview available
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Brochure Preview Card */}
                        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md p-0 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/50 dark:border-slate-700 overflow-hidden flex flex-col h-full hover:border-purple-500/30 transition-all">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 6.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Generated Brochure</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Print-Ready PDF</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </button>
                            </div>

                            <div className="p-8 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/20 overflow-y-auto max-h-[500px]">
                                {data?.ai_content ? (
                                    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div>
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 block">Cover Headline</span>
                                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                                                {data.ai_content.headline}
                                            </h3>
                                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                                {data.ai_content.subheadline}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Key Features
                                            </h4>
                                            <ul className="space-y-2">
                                                {data.ai_content.features?.map((feature: string, i: number) => (
                                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wide">About Us</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {data.ai_content.about_us}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <button
                                                onClick={handleRefine}
                                                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                Refine with AI
                                            </button>
                                            <button className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-bold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                Export PDF
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mb-6 animate-pulse">
                                            <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Ready to Design</h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm">
                                            The AI is ready to transform the scraped text into a beautiful brochure layout.
                                        </p>
                                        <button className="mt-8 px-6 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-sm font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                            Generate Preview
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
