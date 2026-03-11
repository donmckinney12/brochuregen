"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import { useTheme } from '@/context/ThemeContext';
import { Shield, LayoutDashboard, Zap } from 'lucide-react';

export default function Navbar() {
    const { isDark: darkMode, toggleTheme, mounted } = useTheme();
    const pathname = usePathname();
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[var(--glass-bg)] backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Brand Identity */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-3 group transition-all">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-[var(--foreground)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-primary)]/40 to-[var(--accent-secondary)]/40 group-hover:opacity-100 opacity-60 transition-opacity"></div>
                            <Shield size={20} className="relative text-[var(--background)] animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-[var(--foreground)] uppercase italic leading-none">
                                Brochure<span className="text-[var(--accent-primary)]">Gen</span>
                            </span>
                            <span className="text-[8px] font-black tracking-[0.4em] text-[var(--foreground)]/30 uppercase mt-1">Enterprise v4.0</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Nodes */}
                <div className="hidden lg:flex items-center justify-center gap-12">
                    {['Features', 'Pricing', 'Enterprise', 'Developers'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className={`text-[10px] font-black uppercase tracking-[0.35em] hover:text-[var(--accent-primary)] transition-all relative group ${pathname === `/${item.toLowerCase()}` ? 'text-[var(--accent-primary)]' : 'text-[var(--foreground)]/40'}`}
                        >
                            {item}
                            <span className="absolute -bottom-2 left-0 w-0 h-px bg-[var(--accent-primary)] transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Operation Center */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        {mounted && (
                            <>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 hover:text-[var(--foreground)] px-4 py-2 transition-all">
                                            Login
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button className="text-[10px] font-black uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] px-8 py-3.5 rounded-2xl hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-[0_15px_30px_rgba(0,0,0,0.2)] active:scale-95 whitespace-nowrap">
                                            Initialize Access
                                        </button>
                                    </SignUpButton>
                                </SignedOut>
                                <SignedIn>
                                    <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-[var(--foreground)] px-6 py-3 rounded-2xl hover:bg-white/10 transition-all shadow-xl mr-2 underline-offset-4 decoration-[var(--accent-primary)]">
                                        <LayoutDashboard size={14} />
                                        Dashboard
                                    </Link>
                                    <UserButton afterSignOutUrl="/" appearance={{ baseTheme: darkMode ? dark : undefined }} />
                                </SignedIn>
                            </>
                        )}
                    </div>

                    <div className="w-px h-6 bg-white/10 hidden sm:block mx-1" />

                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all text-[var(--foreground)]/40 hover:text-[var(--foreground)]"
                        aria-label="Toggle Theme"
                    >
                        {darkMode ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        )}
                    </button>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-[var(--foreground)]/40 hover:text-[var(--foreground)]">
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Enterprise Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-[var(--background)] border-b border-white/5 animate-in slide-in-from-top-2 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                    <div className="px-6 py-12 flex flex-col gap-8">
                        {['Features', 'Pricing', 'Enterprise', 'Developers'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/40 hover:text-[var(--accent-primary)]">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav >
    );
}
