"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import NeuralLoading from './ContentLoading';
import ThreeDBrochure from './ThreeDBrochure';
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
    ExternalLink,
    Cpu,
    Activity,
    Shield,
    Database,
    ZapOff,
    Monitor,
    Palette
} from 'lucide-react';
import EmbedModal from './EmbedModal';
import FulfillmentModal from './FulfillmentModal';
import StrategyWidget from './StrategyWidget';
import SocialPulseKit from './SocialEngagementKit';
import LanguageSelector from './LanguageSelector';
import { API_URL } from '@/config';

export default function GenerationStudio() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const [layoutTheme, setLayoutTheme] = useState('modern');
    const [tone, setTone] = useState('professional');
    const [editingField, setEditingField] = useState<{ name: string; value: string; index?: number } | null>(null);
    const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [isGeneratingVariant, setIsGeneratingVariant] = useState(false);
    const [emailExportLoading, setEmailExportLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
    const [systemLogs, setSystemLogs] = useState<{ id: number, msg: string, type: 'info' | 'warn' | 'success' }[]>([
        { id: Date.now(), msg: 'Platform online', type: 'info' }
    ]);
    const [designScore, setDesignScore] = useState(92);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [socialCaptions, setSocialCaptions] = useState<{ platform: string, text: string }[] | null>(null);
    const [isSynthesizingSocial, setIsSynthesizingSocial] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
    const [peers, setPeers] = useState<Record<string, { x: number, y: number, name: string }>>({});
    const socketRef = useRef<WebSocket | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const templateParam = searchParams.get('template');
        if (templateParam) {
            const theme = templateParam.toLowerCase().includes('minimal') ? 'minimalist'
                : templateParam.toLowerCase().includes('institutional') ? 'corporate'
                    : templateParam.toLowerCase().includes('launch') ? 'modern'
                        : 'classic';
            setLayoutTheme(theme);
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: `Template: ${templateParam} loaded`, type: 'info' }]);
        }
    }, [searchParams]);

    const { user, deductCredit, currentPlan, getToken, refreshProfile } = useAuth();

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
            ws.onclose = () => setTimeout(connectWS, 3000);
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
                userName: user?.full_name || 'Project Member',
                data: newData
            }));
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'cursor',
                userId: user?.id,
                userName: user?.full_name || 'Project Member',
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ url, is_campaign: false, layout_theme: layoutTheme, tone }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Generation failed');
            setData(result);
            broadcastChange(result);
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Generation complete', type: 'success' }]);
        } catch (err: any) {
            setError(err.message || 'Service communication failure');
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Connection failed', type: 'warn' }]);
        } finally {
            setLoading(false);
        }
    };

    const fetchQRCode = async (shareUuid: string) => {
        try {
            const res = await fetch(`${API_URL}/api/v1/qr/generate/${shareUuid}`);
            if (res.ok) {
                const blob = await res.blob();
                setQrCodeUrl(URL.createObjectURL(blob));
            }
        } catch (err) {
            console.error('Failed to fetch QR code:', err);
        }
    };

    useEffect(() => {
        if (data?.share_uuid) {
            fetchQRCode(data.share_uuid);
        } else {
            setQrCodeUrl(null);
        }
    }, [data?.share_uuid]);

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
            if (!res.ok) throw new Error('PDF service offline');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `brochure-${data.share_uuid || 'draft'}.pdf`;
            a.click();
        } catch (err) {
            alert('PDF Generation Failure');
        } finally {
            setExportLoading(false);
        }
    };

    const handlePublishBrochure = async () => {
        if (!data || isLaunching) return;
        setIsLaunching(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/brochures/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    title: data.ai_content.headline,
                    url: url,
                    content: JSON.stringify(data.ai_content),
                    layout_theme: layoutTheme,
                    user_id: user?.id
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.detail || 'Publishing failed');
            setData({ ...data, share_uuid: result.share_uuid, id: result.id });
            await refreshProfile();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsLaunching(false);
        }
    };

    const handlePublishWebsite = async () => {
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
                setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Website is live', type: 'success' }]);
                alert(`Website published at: ${result.url}`);
            } else {
                throw new Error(result.detail || 'Publishing failed');
            }
        } catch (err: any) {
            setError(err.message);
            setSystemLogs(prev => [...prev.slice(-4), { id: Date.now(), msg: 'Storage connection lost', type: 'warn' }]);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div onMouseMove={handleMouseMove} className="min-h-screen space-y-12 pb-24 relative overflow-x-hidden">
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
                        <div className="bg-[var(--foreground)]/90 backdrop-blur-md text-[var(--background)] text-[9px] font-black px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-[0.2em] mt-2 border border-[var(--glass-border)] shadow-2xl">
                            {peer.name}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/60">Dashboard</span>
                    </div>
                    <h1 className="text-5xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-none">Brochure Creator</h1>
                    <p className="text-[var(--foreground)]/70 font-bold tracking-[0.3em] uppercase mt-4 text-xs italic">
                        Generate. Edit. Deploy.
                    </p>
                </div>
            </div>

            {/* Input Hub */}
            {!data && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto px-6"
                >
                    <div className="relative group">
                        {/* High-Intensity Glow Shell */}
                        <div className="absolute inset-x-[-8px] inset-y-[-8px] bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] rounded-[3.5rem] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />

                        <div className="relative bg-[var(--glass-bg)] border border-[var(--accent-primary)]/20 rounded-[3rem] p-12 space-y-12 backdrop-blur-3xl shadow-[0_0_100px_rgba(var(--accent-primary-rgb),0.1)] overflow-hidden">
                            {/* Inner Decorative Gradients */}
                            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[var(--accent-primary)]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[var(--accent-secondary)]/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                                        Import <span className="gradient-text">Website Content</span>
                                    </h3>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Extract assets from any URL to build your brochure.</p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.3)]">
                                    <Globe size={28} className="animate-pulse" />
                                </div>
                            </div>

                            <div className="relative z-10">
                                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                                    <Cpu size={24} className="text-[var(--accent-primary)]" />
                                </div>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="ENTER WEBSITE URL..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-8 pl-20 pr-12 text-xl font-black uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/50 focus:bg-white/[0.05] transition-all duration-700 shadow-inner"
                                />
                                {/* Progress Bar Animation */}
                                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] w-full rounded-full opacity-0 group-focus-within:opacity-100 animate-pulse pointer-events-none" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                {[
                                    { icon: Workflow, label: 'Mode', value: 'Standard' },
                                    { icon: Palette, label: 'Theme', value: layoutTheme, onChange: setLayoutTheme, options: ['modern', 'corporate', 'minimalist', 'classic'] },
                                    { icon: Activity, label: 'Tone', value: tone, onChange: setTone, options: ['professional', 'luxury', 'bold', 'minimal'] }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-[var(--accent-primary)]/30 hover:bg-white/[0.04] transition-all duration-500 group/item">
                                        <div className="flex items-center gap-3">
                                            <item.icon size={16} className="text-white/30 group-hover/item:text-[var(--accent-primary)] transition-colors" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover/item:text-white/50 transition-colors">{item.label}</span>
                                        </div>
                                        {item.options ? (
                                            <select
                                                value={item.value}
                                                onChange={(e) => item.onChange?.(e.target.value)}
                                                className="w-full bg-transparent text-white font-black uppercase tracking-widest text-[11px] outline-none cursor-pointer"
                                            >
                                                {item.options.map(opt => <option key={opt} value={opt} className="bg-[#02040a]">{opt}</option>)}
                                            </select>
                                        ) : (
                                            <div className="text-white font-black uppercase tracking-widest text-[11px]">{item.value}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleScrape}
                                disabled={!url}
                                className="w-full group relative overflow-hidden bg-white text-black font-black text-xl py-8 rounded-[2.5rem] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] opacity-90 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 uppercase tracking-[0.5em] italic text-white drop-shadow-lg">Generate Brochure</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Loading State */}
            {loading && <NeuralLoading />}

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-2xl mx-auto p-1 rounded-3xl bg-gradient-to-r from-red-500/20 to-transparent"
                    >
                        <div className="bg-[var(--background)]/90 p-8 rounded-[1.4rem] border border-red-500/20 flex flex-col items-center text-center gap-6 shadow-2xl">
                            <ZapOff size={32} className="text-red-500 animate-bounce" />
                            <div>
                                <h4 className="text-lg font-black uppercase text-[var(--foreground)] italic tracking-tighter mb-2">Generation error</h4>
                                <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">{error}</p>
                            </div>
                                <button
                                    onClick={() => setError('')}
                                    className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Dismiss
                                </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editor Workspace */}
            {data && (
                <div className="px-6 space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                    {/* Main Controls */}
                    <div className="sticky top-28 z-40 bg-[var(--background)]/60 backdrop-blur-3xl border border-[var(--glass-border)] p-4 rounded-[2.5rem] shadow-2xl flex flex-wrap items-center justify-between gap-6 px-10">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Current Project</span>
                            </div>
                            <div className="h-6 w-[1px] bg-[var(--foreground)]/10" />
                            <h3 className="text-lg font-black text-[var(--foreground)] italic tracking-tighter uppercase truncate max-w-[200px] sm:max-w-md">{data.ai_content.headline}</h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setData(null)}
                                className="px-6 py-3 bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 text-[var(--foreground)]/60 hover:text-[var(--foreground)] rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={exportLoading}
                                className="px-6 py-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)] rounded-2xl text-[9px] font-black uppercase tracking-widest border border-[var(--glass-border)] flex items-center gap-2 transition-all"
                            >
                                {exportLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                                <span>Download PDF</span>
                            </button>

                            {data.share_uuid ? (
                                <div className="flex items-center gap-2">
                                    <div className="group relative">
                                        <button className="p-3 bg-[var(--foreground)]/5 text-[var(--foreground)]/60 rounded-2xl border border-[var(--glass-border)] hover:bg-[var(--foreground)]/10 transition-all flex items-center gap-2">
                                            <Code size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Digital Copy</span>
                                        </button>
                                        <div className="absolute top-14 right-0 z-50 p-6 bg-[var(--background)]/90 backdrop-blur-3xl border border-[var(--glass-border)] rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all w-64 text-center space-y-4 translate-y-2 group-hover:translate-y-0">
                                            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-inner p-2 border border-black/5">
                                                {qrCodeUrl ? (
                                                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Loader2 className="animate-spin text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Interactive Digital Link</p>
                                                <p className="text-[8px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Scan for Real-time Digital Version</p>
                                            </div>
                                            <a 
                                                href={qrCodeUrl || '#'} 
                                                download={`qr-${data.share_uuid}.png`}
                                                className="block w-full py-3 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
                                            >
                                                Download PNG
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => setIsFulfillmentOpen(true)}
                                        className="px-6 py-3 bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-[var(--accent-primary)]/20 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.1)]"
                                    >
                                        <Monitor size={14} />
                                        Direct-to-Print
                                    </button>

                                    <button
                                        onClick={handlePublishWebsite}
                                        disabled={isSyncing}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                                    >
                                        {isSyncing ? <Loader2 size={12} className="animate-spin" /> : <Cloud size={12} />}
                                        <span>Publish Website</span>
                                    </button>
                                    <button
                                        onClick={() => window.open(`/view/${data.share_uuid}`, '_blank')}
                                        className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                                    >
                                        <ExternalLink size={14} />
                                    </button>

                                    <div className="h-6 w-[1px] bg-[var(--foreground)]/10 mx-2" />
                                    
                                    <LanguageSelector 
                                        brochureId={data.id} 
                                        onTranslated={(newContent) => {
                                            setData({ ...data, ai_content: newContent });
                                            broadcastChange({ ...data, ai_content: newContent });
                                        }} 
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={handlePublishBrochure}
                                    disabled={isLaunching}
                                    className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-xl flex items-center gap-2"
                                >
                                    {isLaunching ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
                                    <span>Publish Brochure</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Preview Section */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[var(--accent-primary)]/5 blur-[100px] rounded-full opacity-30 pointer-events-none" />
                            <div className="relative premium-card p-1 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-[3rem]">
                                <div className="bg-[var(--glass-bg)] backdrop-blur-3xl rounded-[2.9rem] p-4 h-[700px] relative overflow-hidden transition-colors border border-[var(--glass-border)]">
                                    <ThreeDBrochure
                                        data={{ ...data, layout_theme: layoutTheme }}
                                        onOpenRefiner={handleOpenRefiner}
                                        onUpdate={handleApplyRefinedText}
                                        showHeatmap={showHeatmap}
                                    />

                                    {/* Status Dashboard */}
                                    <div className="absolute top-10 left-10 p-6 bg-[var(--background)]/40 backdrop-blur-2xl border border-[var(--glass-border)] rounded-3xl w-72 space-y-6 pointer-events-none z-10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Activity size={14} className="text-[var(--accent-primary)]" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/60">Design Score</span>
                                            </div>
                                            <span className="text-xs font-black text-[var(--foreground)] italic">{designScore}%</span>
                                        </div>
                                        <div className="h-1 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ width: `${designScore}%` }}
                                                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/20">Platform Online</span>
                                            <div className="space-y-2">
                                                {systemLogs.map(log => (
                                                    <div key={log.id} className="flex gap-2 items-center">
                                                        <div className={`w-1 h-1 rounded-full ${log.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                                                        <p className="text-[9px] font-bold text-[var(--foreground)]/60 uppercase tracking-tighter">{log.msg}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Heatmap Matrix Toggle */}
                                    <div className="absolute bottom-10 left-10 flex gap-4 pointer-events-auto">
                                        <button
                                            onClick={() => setShowHeatmap(!showHeatmap)}
                                            className={`px-6 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${showHeatmap ? 'bg-orange-500 text-black border-orange-500 shadow-lg' : 'bg-[var(--background)]/50 backdrop-blur-xl border-[var(--glass-border)] text-[var(--foreground)]/40 hover:border-[var(--glass-border-hover)]'}`}
                                        >
                                            View Analytics
                                        </button>
                                        <button
                                            onClick={() => setIsEmbedModalOpen(true)}
                                            className="px-6 py-2.5 bg-[var(--background)]/50 backdrop-blur-xl border border-[var(--glass-border)] text-[var(--foreground)]/60 hover:text-[var(--foreground)] rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Copy Embed Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div className="space-y-8">
                            <StrategyWidget brochureContent={data.ai_content} />
                            
                            <div className="bg-[var(--glass-bg)] backdrop-blur-3xl border border-[var(--glass-border)] rounded-[3rem] p-10 space-y-12 transition-colors">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Content Editor</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/40">Status: Verified</span>
                                        <div className="px-3 py-1 bg-[var(--foreground)]/10 rounded-lg font-mono text-[9px] text-[var(--accent-primary)] uppercase">v3.0.2</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { id: 'headline', label: 'Primary Headline', icon: Zap },
                                        { id: 'subheadline', label: 'Subheadline', icon: Activity },
                                        { id: 'about_us', label: 'Company Overview', icon: Shield },
                                        { id: 'contact_info', label: 'Contact Details', icon: Database }
                                    ].map((field) => (
                                        <motion.div
                                            key={field.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="group relative bg-[var(--foreground)]/[0.02] border border-[var(--glass-border)] rounded-3xl p-8 hover:border-[var(--accent-primary)]/50 transition-all cursor-pointer shadow-sm"
                                            onClick={() => handleOpenRefiner(data.ai_content[field.id], field.id)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <field.icon size={14} className="text-[var(--foreground)]/40 group-hover:text-[var(--accent-primary)] transition-colors" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/50">{field.label}</span>
                                                </div>
                                                <Wand2 size={14} className="text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <p className="text-sm font-bold text-[var(--foreground)]/80 leading-relaxed group-hover:text-[var(--foreground)] transition-colors">{data.ai_content[field.id]}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="space-y-6 pt-6 border-t border-[var(--glass-border)]">
                                    <div className="flex items-center gap-3">
                                        <Monitor size={16} className="text-[var(--foreground)]/40" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/50">Key Features</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {data.ai_content.features?.map((feature: string, i: number) => (
                                            <div key={i} className="flex items-center gap-4 bg-[var(--foreground)]/[0.02] border border-[var(--glass-border)] p-5 rounded-2xl group hover:border-[var(--glass-border-hover)] transition-all">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)]/40 group-hover:bg-[var(--accent-secondary)] transition-colors" />
                                                <p className="flex-1 text-xs font-bold text-[var(--foreground)]/70 group-hover:text-[var(--foreground)] transition-colors uppercase tracking-tight">{feature}</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenRefiner(feature, 'features', i); }}
                                                    className="p-2 hover:bg-[var(--foreground)]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Wand2 size={12} className="text-[var(--accent-secondary)]" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {data && (
                <AIRefinerModal
                    isOpen={!!editingField}
                    initialText={editingField?.value || ''}
                    fieldType={editingField?.name || ''}
                    onClose={() => setEditingField(null)}
                    onApply={handleApplyRefinedText}
                />
            )}

            {data && (
                <>
                    <EmbedModal
                        isOpen={isEmbedModalOpen}
                        onClose={() => setIsEmbedModalOpen(false)}
                        shareUuid={data.share_uuid || ''}
                    />
                    {socialCaptions && <SocialPulseKit posts={socialCaptions} brochureId={data.id} />}
                    <FulfillmentModal
                        isOpen={isFulfillmentOpen}
                        onClose={() => setIsFulfillmentOpen(false)}
                        brochureId={data.id}
                        brochureTitle={data.ai_content.headline}
                    />
                </>
            )}
        </div>
    );
}
