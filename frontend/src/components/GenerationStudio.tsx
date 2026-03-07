"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import NeuralLoading from './NeuralLoading';
import ThreeDBrochure from './ThreeDBrochure';
import FeaturedTemplates from './FeaturedTemplates';
import AIRefinerModal from './AIRefinerModal';
import {
    Zap,
    Share2,
    Download,
    Wand2,
    Globe,
    Type,
    FileText,
    Sparkles,
    ChevronRight,
    Search,
    Loader2,
    Code,
    Rocket
} from 'lucide-react';
import EmbedModal from './EmbedModal';
import SocialPulseKit from './SocialPulseKit';

export default function GenerationStudio() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isCampaign, setIsCampaign] = useState(false);
    const [layoutTheme, setLayoutTheme] = useState('modern');
    const [editingField, setEditingField] = useState<{ name: string; value: string; index?: number } | null>(null);
    const [isRefiningAI, setIsRefiningAI] = useState(false);
    const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

    const { isAuthenticated, user, deductCredit, currentPlan, getToken, refreshProfile } = useAuth();

    const handleScrape = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setData(null);

        try {
            if (currentPlan === 'free') {
                const result = await deductCredit('generate');
                if (!result.success) throw new Error(result.error);
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

    const handleOpenRefiner = (text: string, type: string, index?: number) => {
        setEditingField({ name: type, value: text, index });
    };

    const handleApplyRefinedText = (refinedText: string, fieldType: string) => {
        if (!data) return;

        const newData = { ...data };
        if (fieldType === 'features' && editingField?.index !== undefined) {
            newData.ai_content.features[editingField.index] = refinedText;
        } else {
            newData.ai_content[fieldType] = refinedText;
        }

        setData(newData);
        setEditingField(null);
    };

    const handleExportPDF = async () => {
        if (!data?.ai_content) return;
        setExportLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/pdf/generate-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    ...data.ai_content,
                    bespoke_image: data.bespoke_image,
                    user_id: user?.id,
                    share_url: data.share_uuid ? `${window.location.origin}/view/${data.share_uuid}` : null,
                    layout_theme: layoutTheme
                }),
            });
            if (!res.ok) throw new Error('Failed to generate PDF');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `brochure-${data.share_uuid || 'draft'}.pdf`;
            a.click();
        } catch (err) {
            alert('Failed to generate PDF');
        } finally {
            setExportLoading(false);
        }
    };

    const handleLaunchProtocol = async () => {
        if (!data || isLaunching) return;
        setIsLaunching(true);
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            // 1. Sync to Cloud Vault
            const res = await fetch(`${apiUrl}/api/v1/brochures/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: data.ai_content.headline,
                    url: url,
                    content: JSON.stringify(data.ai_content),
                    layout_theme: layoutTheme,
                    user_id: user?.id
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Launch failed');

            // 2. Update local state with the assigned share_uuid
            setData({ ...data, share_uuid: result.share_uuid });

            // 3. Optional: Refresh profile if credits were involved (done in backend)
            await refreshProfile();

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLaunching(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
            {/* Studio Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Generation Studio</h1>
                    <p className="text-[var(--foreground)]/40 font-bold tracking-[0.3em] uppercase mt-2 text-xs italic">
                        Initialize Neural Crawl & Creative Synthesis
                    </p>
                </div>
            </div>

            {/* Input Engine */}
            {!data && !loading && (
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="premium-card p-1 bg-gradient-to-r from-[var(--accent-primary)]/20 via-[var(--accent-secondary)]/20 to-[var(--accent-tertiary)]/20 rounded-[2.5rem]">
                        <div className="bg-[var(--glass-bg)] backdrop-blur-3xl rounded-[2.4rem] p-10 space-y-8 border border-[var(--glass-border)] relative overflow-hidden transition-colors duration-500">
                            <div className="absolute inset-0 scanline opacity-10 pointer-events-none"></div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.3em] ml-2">Source URL Identifier</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                        <Globe size={20} className="text-[var(--accent-primary)] group-focus-within:text-[var(--foreground)] transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://your-digital-asset.com"
                                        className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-3xl py-6 pl-16 pr-8 text-lg text-[var(--foreground)] placeholder:text-[var(--foreground)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--glass-border)] space-y-4">
                                    <h4 className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-widest">Protocol Type</h4>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setIsCampaign(false)}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${!isCampaign ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-lg' : 'bg-transparent text-[var(--foreground)]/40 border-[var(--glass-border)]'}`}
                                        >
                                            Standard
                                        </button>
                                        <button
                                            onClick={() => setIsCampaign(true)}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isCampaign ? 'bg-[var(--accent-secondary)] text-white border-[var(--accent-secondary)] shadow-lg' : 'bg-transparent text-[var(--foreground)]/40 border-[var(--glass-border)]'}`}
                                        >
                                            Campaign
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--glass-border)] space-y-4">
                                    <h4 className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-widest">Matrix Theme</h4>
                                    <div className="relative">
                                        <select
                                            value={layoutTheme}
                                            onChange={(e) => setLayoutTheme(e.target.value)}
                                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-[10px] text-[var(--foreground)] font-black uppercase tracking-widest appearance-none outline-none focus:ring-1 focus:ring-[var(--accent-primary)] shadow-sm"
                                        >
                                            <option value="modern">Modern // Clean</option>
                                            <option value="classic">Classic // High-Tier</option>
                                            <option value="playful">Playful // Vibrant</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleScrape}
                                disabled={!url}
                                className="w-full bg-[var(--foreground)] hover:bg-[var(--accent-primary)] active:scale-[0.98] disabled:opacity-30 text-[var(--background)] hover:text-white font-black text-lg py-6 rounded-3xl transition-all shadow-xl flex items-center justify-center space-x-4 group"
                            >
                                <Zap size={24} className="group-hover:rotate-12 transition-transform" />
                                <span className="uppercase tracking-[0.2em] italic">Initialize Synthesis</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Engine */}
            {loading && <NeuralLoading />}

            {/* Error Node */}
            {error && (
                <div className="max-w-2xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                    <p className="text-red-400 font-bold uppercase tracking-widest text-xs italic">{error}</p>
                </div>
            )}

            {/* Creative Canvas */}
            {data && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            <h3 className="text-xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Synthesis Complete</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setData(null)}
                                className="px-6 py-2.5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/60 hover:text-[var(--foreground)] border border-[var(--glass-border)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                New Workspace
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={exportLoading}
                                className="px-6 py-2.5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/60 hover:text-[var(--foreground)] border border-[var(--glass-border)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                            >
                                {exportLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                                <span>PDF</span>
                            </button>

                            {!data.share_uuid ? (
                                <button
                                    onClick={handleLaunchProtocol}
                                    disabled={isLaunching}
                                    className="px-8 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-[var(--accent-primary)] hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isLaunching ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
                                    <span>Launch Protocol</span>
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(`/view/${data.share_uuid}`, '_blank')}
                                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-emerald-600 transition-all"
                                    >
                                        <Share2 size={12} />
                                        <span>Shared View</span>
                                    </button>
                                    <button
                                        onClick={() => setIsEmbedModalOpen(true)}
                                        className="px-6 py-2.5 bg-[var(--accent-secondary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 hover:opacity-90 transition-all"
                                    >
                                        <Code size={12} />
                                        <span>Embed</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {/* 3D Preview Engine */}
                        <div className="premium-card p-1 border-[var(--glass-border)] bg-[var(--foreground)]/5 rounded-[3rem] sticky top-28 h-fit transition-colors duration-500">
                            <div className="bg-[var(--glass-bg)] backdrop-blur-3xl rounded-[2.9rem] p-4 h-[600px] relative overflow-hidden">
                                <ThreeDBrochure
                                    data={{ ...data, layout_theme: layoutTheme }}
                                    onOpenRefiner={handleOpenRefiner}
                                />
                                <div className="absolute bottom-10 left-10 p-4 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl flex items-center gap-4 shadow-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center">
                                        <Sparkles size={20} className="text-[var(--accent-primary)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-widest italic leading-none">Perspective</p>
                                        <p className="text-xs font-bold text-[var(--foreground)] tracking-tight mt-1">Spatial Matrix Rendering</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Creative Editor */}
                        <div className="space-y-6">
                            {/* Editor logic from original Dashboard goes here - but simplified for this refactor */}
                            <div className="premium-card p-8 border-[var(--glass-border)] space-y-10 bg-[var(--glass-bg)] transition-colors duration-500">
                                {/* Metadata Section */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 bg-[var(--foreground)]/5 rounded-xl border border-[var(--glass-border)]">
                                        <label className="text-[10px] font-black text-[var(--foreground)]/20 uppercase tracking-widest">Protocol ID</label>
                                        <p className="font-mono text-xs text-[var(--accent-primary)] mt-1">{data.share_uuid || 'UNINITIALIZED'}</p>
                                    </div>
                                    <div className="p-4 bg-[var(--foreground)]/5 rounded-xl border border-[var(--glass-border)]">
                                        <label className="text-[10px] font-black text-[var(--foreground)]/20 uppercase tracking-widest">Matrix Theme</label>
                                        <p className="font-mono text-xs text-[var(--accent-secondary)] mt-1 uppercase">{layoutTheme}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 text-[var(--foreground)]">
                                        <FileText size={20} className="text-[var(--accent-primary)]" />
                                        Content Matrix
                                    </h3>

                                    {/* Simplified field list for the workspace preview */}
                                    <div className="space-y-6">
                                        {[
                                            { id: 'headline', label: 'Primary Headline' },
                                            { id: 'subheadline', label: 'Sub-Protocol' },
                                            { id: 'about_us', label: 'Mission Data' },
                                            { id: 'contact_info', label: 'Comm Link' }
                                        ].map((field) => (
                                            <div key={field.id} className="group p-6 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl hover:border-[var(--accent-primary)]/30 transition-all relative overflow-hidden">
                                                <div className="flex items-center justify-between mb-3 relative z-10">
                                                    <label className="text-[10px] font-black text-[var(--foreground)]/30 uppercase tracking-[0.2em]">{field.label}</label>
                                                    <button
                                                        onClick={() => handleOpenRefiner(data.ai_content[field.id], field.id)}
                                                        className="p-2 bg-[var(--foreground)]/5 hover:bg-[var(--accent-primary)] hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Wand2 size={12} />
                                                    </button>
                                                </div>
                                                <p
                                                    onClick={() => handleOpenRefiner(data.ai_content[field.id], field.id)}
                                                    className="text-sm font-medium leading-relaxed group-hover:text-[var(--accent-primary)] transition-colors cursor-pointer text-[var(--foreground)] relative z-10"
                                                >
                                                    {data.ai_content[field.id]}
                                                </p>
                                            </div>
                                        ))}

                                        {/* Key Features Array */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-[var(--foreground)]/30 uppercase tracking-[0.2em] ml-2">Neural Features</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {data.ai_content.features?.map((feature: string, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="group p-4 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl hover:border-[var(--accent-secondary)]/30 transition-all flex items-center justify-between gap-4"
                                                    >
                                                        <p className="text-xs font-medium text-[var(--foreground)]/70">{feature}</p>
                                                        <button
                                                            onClick={() => handleOpenRefiner(feature, 'features', i)}
                                                            className="p-1.5 bg-[var(--foreground)]/5 hover:bg-[var(--accent-secondary)] hover:text-white rounded-md transition-all shrink-0"
                                                        >
                                                            <Wand2 size={10} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FeaturedTemplates />
                        </div>
                    </div>
                </div>
            )}

            <AIRefinerModal
                isOpen={!!editingField}
                initialText={editingField?.value || ''}
                fieldType={editingField?.name || ''}
                onClose={() => setEditingField(null)}
                onApply={handleApplyRefinedText}
            />

            <EmbedModal
                isOpen={isEmbedModalOpen}
                onClose={() => setIsEmbedModalOpen(false)}
                shareUuid={data.share_uuid || ''}
            />

            {(data.social_posts || data.ai_content?.social_posts) && (
                <SocialPulseKit posts={data.social_posts || data.ai_content?.social_posts} />
            )}
        </div>
    );
}


