"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Loader2, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const LANGUAGES = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
];

interface LanguageSelectorProps {
    brochureId: number;
    onTranslated?: (translatedContent: Record<string, unknown>) => void;
}

export default function LanguageSelector({ brochureId, onTranslated }: LanguageSelectorProps) {
    const { getToken } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [selectedLang, setSelectedLang] = useState<string | null>(null);
    const [translatedLang, setTranslatedLang] = useState<string | null>(null);

    const handleTranslate = async (langCode: string) => {
        setSelectedLang(langCode);
        setIsTranslating(true);
        setIsOpen(false);

        try {
            const token = await getToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/brochures/${brochureId}/translate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ target_language: langCode }),
                }
            );

            if (res.ok) {
                const data = await res.json();
                setTranslatedLang(langCode);
                onTranslated?.(data);
            }
        } catch (err) {
            console.error('Translation error:', err);
        } finally {
            setIsTranslating(false);
        }
    };

    const selectedLanguage = LANGUAGES.find(l => l.code === selectedLang);

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isTranslating}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--foreground)]/5 border border-[var(--glass-border)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--foreground)]/10 transition-all disabled:opacity-50"
            >
                {isTranslating ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : translatedLang ? (
                    <Check size={14} className="text-emerald-400" />
                ) : (
                    <Globe size={14} />
                )}
                {selectedLanguage ? `${selectedLanguage.flag} ${selectedLanguage.name}` : 'Translate'}
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-3 border-b border-[var(--glass-border)]">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Select Language</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleTranslate(lang.code)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[var(--foreground)]/5 transition-colors text-left"
                                >
                                    <span className="text-base">{lang.flag}</span>
                                    <span className="font-bold">{lang.name}</span>
                                    {translatedLang === lang.code && (
                                        <Check size={12} className="text-emerald-400 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
