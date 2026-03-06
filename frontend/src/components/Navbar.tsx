"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Initialize theme
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

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

    // Determine if user is authenticated for conditional rendering
    const isAuthenticated = !!user;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] py-3 shadow-lg' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">
                {/* Logo Section */}
                <div className="flex items-center justify-start">
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-[var(--foreground)] border border-[var(--accent-primary)]/30 rounded-xl overflow-hidden shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 group-hover:opacity-100 opacity-60 transition-opacity"></div>
                            <span className="relative text-xl font-black text-[var(--background)] italic tracking-tighter">BG</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-[var(--foreground)] uppercase italic group-hover:text-[var(--accent-primary)] transition-colors">
                            Brochure<span className="text-[var(--foreground)]">Gen</span>
                        </span>
                    </Link>
                </div>

                {/* Centered Navigation Links */}
                <div className="hidden md:flex items-center justify-center gap-10">
                    {['Features', 'Pricing', 'Use-Cases'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className={`text-[11px] font-black uppercase tracking-[0.3em] hover:text-[var(--accent-primary)] transition-all ${pathname === `/${item.toLowerCase()}` ? 'text-[var(--accent-primary)] font-black' : 'text-[var(--foreground)]/40'}`}
                        >
                            {item}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Link href="/dashboard" className={`text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[var(--accent-primary)] transition-all ${pathname === '/dashboard' ? 'text-[var(--accent-primary)]' : 'text-[var(--foreground)]/60'}`}>Dashboard</Link>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center justify-end gap-4">
                    <div className="flex items-center gap-3">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/80 hover:text-[var(--foreground)] px-4 py-2 transition-all">
                                    Login
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="text-[10px] font-bold uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] px-6 py-2.5 rounded-lg hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-lg active:scale-95">
                                    Join
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="hidden sm:flex flex-col items-end border-r border-[var(--glass-border)] pr-4 mr-2">
                                <span className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase leading-none mb-1">Matrix</span>
                                <span className="text-sm font-extrabold text-[var(--accent-primary)] leading-none">{user?.credits}</span>
                            </div>
                            <UserButton afterSignOutUrl="/" appearance={{ baseTheme: darkMode ? dark : undefined }} />
                        </SignedIn>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-[var(--foreground)]/10 transition-colors text-[var(--foreground)]/60"
                        aria-label="Toggle Theme"
                    >
                        {darkMode ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        )}
                    </button>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[var(--foreground)]/60 hover:bg-[var(--foreground)]/10 rounded-lg">
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[var(--background)] border-b border-[var(--glass-border)] animate-in slide-in-from-top-2 shadow-2xl">
                    <div className="px-6 py-8 flex flex-col gap-6">
                        {['Features', 'Pricing', 'Use-Cases'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40 hover:text-[var(--accent-primary)]">
                                {item}
                            </Link>
                        ))}
                        <SignedIn>
                            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--foreground)]/60 hover:text-[var(--accent-primary)]">Dashboard</Link>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                                <SignInButton mode="modal">
                                    <button onClick={() => setIsMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 text-left">Login</button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button onClick={() => setIsMenuOpen(false)} className="w-full py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest">Join Protocol</button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav >
    );
}
