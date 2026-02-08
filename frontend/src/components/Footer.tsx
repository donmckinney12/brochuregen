"use client";
import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 3000); // Reset after 3s
    };

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <Logo />
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xs leading-relaxed">
                            Turn any website into professional marketing materials in seconds using advanced AI.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons */}
                            {/* Social Icons */}
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="sr-only">Twitter</span>
                                {/* Feather Icon: Twitter */}
                                <svg className="w-5 h-5" fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                            <a href="https://github.com/donmckinney12" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="sr-only">GitHub</span>
                                {/* Feather Icon: GitHub */}
                                <svg className="w-5 h-5" fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                {/* Feather Icon: LinkedIn */}
                                <svg className="w-5 h-5" fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link href="/templates" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Templates</Link></li>
                            <li><Link href="/developers" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/refund-policy" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            © {new Date().getFullYear()} BrochureGen AI. All rights reserved.
                        </p>

                        {/* Newsletter Mini-Form */}
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 max-w-sm w-full md:w-auto overflow-hidden relative">
                            {subscribed ? (
                                <div className="absolute inset-0 bg-green-500 flex items-center justify-center text-white text-sm font-bold animate-in fade-in slide-in-from-bottom-full duration-300">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    Success! You're in.
                                </div>
                            ) : null}
                            <input
                                type="email"
                                placeholder="Stay updated..."
                                className="bg-transparent border-none text-sm px-3 py-1 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 w-full"
                            />
                            <button
                                onClick={handleSubscribe}
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
