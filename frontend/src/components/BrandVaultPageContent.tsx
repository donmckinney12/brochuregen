"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Palette, MessageSquare, Type, Zap, Check, Loader2, Sparkles } from 'lucide-react';
import VoiceTrainer from './VoiceTrainer';

export default function BrandVaultPageContent() {
    const { user, refreshProfile, getToken } = useAuth();

    const [formData, setFormData] = useState({
        brand_logo_url: '',
        brand_primary_color: '#4F46E5',
        brand_secondary_color: '#EC4899',
        brand_font: 'Outfit',
        brand_voice_tone: 'Professional',
        brand_voice_calibration: ''
    });

    const [vaultContext, setVaultContext] = useState<'personal' | 'organization'>('personal');
    const [orgBrand, setOrgBrand] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanUrl, setScanUrl] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchOrgBrand = async () => {
        if (!user?.org_id) return;
        try {
            const token = await getToken();
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiBase}/api/v1/profiles/organization/brand`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrgBrand(data);
            }
        } catch (error) {
            console.error("Failed to fetch org brand", error);
        }
    };

    useEffect(() => {
        if (user?.org_id) fetchOrgBrand();
    }, [user?.org_id]);

    useEffect(() => {
        const source = (vaultContext === 'organization' && orgBrand) ? orgBrand : user;
        if (source) {
            setFormData({
                brand_logo_url: source.brand_logo_url || '',
                brand_primary_color: source.brand_primary_color || '#4F46E5',
                brand_secondary_color: source.brand_secondary_color || '#EC4899',
                brand_font: source.brand_font || 'Outfit',
                brand_voice_tone: source.brand_voice_tone || 'Professional',
                brand_voice_calibration: source.brand_voice_calibration || ''
            });
        }
    }, [user, orgBrand, vaultContext]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = await getToken();
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const endpoint = vaultContext === 'organization'
                ? `${apiBase}/api/v1/profiles/organization/brand`
                : `${apiBase}/api/v1/profiles/me`;

            const method = vaultContext === 'organization' ? 'PUT' : 'PATCH';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: `${vaultContext === 'organization' ? 'Company' : 'Personal'} Vault updated!` });
                if (vaultContext === 'organization') {
                    await fetchOrgBrand();
                } else {
                    await refreshProfile();
                }
            } else {
                setMessage({ type: 'error', text: 'Failed to update Brand Vault.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection error.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleNeuralScan = async (url: string) => {
        setIsScanning(true);
        setMessage({ type: '', text: '' });

        try {
            const token = await getToken();
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiBase}/api/v1/scrape/extract-voice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ url })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success' && data.voice_profile) {
                    const profile = data.voice_profile;

                    const calibrationText = `TONE: ${profile.tone}

TARGET AUDIENCE: ${profile.target_audience}

MESSAGING PILLARS:
${profile.messaging_pillars?.map((p: string) => `- ${p}`).join('\n')}

CALIBRATION SNIPPET:
${profile.calibration_snippet}`;

                    setFormData({ ...formData, brand_voice_calibration: calibrationText });
                    setMessage({ type: 'success', text: 'Neural Voice extracted successfully. Push to Core to save.' });
                } else {
                    setMessage({ type: 'error', text: data.detail || 'Failed to extract voice profile.' });
                }
            } else {
                const errData = await response.json();
                setMessage({ type: 'error', text: errData.detail || 'Failed to connect to extraction node.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection error during scan.' });
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase"
                    >
                        Neural Brand Vault
                    </motion.h1>
                    <p className="text-[var(--foreground)]/80 font-bold tracking-[0.3em] uppercase mt-2 text-xs italic">
                        Configure Core Identity Matrix & Synchronization Parameters
                    </p>
                </div>

                {user?.org_id && (
                    <div className="flex bg-[var(--foreground)]/5 p-1 rounded-2xl border border-[var(--glass-border)]">
                        <button
                            onClick={() => setVaultContext('personal')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${vaultContext === 'personal'
                                ? 'bg-[var(--foreground)] text-[var(--background)] shadow-lg'
                                : 'text-[var(--foreground)]/80 hover:text-[var(--foreground)]'
                                }`}
                        >
                            Personal
                        </button>
                        <button
                            onClick={() => setVaultContext('organization')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${vaultContext === 'organization'
                                ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                                : 'text-[var(--foreground)]/80 hover:text-[var(--foreground)]'
                                }`}
                        >
                            Organization
                        </button>
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-3 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                    <span>{isSaving ? 'SYNCHRONIZING...' : 'Push to Core'}</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Identity Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Visual Signature Card */}
                    <div className="premium-card p-10 border-[var(--glass-border)] bg-[var(--background)]/40 backdrop-blur-xl">
                        <div className="flex items-center space-x-4 mb-10">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                <Palette size={24} />
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Visual Signature</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.2em] pl-1">Primary Asset Identifier</label>
                                <div className="flex items-center gap-6 p-6 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] group hover:border-[var(--foreground)]/10 transition-colors">
                                    <div className="w-20 h-20 rounded-2xl bg-[var(--background)] border border-[var(--glass-border)] p-2 flex items-center justify-center shadow-2xl relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5"></div>
                                        {formData.brand_logo_url ? (
                                            <img src={formData.brand_logo_url} alt="Logo" className="max-w-full max-h-full object-contain relative z-10" />
                                        ) : (
                                            <div className="w-8 h-8 bg-[var(--foreground)]/5 rounded-full relative z-10" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="url"
                                            value={formData.brand_logo_url}
                                            onChange={(e) => setFormData({ ...formData, brand_logo_url: e.target.value })}
                                            placeholder="https://assets.yoursite.com/logo.png"
                                            className="w-full bg-transparent border-none text-[var(--foreground)] font-mono text-xs focus:ring-0 outline-none placeholder:text-[var(--foreground)]/50"
                                        />
                                        <div className="h-[1px] w-full bg-[var(--foreground)]/10" />
                                        <p className="text-[9px] text-[var(--foreground)]/80 font-bold uppercase tracking-widest italic leading-tight">Sync High-Resolution Alpha Assets.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.2em] pl-1">Chromospheric Schema</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase text-[var(--accent-primary)]">Primary</span>
                                            <input
                                                type="color"
                                                value={formData.brand_primary_color}
                                                onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                                                className="w-4 h-4 bg-transparent border-none cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.brand_primary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                                            className="w-full bg-transparent border-none text-[var(--foreground)] font-mono text-[10px] font-black p-0 focus:ring-0 uppercase"
                                        />
                                    </div>
                                    <div className="p-4 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase text-[var(--accent-secondary)]">Secondary</span>
                                            <input
                                                type="color"
                                                value={formData.brand_secondary_color}
                                                onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                                                className="w-4 h-4 bg-transparent border-none cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.brand_secondary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                                            className="w-full bg-transparent border-none text-[var(--foreground)] font-mono text-[10px] font-black p-0 focus:ring-0 uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Neural Voice Card - Upgraded to Voice Trainer */}
                    <div className="premium-card p-10 border-[var(--glass-border)] bg-[var(--background)]/40 backdrop-blur-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Neural Voice Matrix</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.2em] pl-1">Vocal Amplitude</label>
                                <div className="relative group">
                                    <select
                                        value={formData.brand_voice_tone}
                                        onChange={(e) => setFormData({ ...formData, brand_voice_tone: e.target.value })}
                                        className="w-full px-6 py-5 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--foreground)] appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
                                    >
                                        <option value="Professional" className="bg-[var(--background)] text-[var(--foreground)]">SYSTEM_PROFESSIONAL</option>
                                        <option value="Friendly" className="bg-[var(--background)] text-[var(--foreground)]">SYSTEM_ACCESSIBLE</option>
                                        <option value="Bold" className="bg-[var(--background)] text-[var(--foreground)]">SYSTEM_AGGRESSIVE</option>
                                        <option value="Luxury" className="bg-[var(--background)] text-[var(--foreground)]">SYSTEM_GOD_TIER</option>
                                        <option value="Technical" className="bg-[var(--background)] text-[var(--foreground)]">SYSTEM_MANUAL</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Type size={14} className="text-[var(--foreground)]/80" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.2em] pl-1">Typographical Matrix</label>
                                <div className="relative group">
                                    <select
                                        value={formData.brand_font}
                                        onChange={(e) => setFormData({ ...formData, brand_font: e.target.value })}
                                        className="w-full px-6 py-5 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--foreground)] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                                    >
                                        <option value="Outfit" className="bg-[var(--background)] text-[var(--foreground)]">OUTFIT // SYNTH_1</option>
                                        <option value="Inter" className="bg-[var(--background)] text-[var(--foreground)]">INTER // PRECISION</option>
                                        <option value="Playfair Display" className="bg-[var(--background)] text-[var(--foreground)]">PLAYFAIR // LUX_CORE</option>
                                        <option value="Roboto" className="bg-[var(--background)] text-[var(--foreground)]">ROBOTO // CORE_01</option>
                                        <option value="Montserrat" className="bg-[var(--background)] text-[var(--foreground)]">MONTSERRAT // GEOMETRIC</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Type size={14} className="text-[var(--foreground)]/80" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <VoiceTrainer
                            initialCalibration={formData.brand_voice_calibration}
                            isScanning={isScanning}
                            onScan={handleNeuralScan}
                            onSave={(val) => setFormData({ ...formData, brand_voice_calibration: val })}
                        />
                    </div>
                </div>

                {/* Info / Tips Column */}
                <div className="space-y-8">
                    {/* Sync Status Card */}
                    <div className="premium-card p-8 border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/10 rounded-full blur-3xl -z-10" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)] mb-6">Synchronization Status</h4>

                        <div className="space-y-6">
                            {[
                                { name: 'Visual ID', status: user?.brand_logo_url ? 'Active' : 'Missing' },
                                { name: 'Neural Voice', status: user?.brand_voice_calibration ? 'Calibrated' : 'Offline' },
                                { name: 'Color Echoes', status: 'Synchronized' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[var(--foreground)]/80">{item.name}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' || item.status === 'Calibrated' || item.status === 'Synchronized' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-red-400'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${item.status === 'Active' || item.status === 'Calibrated' || item.status === 'Synchronized' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Tip Card */}
                    <div className="premium-card p-8 border-purple-500/20 bg-purple-500/5 transition-colors duration-500">
                        <div className="flex items-center space-x-3 mb-6">
                            <MessageSquare size={16} className="text-purple-400" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Pro Tip</h4>
                        </div>
                        <p className="text-xs text-[var(--foreground)]/50 leading-relaxed font-medium">
                            Use the <span className="text-[var(--foreground)] font-bold italic">Neural Auto-Scan</span> to automatically extract tone, vocabulary, and mission statement directly from your target URL. This ensures your brochures feel like an organic extension of your digital footprint.
                        </p>
                    </div>

                    {/* Feedback Messages */}
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border flex items-center space-x-4 ${message.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}
                        >
                            {message.type === 'success' ? <Check size={18} /> : <Zap size={18} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
