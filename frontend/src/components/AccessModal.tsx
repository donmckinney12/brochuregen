"use client";
import React from 'react';
import Link from 'next/link';

interface AccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'guest' | 'limit';
    onUpgrade?: () => void;
}

export default function AccessModal({ isOpen, onClose, mode, onUpgrade }: AccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                        {mode === 'guest' ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {mode === 'guest' ? 'Unlock Full Access' : 'Limit Reached'}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        {mode === 'guest'
                            ? 'Create a free account to generate professional brochures instantly. No credit card required.'
                            : 'You have used your free credits. Upgrade to Pro for unlimited generations.'}
                    </p>

                    <div className="space-y-3">
                        {mode === 'guest' ? (
                            <>
                                <Link
                                    href="/signup"
                                    className="block w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                                >
                                    Start Free Trial
                                </Link>
                                <Link
                                    href="/login"
                                    className="block w-full py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Log In
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={onUpgrade}
                                className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
                            >
                                Upgrade to Pro
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
