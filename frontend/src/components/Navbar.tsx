"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import { useTheme } from '@/context/ThemeContext';
import { LayoutDashboard, Zap } from 'lucide-react';


export default function Navbar() {
    const { isDark: darkMode, mounted } = useTheme();
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
        <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-[var(--glass-bg)] backdrop-blur-3xl border-b border-[var(--glass-border)] py-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)]' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Brand Identity */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-3 group transition-all">
                        <Logo />
                    </Link>
                </div>

                {/* Strategic Links */}
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

                {/* Management Suite */}
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
                                            Sign Up
                                        </button>
                                    </SignUpButton>
                                </SignedOut>
                                <SignedIn>
                                    <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] px-6 py-3 rounded-2xl hover:bg-[var(--foreground)]/10 transition-all shadow-xl mr-2 underline-offset-4 decoration-[var(--accent-primary)]">
                                        <LayoutDashboard size={14} />
                                        Dashboard
                                    </Link>
                                    <UserButton afterSignOutUrl="/" appearance={{ baseTheme: darkMode ? dark : undefined }} />
                                </SignedIn>
                            </>
                        )}
                    </div>

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
                <div className="lg:hidden absolute top-full left-0 w-full bg-[var(--background)] border-b border-[var(--glass-border)] animate-in slide-in-from-top-2 shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
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
