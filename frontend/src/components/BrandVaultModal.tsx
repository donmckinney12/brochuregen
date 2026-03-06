"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

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
        brand_voice_tone: 'Professional'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                brand_logo_url: user.brand_logo_url || '',
                brand_primary_color: user.brand_primary_color || '#4F46E5',
                brand_secondary_color: user.brand_secondary_color || '#EC4899',
                brand_font: user.brand_font || 'Outfit',
                brand_voice_tone: user.brand_voice_tone || 'Professional'
            });
        }
    }, [user, isOpen]);

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
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                    </span>
                                    Brand Vault
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure your global brand identity</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Logo URL */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Logo URL</label>
                                <input
                                    type="url"
                                    value={formData.brand_logo_url}
                                    onChange={(e) => setFormData({ ...formData, brand_logo_url: e.target.value })}
                                    placeholder="https://yourbrand.com/logo.png"
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Primary Color */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Primary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={formData.brand_primary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                                        />
                                        <input
                                            type="text"
                                            value={formData.brand_primary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_primary_color: e.target.value })}
                                            className="flex-1 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Secondary Color */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Secondary Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={formData.brand_secondary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                                        />
                                        <input
                                            type="text"
                                            value={formData.brand_secondary_color}
                                            onChange={(e) => setFormData({ ...formData, brand_secondary_color: e.target.value })}
                                            className="flex-1 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Font Selection */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Primary Font</label>
                                <select
                                    value={formData.brand_font}
                                    onChange={(e) => setFormData({ ...formData, brand_font: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white"
                                >
                                    <option value="Outfit">Outfit (Recommended)</option>
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Playfair Display">Playfair Display (Serif)</option>
                                </select>
                            </div>

                            {/* Voice & Tone */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Brand Voice</label>
                                <select
                                    value={formData.brand_voice_tone}
                                    onChange={(e) => setFormData({ ...formData, brand_voice_tone: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white"
                                >
                                    <option value="Professional">Professional & Trustworthy</option>
                                    <option value="Friendly">Friendly & Approachable</option>
                                    <option value="Creative">Creative & Bold</option>
                                    <option value="Minimalist">Minimalist & Clean</option>
                                </select>
                            </div>

                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-3 rounded-xl text-sm font-medium text-center ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}
                                >
                                    {message.text}
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                )}
                                {isSaving ? 'Saving Changes...' : 'Save Brand Settings'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
