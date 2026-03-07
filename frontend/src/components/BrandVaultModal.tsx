"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Zap } from 'lucide-react';

interface BrandVaultModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BrandVaultModal({ isOpen, onClose }: BrandVaultModalProps) {
    const { user, refreshProfile, getToken } = useAuth();

    const [formData, setFormData] = useState({
        brand_logo_url: '',
        brand_primary_color: '#4F46E5',
        brand_secondary_color: '#EC4899',
        brand_font: 'Outfit',
        brand_voice_tone: 'Professional',
        brand_voice_calibration: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanUrl, setScanUrl] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                brand_logo_url: user.brand_logo_url || '',
                brand_primary_color: user.brand_primary_color || '#4F46E5',
                brand_secondary_color: user.brand_secondary_color || '#EC4899',
                brand_font: user.brand_font || 'Outfit',
                brand_voice_tone: user.brand_voice_tone || 'Professional',
                brand_voice_calibration: user.brand_voice_calibration || ''
            });
        }
    }, [user, isOpen]);

    const handleScanVoice = async () => {
        if (!scanUrl) return;
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
                body: JSON.stringify({ url: scanUrl })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.voice_profile) {
                    setFormData(prev => ({
                        ...prev,
                        brand_voice_calibration: result.voice_profile.calibration_snippet || prev.brand_voice_calibration
                    }));
                    setMessage({ type: 'success', text: 'Brand voice extracted successfully!' });
                }
            } else {
                const err = await response.json();
                setMessage({ type: 'error', text: err.detail || 'Voice extraction failed.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Scan failed. Check your network.' });
        } finally {
            setIsScanning(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = await getToken();
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiBase}/api/v1/profiles/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Brand Vault updated successfully!' });
                await refreshProfile();
                setTimeout(onClose, 1500);
            } else {
                setMessage({ type: 'error', text: 'Failed to update Brand Vault.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Connection error.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-black/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute inset-0 scanline opacity-10 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                    </span>
                                    Neural Vault
                                </h2>
                                <p className="text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase mt-2">Core Identity Configuration</p>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto">
                            {/* Logo Upload Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">Visual Signature</label>
                                <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 p-2 flex items-center justify-center shadow-2xl overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-fuchsia-500/5"></div>
                                        {formData.brand_logo_url ? (
                                            <img src={formData.brand_logo_url} alt="Logo Preview" className="max-w-full max-h-full object-contain relative z-10" />
                                        ) : (
                                            <div className="w-8 h-8 bg-white/5 rounded-full relative z-10" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="url"
                                            value={formData.brand_logo_url}
                                            onChange={(e) => setFormData({ ...formData, brand_logo_url: e.target.value })}
                                            placeholder="Sync identifier URL..."
                                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                                        />
                                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic">Use Alpha-Transparent Data Assets.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Brand Colors Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] pl-1">Primary Frequency</label>
                                    <div className="flex items-center gap-3 p-4 bg-black border border-white/10 rounded-2xl group hover:border-cyan-500/30 transition-colors">
                                        <input
                                            type="color"
                                            value={formData.brand_primary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={formData.brand_primary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                                            className="flex-1 bg-transparent border-none text-xs font-mono font-black text-white focus:ring-0 uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.2em] pl-1">Secondary Echo</label>
                                    <div className="flex items-center gap-3 p-4 bg-black border border-white/10 rounded-2xl group hover:border-fuchsia-500/30 transition-colors">
                                        <input
                                            type="color"
                                            value={formData.brand_secondary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={formData.brand_secondary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                                            className="flex-1 bg-transparent border-none text-xs font-mono font-black text-white focus:ring-0 uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Font & Voice Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">Typographical Matrix</label>
                                    <select
                                        value={formData.brand_font}
                                        onChange={(e) => setFormData({ ...formData, brand_font: e.target.value })}
                                        className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:ring-1 focus:ring-white/20 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Outfit">Outfit // Synth</option>
                                        <option value="Inter">Inter // Precision</option>
                                        <option value="Playfair Display">Playfair // High-Tier</option>
                                        <option value="Roboto">Roboto // Core</option>
                                        <option value="Montserrat">Montserrat // Geometric</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">Vocal Frequency</label>
                                    <select
                                        value={formData.brand_voice_tone}
                                        onChange={(e) => setFormData({ ...formData, brand_voice_tone: e.target.value })}
                                        className="w-full px-5 py-4 bg-black border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:ring-1 focus:ring-white/20 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Professional">Status: Professional</option>
                                        <option value="Friendly">Status: Accessible</option>
                                        <option value="Bold">Status: Aggressive</option>
                                        <option value="Luxury">Status: God-Tier</option>
                                        <option value="Technical">Status: Manual</option>
                                    </select>
                                </div>
                            </div>

                            {/* Voice Calibration Section */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">Neural Voice Profile</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="url"
                                            value={scanUrl}
                                            onChange={(e) => setScanUrl(e.target.value)}
                                            placeholder="https://your-site.com"
                                            className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-[10px] text-white/60 focus:ring-1 focus:ring-cyan-500/50 outline-none w-40"
                                        />
                                        <button
                                            onClick={handleScanVoice}
                                            disabled={isScanning || !scanUrl}
                                            className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all disabled:opacity-30"
                                        >
                                            {isScanning ? 'SCANNING...' : 'AUTO-SCAN'}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.brand_voice_calibration}
                                    onChange={(e) => setFormData({ ...formData, brand_voice_calibration: e.target.value })}
                                    placeholder="Describe your brand voice, audience, and key messaging pillars..."
                                    className="w-full h-32 px-5 py-4 bg-black border border-white/10 rounded-2xl text-xs text-white/70 placeholder:text-white/20 focus:ring-1 focus:ring-cyan-500/50 outline-none resize-none"
                                />
                                <p className="text-[9px] text-white/20 font-medium uppercase tracking-widest italic">Calibration data extracted via Neural Scan or manual input.</p>
                            </div>

                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20'}`}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-10 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-white hover:bg-cyan-400 active:scale-[0.98] disabled:opacity-50 text-black font-black text-[12px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3 group"
                            >
                                {isSaving ? <Loader2 size={20} className="animate-spin" /> : (
                                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                )}
                                {isSaving ? 'SYNCHRONIZING...' : 'UPDATE CORE IDENTITY'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
