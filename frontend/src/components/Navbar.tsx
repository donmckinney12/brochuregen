"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Logo from './Logo';

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-900/95 border-b border-white/20 dark:border-slate-800 z-50 transition-all supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="group transition-transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                    <Logo />
                </Link>

                {pathname !== '/checkout' && (
                    <>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-10">
                            <Link
                                href="/about"
                                className={`text-sm font-medium transition-colors ${pathname === '/about' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
                            >
                                About
                            </Link>

                            <Link
                                href="/pricing"
                                className={`text-sm font-medium transition-colors ${pathname === '/pricing' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
                            >
                                Pricing
                            </Link>

                            <Link
                                href="/checkout"
                                className={`text-sm font-medium transition-colors ${pathname === '/checkout' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
                            >
                                Checkout
                            </Link>

                            <Link
                                href="/login"
                                className={`text-sm font-medium transition-colors ${pathname === '/login' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
                            >
                                Sign In
                            </Link>

                            {pathname !== '/signup' && (
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity"
                                >
                                    Get Started
                                </Link>
                            )}

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                                aria-label="Toggle Dark Mode"
                            >
                                {darkMode ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                )}
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                            >
                                {darkMode ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                )}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
                            >
                                {isMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                )}
                            </button>
                        </div>
                    </>
                )}

                {pathname === '/checkout' && (
                    <div className="flex items-center gap-10">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                            aria-label="Toggle Dark Mode"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && pathname !== '/checkout' && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2 hover:text-blue-600 dark:hover:text-blue-400">About</Link>
                        <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2 hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link>
                        <Link href="/checkout" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2 hover:text-blue-600 dark:hover:text-blue-400">Checkout</Link>
                        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2 hover:text-blue-600 dark:hover:text-blue-400">Sign In</Link>
                        {pathname !== '/signup' && (
                            <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="text-center w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
