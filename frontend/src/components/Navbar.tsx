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

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="group" onClick={() => setIsMenuOpen(false)}>
                    <Logo />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {pathname !== '/checkout' && (
                        <>
                            <Link href="/features" className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/features' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Features</Link>
                            <Link href="/pricing" className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/pricing' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Pricing</Link>
                            <Link href="/enterprise" className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/enterprise' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Enterprise</Link>
                            <Link href="/partners" className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/partners' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Partners</Link>
                            <Link href="/blog" className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/blog' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Blog</Link>
                            <SignedIn>
                                <Link href="/dashboard" className={`text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>Dashboard</Link>
                            </SignedIn>
                        </>
                    )}

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <OrganizationSwitcher
                                hidePersonal={false}
                                appearance={{
                                    baseTheme: darkMode ? dark : undefined,
                                    elements: {
                                        organizationSwitcherTrigger: "focus:shadow-none focus:outline-none",
                                        organizationPreviewTextContainer: "text-slate-600 dark:text-slate-300",
                                        organizationSwitcherTriggerIcon: "text-slate-400"
                                    }
                                }}
                            />
                            <div className="hidden sm:flex flex-col items-end border-r border-slate-200 dark:border-slate-700 pr-4 mr-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Credits</span>
                                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 leading-none">{user?.credits}</span>
                            </div>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <div className="flex items-center gap-4">
                            <SignInButton mode="modal">
                                <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
                                    Get Started
                                </button>
                            </SignUpButton>
                        </div>
                    </SignedOut>

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
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 shadow-xl">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        <Link href="/features" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2">Features</Link>
                        <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2">Pricing</Link>
                        <Link href="/enterprise" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2">Enterprise</Link>
                        <Link href="/partners" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2">Partners</Link>
                        <Link href="/wall-of-love" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2">Wall of Love</Link>
                        <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2">Blog</Link>

                        <SignedIn>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserButton afterSignOutUrl="/" showName />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Credits</span>
                                            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 leading-none">{user?.credits}</span>
                                        </div>
                                    </div>
                                    <div className="py-2 px-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                        <OrganizationSwitcher
                                            hidePersonal={false}
                                            appearance={{
                                                baseTheme: darkMode ? dark : undefined,
                                                elements: {
                                                    rootBox: "w-full",
                                                    organizationSwitcherTrigger: "w-full justify-between focus:shadow-none focus:outline-none py-2",
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full py-2 text-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium mb-2">
                                    Dashboard
                                </Link>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <SignInButton mode="modal">
                                    <button onClick={() => setIsMenuOpen(false)} className="text-slate-600 dark:text-slate-300 font-medium py-2 text-left">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button onClick={() => setIsMenuOpen(false)} className="text-center w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
}
