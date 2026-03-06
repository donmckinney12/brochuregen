"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from './Navbar';
import FeaturedTemplates from './FeaturedTemplates';
import HowItWorks from './HowItWorks';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';
import AccessModal from './AccessModal';
import BrandVaultModal from './BrandVaultModal';
import InsightsDashboard from './InsightsDashboard';

export default function Dashboard() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [activeTab, setActiveTab] = useState<'studio' | 'insights'>('studio');
    const [isCampaign, setIsCampaign] = useState(false);
    const [layoutTheme, setLayoutTheme] = useState('modern');

    const { isAuthenticated, user, deductCredit, currentPlan, getToken, refreshProfile } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'guest' | 'limit'>('guest');
    const [showBrandVault, setShowBrandVault] = useState(false);

    const handleScrape = async () => {
        // ... logic remains the same ...
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

            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/scrape/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url, is_campaign: isCampaign, layout_theme: layoutTheme }),
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

    const handleExportPDF = async () => {
        if (!data || !data.ai_content) return;

        setExportLoading(true);
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/pdf/generate-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...data.ai_content,
                    bespoke_image: data.bespoke_image,
                    user_id: user?.id
                }),
            });

            if (!res.ok) throw new Error('Failed to generate PDF');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'brochure.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            alert('Failed to generate PDF');
        } finally {
            setExportLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!data?.ai_content || !user) return;

        setIsGeneratingImage(true);
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/image/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: data.ai_content.headline,
                    user_id: user.id
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Failed to generate image');

            setData((prev: any) => ({
                ...prev,
                bespoke_image: result.image_url
            }));

            // Refresh profile to show updated credits
            await refreshProfile();

        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Failed to generate image');
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleTranslate = async (targetLanguage: string) => {
        if (!data?.id || !user) return;

        try {
            const result = await deductCredit('refine');
            if (!result.success) {
                alert(result.error);
                return;
            }

            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            // Show a temporary loading state specifically for translation if needed, 
            // but for now we'll just use a generic or rely on the UI updating upon return.
            const res = await fetch(`${apiUrl}/api/v1/brochures/${data.id}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ target_language: targetLanguage }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Translation failed');
            }

            const updatedBrochure = await res.json();

            // Update the local data state
            setData({
                ...data,
                ai_content: updatedBrochure.content ? JSON.parse(updatedBrochure.content) : data.ai_content,
                ai_content_socials: updatedBrochure.social_posts ? JSON.parse(updatedBrochure.social_posts) : data.ai_content?.social_posts,
                ai_content_emails: updatedBrochure.email_sequence ? JSON.parse(updatedBrochure.email_sequence) : data.ai_content?.email_sequence,
            });

            // Note: because the original struct is slightly different in API vs response, we sync it
            if (updatedBrochure.content) {
                let newAi = JSON.parse(updatedBrochure.content);
                if (updatedBrochure.social_posts) newAi.social_posts = JSON.parse(updatedBrochure.social_posts);
                if (updatedBrochure.email_sequence) newAi.email_sequence = JSON.parse(updatedBrochure.email_sequence);
                setData({ ...data, ai_content: newAi, title: updatedBrochure.title });
            }

            alert(`Successfully translated to ${targetLanguage}!`);
            await refreshProfile();

        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Translation error');
        }
    };

    const handleUpgrade = async () => {
        if (!user) return;

        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/v1/payment/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.id,
                    email: user.email,
                    plan: 'pro'
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Payment Error Status:", res.status, errorText);
                alert(`Error ${res.status}: ${errorText || 'Failed to initiate checkout'}`);
                return;
            }

            const result = await res.json();
            console.log("Stripe Session Result:", result);
            if (result.url) {
                window.location.href = result.url;
            } else {
                alert(`Failed to initiate checkout: No URL returned`);
            }
        } catch (e) {
            console.error(e);
            alert("Error communicating with payment server");
        }
    };

    return (
        <div className="min-h-screen font-sans bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500">
            <AccessModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                mode={modalMode}
                onUpgrade={handleUpgrade}
            />

            <BrandVaultModal
                isOpen={showBrandVault}
                onClose={() => setShowBrandVault(false)}
            />

            <Navbar />

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-0">

                {/* User Stats & Brand Vault (Visible if logged in) */}
                <AnimatePresence>
                    {isAuthenticated && user && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-12"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* Generation Credits */}
                                <div className="premium-card p-6 border-blue-100/50 dark:border-blue-900/50">
                                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Generation Credits</h3>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-extrabold gradient-text">{user?.credits}</span>
                                        <span className="text-sm text-slate-500 mb-1">available</span>
                                    </div>
                                </div>

                                {/* Refine Credits */}
                                <div className="premium-card p-6 border-purple-100/50 dark:border-purple-900/50">
                                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Refine Credits</h3>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-extrabold gradient-text bg-gradient-to-r from-purple-600 to-pink-600">{user?.refine_credits}</span>
                                        <span className="text-sm text-slate-500 mb-1">available</span>
                                    </div>
                                </div>

                                {/* Brand Vault Status */}
                                <div
                                    onClick={() => {
                                        if (user?.plan === 'pro' || user?.plan === 'agency') {
                                            setShowBrandVault(true);
                                        } else {
                                            setModalMode('limit');
                                            setShowModal(true);
                                        }
                                    }}
                                    className="premium-card p-6 border-amber-100/50 dark:border-amber-900/50 flex items-center justify-between cursor-pointer group hover:shadow-amber-500/10 transition-all"
                                >
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Brand Vault</h3>
                                        <div className="flex items-center gap-2">
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className={`w-2 h-2 rounded-full ${user?.plan !== 'free' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}
                                            ></motion.span>
                                            <span className="font-bold text-slate-900 dark:text-white">{user?.plan !== 'free' ? 'Active' : 'Locked'}</span>
                                        </div>
                                    </div>
                                    {user?.plan !== 'free' ? (
                                        <div className="flex -space-x-2">
                                            {user?.brand_primary_color && (
                                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundColor: user.brand_primary_color }}></div>
                                            )}
                                            {user?.brand_secondary_color && (
                                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundColor: user.brand_secondary_color }}></div>
                                            )}
                                            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                                                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href="/pricing" className="text-[10px] font-bold py-1 px-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded uppercase tracking-tighter hover:scale-105 transition-transform">
                                            Upgrade
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Tab Switcher */}
                            <div className="flex justify-center mb-12">
                                <div className="inline-flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <button
                                        onClick={() => setActiveTab('studio')}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'studio'
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        Generation Studio
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('insights')}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'insights'
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                                        Insights
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeTab === 'insights' ? (
                    <InsightsDashboard />
                ) : (
                    <>
                        <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold mb-8 border border-blue-100 dark:border-blue-800 backdrop-blur-md"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                AI STUDIO
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                            >
                                Transform any site into <br className="hidden md:block" />
                                <span className="gradient-text">
                                    Premium Collateral
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto"
                            >
                                Professional 3-fold brochures and one-pagers generated in seconds. <span className="text-slate-900 dark:text-white font-semibold">Brand-accurate & print-ready.</span>
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="relative max-w-2xl mx-auto group"
                            >
                                <div className="flex justify-center mb-6">
                                    <label className="relative inline-flex items-center cursor-pointer group/toggle">
                                        <input type="checkbox" value="" className="sr-only peer" checked={isCampaign} onChange={(e) => setIsCampaign(e.target.checked)} />
                                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 shadow-inner"></div>
                                        <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            Advanced Campaign Mode <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-[10px] uppercase tracking-widest">(3 Credits)</span>
                                        </span>
                                    </label>
                                </div>
                                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 blur-2xl group-focus-within:opacity-20 transition-all duration-700"></div>
                                <div className="relative flex flex-col sm:flex-row items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl shadow-blue-500/10 dark:shadow-black/50 ring-1 ring-slate-900/5 dark:ring-white/5 transition-all focus-within:ring-4 focus-within:ring-blue-500/20">
                                    <div className="hidden sm:flex pl-4 text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                    </div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Enter website URL..."
                                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-4 text-lg text-slate-900 dark:text-white placeholder-slate-500 w-full min-w-0"
                                        onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                                    />
                                    <div className="px-2 border-r border-slate-200 dark:border-slate-700 hidden md:block">
                                        <select
                                            value={layoutTheme}
                                            onChange={(e) => setLayoutTheme(e.target.value)}
                                            className="bg-transparent border-none text-sm font-bold text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer"
                                        >
                                            <option value="modern">Modern Theme</option>
                                            <option value="classic">Classic Theme</option>
                                            <option value="playful">Playful Theme</option>
                                        </select>
                                    </div>
                                    <div className="flex w-full sm:w-auto p-1 gap-2">
                                        <button
                                            onClick={handleScrape}
                                            disabled={loading || !url}
                                            className="relative flex-1 sm:flex-none overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Generating...
                                                </span>
                                            ) : 'Generate'}
                                        </button>
                                        {isAuthenticated && (
                                            <Link
                                                href="/dashboard"
                                                className="sm:flex items-center justify-center p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                                                title="Go to Dashboard"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Benefits Checklist */}
                        <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-8 mb-20 animate-in fade-in slide-in-from-bottom-2 delay-100">
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

                        {/* Error State */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-3xl mx-auto mb-12"
                            >
                                <div className="p-4 bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-3 backdrop-blur-md">
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    <span className="font-medium">{error}</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Results Section */}
                        <AnimatePresence>
                            {data && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-8"
                                >
                                    {/* Primary Grid for Site & Brochure */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Scraped Content Card */}
                                        <div className="premium-card p-0 overflow-hidden group">
                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
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
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Detected Title</label>
                                                    <h3 className="text-xl font-medium text-slate-900 dark:text-white leading-snug">{data.title}</h3>
                                                </div>

                                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video flex items-center justify-center">
                                                    {data.screenshot ? (
                                                        <img src={data.screenshot} alt="Site Screenshot" className="object-cover w-full h-full" />
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">No preview available</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Brochure Preview Card */}
                                        <div className="premium-card p-0 overflow-hidden flex flex-col h-full border-purple-500/20">
                                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 6.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Generated Brochure</h2>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">AI Lab Output</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/20 overflow-y-auto max-h-[500px]">
                                                {data?.ai_content ? (
                                                    <div className="space-y-6 text-left">
                                                        <div>
                                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 block">Headline</span>
                                                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">{data.ai_content.headline}</h3>
                                                            <p className="text-lg text-slate-600 dark:text-slate-300">{data.ai_content.subheadline}</p>
                                                        </div>

                                                        {/* AI Image Placeholder/Result */}
                                                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center group/ai">
                                                            {data.bespoke_image ? (
                                                                <img src={data.bespoke_image} alt="Bespoke AI Image" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="text-center p-6">
                                                                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center mx-auto mb-3 text-purple-500">
                                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                                    </div>
                                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Image Lab</p>
                                                                    <button
                                                                        onClick={handleGenerateImage}
                                                                        disabled={isGeneratingImage}
                                                                        className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                                                                    >
                                                                        {isGeneratingImage ? 'Generating...' : 'Create Bespoke Hero (5 Credits)'}
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {data.bespoke_image && (
                                                                <button
                                                                    onClick={handleGenerateImage}
                                                                    disabled={isGeneratingImage}
                                                                    className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg shadow-lg opacity-0 group-hover/ai:opacity-100 transition-opacity"
                                                                    title="Regenerate Image"
                                                                >
                                                                    <svg className={`w-4 h-4 text-purple-600 ${isGeneratingImage ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                Key Features
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {data.ai_content.features?.slice(0, 3).map((f: string, i: number) => (
                                                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                                                                        {f}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <button onClick={handleRefine} className="flex-1 px-4 py-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-bold hover:bg-purple-200 transition-colors">Refine</button>
                                                            <button onClick={handleExportPDF} disabled={exportLoading} className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
                                                                {exportLoading ? '...' : 'Export PDF'}
                                                            </button>
                                                            {data.share_uuid && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        const btn = e.currentTarget;
                                                                        navigator.clipboard.writeText(`${window.location.origin}/view/${data.share_uuid}`);
                                                                        const originalText = btn.innerText;
                                                                        btn.innerText = 'Copied!';
                                                                        setTimeout(() => btn.innerText = originalText, 2000);
                                                                    }}
                                                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                                >
                                                                    Share Link
                                                                </button>
                                                            )}
                                                            <div className="flex-1 relative group/lang">
                                                                <select
                                                                    className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                                    onChange={(e) => {
                                                                        if (e.target.value) {
                                                                            handleTranslate(e.target.value);
                                                                            e.target.value = ''; // Reset select
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="" disabled selected>Translate (1 Credit)</option>
                                                                    <option value="Spanish">Spanish</option>
                                                                    <option value="French">French</option>
                                                                    <option value="German">German</option>
                                                                    <option value="Italian">Italian</option>
                                                                    <option value="Portuguese">Portuguese</option>
                                                                    <option value="Japanese">Japanese</option>
                                                                    <option value="Korean">Korean</option>
                                                                    <option value="Chinese (Mandarin)">Chinese</option>
                                                                    <option value="Hindi">Hindi</option>
                                                                    <option value="Arabic">Arabic</option>
                                                                </select>
                                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                                        <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 mb-4 animate-pulse"></div>
                                                        <p className="text-sm">Waiting for generation...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div> {/* END OF PRIMARY GRID DIV */}

                                    {/* Campaign Extras (Socials & Emails) */}
                                    {data.is_campaign && data.ai_content.social_posts && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                                            {/* Social Media Vault */}
                                            <div className="premium-card p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50">
                                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Social Media Kit</h3>
                                                </div>
                                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                                    {data.ai_content.social_posts.map((post: string, i: number) => {
                                                        const shareUrl = data.share_uuid ? `${window.location.origin}/view/${data.share_uuid}` : '';
                                                        const encodedText = encodeURIComponent(post);
                                                        const encodedUrl = encodeURIComponent(shareUrl);
                                                        const twitterIntent = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                                                        const linkedinIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

                                                        return (
                                                            <div key={i} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl relative group/post shadow-sm hover:shadow-md transition-all pr-12 min-h-[100px]">
                                                                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{post}</p>
                                                                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover/post:opacity-100 transition-opacity w-12">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            navigator.clipboard.writeText(post);
                                                                            e.currentTarget.innerText = "✓";
                                                                            setTimeout(() => e.currentTarget.innerText = "Copy", 1500);
                                                                        }}
                                                                        className="px-1 py-1 bg-slate-100 dark:bg-slate-700 text-[9px] font-bold uppercase rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 w-full text-center"
                                                                        title="Copy to Clipboard"
                                                                    >
                                                                        Copy
                                                                    </button>
                                                                    {shareUrl && (
                                                                        <>
                                                                            <a href={twitterIntent} target="_blank" rel="noopener noreferrer" className="px-1 py-1 bg-[#1DA1F2]/10 text-[#1DA1F2] text-[9px] font-bold uppercase rounded hover:bg-[#1DA1F2]/20 text-center w-full block" title="Share to X">
                                                                                X
                                                                            </a>
                                                                            <a href={linkedinIntent} target="_blank" rel="noopener noreferrer" className="px-1 py-1 bg-[#0A66C2]/10 text-[#0A66C2] text-[9px] font-bold uppercase rounded hover:bg-[#0A66C2]/20 text-center w-full block" title="Share to LinkedIn">
                                                                                in
                                                                            </a>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Email Drip Sequence */}
                                            <div className="premium-card p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50">
                                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Email Drip Sequence</h3>
                                                </div>
                                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                                    {data.ai_content.email_sequence.map((email: any, i: number) => (
                                                        <div key={i} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl relative group/email shadow-sm hover:shadow-md transition-all">
                                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subject: {email.subject}</div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{email.body}</p>
                                                            <button
                                                                onClick={(e) => {
                                                                    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
                                                                    e.currentTarget.innerText = "✓";
                                                                    setTimeout(() => e.currentTarget.innerText = "Copy", 1500);
                                                                }}
                                                                className="absolute top-2 right-2 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-[10px] font-bold uppercase rounded opacity-0 group-hover/email:opacity-100 transition-opacity text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!data && !loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="mt-20"
                            >
                                <FeaturedTemplates />
                                <HowItWorks />
                            </motion.div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
