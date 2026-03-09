"use client";
import { useState, useEffect, useRef } from 'react';
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
    FileText,
    Sparkles,
    ChevronRight,
    Search,
    Loader2,
    Code,
    Rocket,
    Workflow,
    Mail,
    Cloud,
    ExternalLink
} from 'lucide-react';
import EmbedModal from './EmbedModal';
import SocialPulseKit from './SocialPulseKit';
import { API_URL } from '@/config';

export default function GenerationStudio() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isCampaign, setIsCampaign] = useState(false);
    const [layoutTheme, setLayoutTheme] = useState('modern');
    const [tone, setTone] = useState('professional');
    const [editingField, setEditingField] = useState<{ name: string; value: string; index?: number } | null>(null);
    const [isRefiningAI, setIsRefiningAI] = useState(false);
    const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [isGeneratingVariant, setIsGeneratingVariant] = useState(false);
    const [emailExportLoading, setEmailExportLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
    const [systemLogs, setSystemLogs] = useState<{ id: number, msg: string, type: 'info' | 'warn' | 'success' }[]>([
        { id: Date.now(), msg: 'Neural core initialized', type: 'info' }
    ]);
    const [designResonance, setDesignResonance] = useState(88);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [socialCaptions, setSocialCaptions] = useState<{ platform: string, text: string }[] | null>(null);
    const [isSynthesizingSocial, setIsSynthesizingSocial] = useState(false);
    const [peers, setPeers] = useState<Record<string, { x: number, y: number, name: string }>>({});
    const socketRef = useRef<WebSocket | null>(null);

    const { isAuthenticated, user, deductCredit, currentPlan, getToken, refreshProfile } = useAuth();

    useEffect(() => {
        if (!user?.org_id) return;

        const connectWS = () => {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = API_URL.replace(/^https?:\/\//, '');
            const ws = new WebSocket(`${protocol}//${host}/api/v1/collaboration/ws/${user.org_id}`);

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'cursor') {
                    setPeers(prev => ({ ...prev, [msg.userId]: { x: msg.x, y: msg.y, name: msg.userName } }));
                } else if (msg.type === 'content_update') {
                    setData(msg.data);
                }
            };

            ws.onclose = () => {
                setTimeout(connectWS, 3000); // Reconnect after 3s
            };

            socketRef.current = ws;
        };

        connectWS();
        return () => socketRef.current?.close();
    }, [user?.org_id]);

    const broadcastChange = (newData: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'content_update',
                userId: user?.id,
                userName: user?.full_name || 'Team Member',
                data: newData
            }));
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'cursor',
                userId: user?.id,
                userName: user?.full_name || 'Team Member',
                x: e.clientX,
                y: e.clientY
            }));
        }
    };

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
            const res = await fetch(`${API_URL}/api/v1/scrape/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url, is_campaign: isCampaign, layout_theme: layoutTheme, tone }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Failed to scrape');

            setData(result);
            broadcastChange(result);
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Synthesis complete', type: 'success' }]);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Neural sync failure', type: 'warn' }]);
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
        broadcastChange(newData);
        setEditingField(null);
    };

    const handleExportPDF = async () => {
        if (!data?.ai_content) return;
        setExportLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/pdf/generate-pdf`, {
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

            // 1. Sync to Cloud Vault
            const res = await fetch(`${API_URL}/api/v1/brochures/`, {
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

            // 2. Update local state with the assigned share_uuid and id
            setData({ ...data, share_uuid: result.share_uuid, id: result.id });

            // 3. Optional: Refresh profile if credits were involved (done in backend)
            await refreshProfile();

        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLaunching(false);
        }
    };

    const handleGenerateVariant = async () => {
        if (!data?.id || isGeneratingVariant) return;
        setIsGeneratingVariant(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/brochures/${data.id}/generate-variant`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Failed to generate variant');

            alert('Neural Challenger Variant B has been synthesized and synchronized for A/B testing.');
            await refreshProfile();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsGeneratingVariant(false);
        }
    };

    const handleExportEmail = async () => {
        if (!data?.id || emailExportLoading) return;
        setEmailExportLoading(true);
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_URL}/api/v1/export/brochure/${data.id}/html`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `brochure-email-${data.share_uuid || data.id}.html`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setEmailExportLoading(false);
        }
    };

    const handleNeuralSync = async () => {
        if (!data?.id) return;
        setIsSyncing(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/export/brochure/${data.id}/deploy`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (res.ok) {
                setDeployedUrl(result.url);
                setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Edge deployment live', type: 'success' }]);
                alert(`Protocol Synchronized! Live at: ${result.url}`);
            } else {
                throw new Error(result.detail || 'Neural Sync Failed');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Cloud link severed', type: 'warn' }]);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleGlobalSync = async (lang: string) => {
        setIsTranslating(true);
        setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: `Orchestrating ${lang} sync...`, type: 'info' }]);

        // Mocking the neural translation orchestration
        setTimeout(() => {
            const translatedContent = { ...data.ai_content };
            if (lang === 'Japanese') {
                translatedContent.headline = "次世代のイノベーション";
                translatedContent.subheadline = "未来を今、体験してください。";
            } else if (lang === 'German') {
                translatedContent.headline = "Innovation der nächsten Generation";
                translatedContent.subheadline = "Erleben Sie die Zukunft noch heute.";
            } else {
                translatedContent.headline = "Innovación de Próxima Generación";
                translatedContent.subheadline = "Experimente el futuro hoy.";
            }

            setData({ ...data, ai_content: translatedContent });
            setDesignResonance(prev => Math.min(100, prev + 2));
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: `${lang} protocol unified`, type: 'success' }]);
            setIsTranslating(false);
        }, 1500);
    };

    const handleSocialSynthesis = async () => {
        setIsSynthesizingSocial(true);
        setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Social orchestration active...', type: 'info' }]);

        // Mocking the social synthesis
        setTimeout(() => {
            setSocialCaptions([
                { platform: 'LinkedIn', text: `🚀 Exciting news! We've just launched our new protocol: ${data.title}. Check it out here: [LINK]` },
                { platform: 'Instagram', text: `The future of ${data.ai_content.headline} is here. 🌌 #Innovation #BrochureGen` },
                { platform: 'X', text: `Deploying ${data.title}... Neural sync complete. 🛰️ #TechNoir` }
            ]);
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Social matrix ready', type: 'success' }]);
            setIsSynthesizingSocial(false);
        }, 2000);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24 relative"
        >
            {/* Remote Cursors */}
            <AnimatePresence>
                {Object.entries(peers).map(([id, peer]) => (
                    <motion.div
                        key={id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, x: peer.x, y: peer.y }}
                        exit={{ opacity: 0 }}
                        className="fixed pointer-events-none z-[100] flex flex-col items-center"
                        style={{ left: 0, top: 0 }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--accent-primary)] drop-shadow-lg">
                            <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="currentColor" stroke="white" />
                        </svg>
                        <div className="bg-[var(--accent-primary)] text-white text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap uppercase tracking-widest mt-1 shadow-lg">
                            {peer.name}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            {/* Studio Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-0">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Generation Studio</h1>
                    <p className="text-[var(--foreground)]/80 font-bold tracking-[0.3em] uppercase mt-2 text-[10px] sm:text-xs italic">
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

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.3em] ml-2">Source URL Identifier</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                        <Globe size={18} className="text-[var(--accent-primary)] group-focus-within:text-[var(--foreground)] transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://your-digital-asset.com"
                                        className="w-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-3xl py-4 sm:py-6 pl-14 sm:pl-16 pr-8 text-base sm:text-lg text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--glass-border)] space-y-4">
                                    <h4 className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-widest">Protocol Type</h4>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setIsCampaign(false)}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${!isCampaign ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-lg' : 'bg-transparent text-[var(--foreground)]/80 border-[var(--glass-border)]'}`}
                                        >
                                            Standard
                                        </button>
                                        <button
                                            onClick={() => setIsCampaign(true)}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isCampaign ? 'bg-[var(--accent-secondary)] text-white border-[var(--accent-secondary)] shadow-lg' : 'bg-transparent text-[var(--foreground)]/80 border-[var(--glass-border)]'}`}
                                        >
                                            Campaign
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--glass-border)] space-y-4">
                                    <h4 className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-widest">Matrix Theme</h4>
                                    <div className="relative">
                                        <select
                                            value={layoutTheme}
                                            onChange={(e) => {
                                                const newTheme = e.target.value;
                                                setLayoutTheme(newTheme);
                                                if (data) {
                                                    const newData = { ...data, layout_theme: newTheme };
                                                    setData(newData);
                                                    broadcastChange(newData);
                                                }
                                            }}
                                            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-[10px] text-[var(--foreground)] font-black uppercase tracking-widest appearance-none outline-none focus:ring-1 focus:ring-[var(--accent-primary)] shadow-sm"
                                        >
                                            <option value="modern">Modern // Clean</option>
                                            <option value="corporate">Corporate // High-Precision</option>
                                            <option value="minimalist">Minimalist // Zen</option>
                                            <option value="classic">Classic // High-Tier</option>
                                            <option value="playful">Playful // Vibrant</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--glass-border)] space-y-4">
                                <h4 className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-widest">AI Tone</h4>
                                <div className="relative">
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3 px-4 text-[10px] text-[var(--foreground)] font-black uppercase tracking-widest appearance-none outline-none focus:ring-1 focus:ring-[var(--accent-secondary)] shadow-sm"
                                    >
                                        <option value="professional">Professional // Polished</option>
                                        <option value="casual">Casual // Friendly</option>
                                        <option value="bold">Bold // Attention-Grabbing</option>
                                        <option value="luxury">Luxury // Aspirational</option>
                                        <option value="playful">Playful // Energetic</option>
                                        <option value="minimal">Minimal // Concise</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleScrape}
                                disabled={!url}
                                className="w-full bg-[var(--foreground)] hover:bg-[var(--accent-primary)] active:scale-[0.98] disabled:opacity-30 text-[var(--background)] hover:text-white font-black text-base sm:text-lg py-4 sm:py-6 rounded-3xl transition-all shadow-xl flex items-center justify-center space-x-4 group"
                            >
                                <Zap size={20} className="group-hover:rotate-12 transition-transform" />
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            <h3 className="text-xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Synthesis Complete</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setData(null)}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:text-[var(--foreground)] border border-[var(--glass-border)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                New Workspace
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={exportLoading}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:text-[var(--foreground)] border border-[var(--glass-border)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                {exportLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                                <span>PDF</span>
                            </button>

                            {!data.share_uuid ? (
                                <button
                                    onClick={handleLaunchProtocol}
                                    disabled={isLaunching}
                                    className="w-full sm:w-auto px-8 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-[var(--accent-primary)] hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isLaunching ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
                                    <span>Launch Protocol</span>
                                </button>
                            ) : (
                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => window.open(`/view/${data.share_uuid}`, '_blank')}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
                                    >
                                        <Share2 size={12} />
                                        <span>Shared View</span>
                                    </button>
                                    <button
                                        onClick={() => setIsEmbedModalOpen(true)}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-[var(--accent-secondary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                    >
                                        <Code size={12} />
                                        <span>Embed</span>
                                    </button>
                                    <button
                                        onClick={handleGenerateVariant}
                                        disabled={isGeneratingVariant}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-[var(--accent-tertiary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {isGeneratingVariant ? <Loader2 size={12} className="animate-spin" /> : <Workflow size={12} />}
                                        <span>AI Challenger</span>
                                    </button>
                                    <button
                                        onClick={handleExportEmail}
                                        disabled={emailExportLoading}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-[var(--accent-primary)] hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {emailExportLoading ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                                        <span>Email Matrix</span>
                                    </button>
                                    <button
                                        onClick={handleNeuralSync}
                                        disabled={isSyncing}
                                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                                    >
                                        {isSyncing ? <Loader2 size={12} className="animate-spin" /> : <Cloud size={12} />}
                                        <span>Neural Sync</span>
                                    </button>
                                    <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-xl w-full sm:w-auto justify-center">
                                        {['JP', 'DE', 'ES'].map(l => (
                                            <button
                                                key={l}
                                                onClick={() => handleGlobalSync(l === 'JP' ? 'Japanese' : l === 'DE' ? 'German' : 'Spanish')}
                                                disabled={isTranslating}
                                                className="w-8 h-8 rounded-lg hover:bg-white/10 text-[8px] font-black transition-all active:scale-90"
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                    {deployedUrl && (
                                        <button
                                            onClick={() => window.open(deployedUrl, '_blank')}
                                            className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all shadow-inner"
                                        >
                                            <ExternalLink size={12} />
                                        </button>
                                    )}
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
                                    onUpdate={handleApplyRefinedText}
                                    showHeatmap={showHeatmap}
                                />

                                {/* Heatmap Toggle */}
                                <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 flex flex-col gap-2">
                                    <button
                                        onClick={() => setShowHeatmap(!showHeatmap)}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest transition-all ${showHeatmap ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-white/5 border-white/10 text-white/40'}`}
                                    >
                                        Engagement Heatmap: {showHeatmap ? 'ON' : 'OFF'}
                                    </button>
                                    <button
                                        onClick={handleSocialSynthesis}
                                        disabled={isSynthesizingSocial}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest hover:bg-indigo-500/30 transition-all flex items-center gap-2"
                                    >
                                        <Share2 size={10} />
                                        Social Synthesis
                                    </button>
                                </div>

                                {/* Autonomous Diagnostic HUD */}
                                <div className="absolute top-4 sm:top-10 right-4 sm:right-10 p-4 sm:p-6 bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl w-48 sm:w-64 space-y-4 font-mono pointer-events-none z-10 transition-all">
                                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-white/40">Design Resonance</span>
                                        <span className="text-cyan-400">{designResonance}%</span>
                                    </div>
                                    <div className="h-0.5 bg-white/5 w-full rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: '80%' }}
                                            animate={{ width: `${designResonance}%` }}
                                            className="h-full bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-white/40">Neural Health</span>
                                        <span className="text-emerald-400">100% Operational</span>
                                    </div>
                                    {socialCaptions && (
                                        <div className="pt-4 border-t border-white/5 space-y-3">
                                            <span className="text-[8px] text-white/20 font-black uppercase">Social Synthesis</span>
                                            {socialCaptions.map((cap, i) => (
                                                <div key={i} className="space-y-1">
                                                    <span className="text-[7px] text-indigo-400 font-bold uppercase">{cap.platform}</span>
                                                    <p className="text-[8px] text-white/60 leading-tight line-clamp-2">{cap.text}</p>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setSocialCaptions(null)}
                                                className="w-full py-2 bg-white/5 hover:bg-white/10 text-[7px] text-white/40 font-black uppercase tracking-widest rounded-lg transition-all"
                                            >
                                                Clear Matrix
                                            </button>
                                        </div>
                                    )}
                                    <div className="h-0.5 bg-white/5 w-full rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="h-full bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <AnimatePresence>
                                            {systemLogs.map(log => (
                                                <motion.div
                                                    key={log.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="flex gap-2 items-start"
                                                >
                                                    <span className={`text-[8px] mt-1 ${log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-rose-400' : 'text-blue-400'}`}>▸</span>
                                                    <p className="text-[9px] leading-tight text-white/60 tracking-tight uppercase">{log.msg}</p>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="absolute bottom-10 left-10 p-4 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl flex items-center gap-4 shadow-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center">
                                        <Sparkles size={20} className="text-[var(--accent-primary)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-widest italic leading-none">Perspective</p>
                                        <p className="text-xs font-bold text-[var(--foreground)] tracking-tight mt-1">Spatial Matrix Rendering</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Creative Editor */}
                        <div className="space-y-6">
                            <div className="premium-card p-4 sm:p-8 border-[var(--glass-border)] space-y-10 bg-[var(--glass-bg)] transition-colors duration-500">
                                {/* Metadata Section */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 bg-[var(--foreground)]/5 rounded-xl border border-[var(--glass-border)]">
                                        <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-widest">Protocol ID</label>
                                        <p className="font-mono text-xs text-[var(--accent-primary)] mt-1">{data.share_uuid || 'UNINITIALIZED'}</p>
                                    </div>
                                    <div className="p-4 bg-[var(--foreground)]/5 rounded-xl border border-[var(--glass-border)]">
                                        <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-widest">Matrix Theme</label>
                                        <p className="font-mono text-xs text-[var(--accent-secondary)] mt-1 uppercase">{layoutTheme}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-3 text-[var(--foreground)]">
                                        <FileText size={20} className="text-[var(--accent-primary)]" />
                                        Content Matrix
                                    </h3>

                                    <div className="space-y-6">
                                        {[
                                            { id: 'headline', label: 'Primary Headline' },
                                            { id: 'subheadline', label: 'Sub-Protocol' },
                                            { id: 'about_us', label: 'Mission Data' },
                                            { id: 'contact_info', label: 'Comm Link' }
                                        ].map((field) => (
                                            <div key={field.id} className="group p-4 sm:p-6 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl hover:border-[var(--accent-primary)]/30 transition-all relative overflow-hidden">
                                                <div className="flex items-center justify-between mb-3 relative z-10">
                                                    <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-[0.2em]">{field.label}</label>
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

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-[0.2em] ml-2">Neural Features</label>
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

            {data && (
                <>
                    <EmbedModal
                        isOpen={isEmbedModalOpen}
                        onClose={() => setIsEmbedModalOpen(false)}
                        shareUuid={data.share_uuid || ''}
                    />

                    {(data.social_posts || data.ai_content?.social_posts) && (
                        <SocialPulseKit
                            posts={data.social_posts || data.ai_content?.social_posts}
                            brochureId={data.id}
                        />
                    )}
                </>
            )}
        </div>
    );
}
