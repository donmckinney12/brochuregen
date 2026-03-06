import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/scrape/refine-text`, {
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-white">
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AI Content Refiner</h2>
                            <p className="text-sm text-slate-500">Editing: <span className="uppercase tracking-wider font-bold">{fieldType}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                    {/* Input Area */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Text</label>
                        <textarea
                            value={currentText}
                            onChange={(e) => setCurrentText(e.target.value)}
                            className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        />
                    </div>

                    {/* AI Actions */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">AI Magic Actions</label>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
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
                                    className="p-3 text-left border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <span className="block text-sm font-bold mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentText(initialText)}
                        disabled={isRefining || currentText === initialText}
                        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                        Revert to Original
                    </button>

                    <button
                        onClick={() => { onApply(currentText, fieldType); onClose(); }}
                        disabled={isRefining}
                        className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
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
