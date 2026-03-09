import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Wand2, Check, RotateCcw, Zap, BrainCircuit, Loader2 } from 'lucide-react';
import { API_URL } from '@/config';

interface AIRefinerModalProps {
    isOpen: boolean;
    initialText: string;
    fieldType: string;
    onClose: () => void;
    onApply: (refinedText: string, fieldType: string) => void;
}

const ACTIONS = [
    { id: 'punchy', label: '🥊 Make Punchier', prompt: 'Make it punchy, catchy, and exciting. Maximum impact.' },
    { id: 'professional', label: '👔 Professional', prompt: 'Make it formal, professional, and trustworthy.' },
    { id: 'expand', label: '📝 Expand Details', prompt: 'Expand on the details slightly while keeping it concise.' },
    { id: 'shorten', label: '✂️ Shorten', prompt: 'Make it as brief and direct as possible.' },
    { id: 'spanish', label: '🇪🇸 Translate to Spanish', prompt: 'Translate this text to professional Spanish.' }
];

export default function AIRefinerModal({ isOpen, initialText, fieldType, onClose, onApply }: AIRefinerModalProps) {
    const { user, getToken, refreshProfile } = useAuth();
    const [currentText, setCurrentText] = useState(initialText);
    const [isRefining, setIsRefining] = useState(false);
    const [error, setError] = useState('');

    // Reset state when opened
    React.useEffect(() => {
        if (isOpen) {
            setCurrentText(initialText);
            setError('');
        }
    }, [isOpen, initialText]);

    if (!isOpen) return null;

    const handleRefine = async (actionPrompt: string) => {
        setIsRefining(true);
        setError('');

        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/v1/scrape/refine-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: currentText,
                    action: actionPrompt
                })
            });

            if (!res.ok) {
                if (res.status === 402) throw new Error("Insufficient Refine Credits. Please upgrade.");
                const data = await res.json();
                throw new Error(data.detail || "Failed to refine text.");
            }

            const result = await res.json();
            if (result.refined_text) {
                setCurrentText(result.refined_text);
                await refreshProfile(); // Update credit count
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-[var(--foreground)]">
            <div className="absolute inset-0 bg-[var(--background)]/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-[var(--background)] rounded-3xl shadow-2xl border border-[var(--glass-border)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-[var(--glass-border)] flex justify-between items-center bg-gradient-to-r from-[var(--foreground)]/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center shadow-inner border border-[var(--accent-primary)]/20">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">Refinement Matrix</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-[var(--foreground)]/50 uppercase tracking-[0.2em]">Node: {fieldType}</span>
                                <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
                                <span className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.2em]">Manual Override Active</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded-full transition-all hover:rotate-90"
                    >
                        <svg className="w-5 h-5 text-[var(--foreground)]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-8 custom-scrollbar">
                    {/* Input Area */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.3em] ml-2">Direct Content Stream</label>
                            <button
                                onClick={() => setCurrentText(initialText)}
                                disabled={currentText === initialText}
                                className="text-[8px] font-black text-[var(--accent-primary)] uppercase tracking-widest hover:opacity-70 disabled:opacity-20 transition-all flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                Reset to Original
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/20 to-transparent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
                            <textarea
                                value={currentText}
                                onChange={(e) => setCurrentText(e.target.value)}
                                className="relative w-full h-40 p-6 bg-[var(--background)] border border-[var(--glass-border)] rounded-2xl focus:ring-1 focus:ring-[var(--accent-primary)]/50 outline-none resize-none text-[var(--foreground)] font-medium leading-relaxed transition-all shadow-inner"
                                placeholder="Enter manual precision data..."
                            />
                        </div>
                    </div>

                    {/* AI Actions */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-[var(--foreground)]/70">AI Magic Actions</label>
                            <span className="text-xs font-bold text-[var(--foreground)]/50 bg-[var(--foreground)]/5 px-2 py-1 rounded-md">
                                {user?.refine_credits ?? 0} Credits Left
                            </span>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/50">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {ACTIONS.map(action => (
                                <button
                                    key={action.id}
                                    onClick={() => handleRefine(action.prompt)}
                                    disabled={isRefining}
                                    className="p-3 text-left border border-[var(--glass-border)] rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <span className="block text-sm font-bold mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-[var(--foreground)]">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-[var(--glass-border)] bg-[var(--foreground)]/5 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentText(initialText)}
                        disabled={isRefining || currentText === initialText}
                        className="px-4 py-2 text-sm font-bold text-[var(--foreground)]/50 hover:text-[var(--foreground)] disabled:opacity-30 transition-colors"
                    >
                        Revert to Original
                    </button>

                    <button
                        onClick={() => { onApply(currentText, fieldType); onClose(); }}
                        disabled={isRefining}
                        className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                        {isRefining ? (
                            <>
                                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Refining...
                            </>
                        ) : 'Apply Changes'}
                    </button>
                </div>

            </div>
        </div>
    );
}
