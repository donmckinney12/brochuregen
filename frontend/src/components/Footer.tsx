"use client";
import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Globe, Users, Terminal, Mail, Shield, Zap, Sparkles, MessageSquare, ExternalLink } from 'lucide-react';
import { API_URL } from '@/config';

import { usePathname } from 'next/navigation';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const pathname = usePathname();

    const appRoutes = ['/dashboard', '/command', '/brand', '/templates', '/insights', '/leads', '/feedback', '/settings'];
    if (appRoutes.some(route => pathname?.startsWith(route))) {
        return null;
    }

    const socialLinks = [
        { name: 'Website', icon: Globe, href: '#' },
        { name: 'Community', icon: Users, href: '#' },
        { name: 'Developer', icon: Terminal, href: '/developers' },
        { name: 'Contact', icon: Mail, href: 'mailto:support@brochuregen.com' }
    ];

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const res = await fetch(`${API_URL}/api/v1/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                throw new Error('Sync failed');
            }
        } catch (err) {
            console.error(err);
            setStatus('idle');
            alert('Subscription Failed. Please try again.');
        }
    };

    return (
        <footer className="bg-[var(--background)] border-t border-[var(--glass-border)] pt-24 pb-12 relative z-10 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-8 hover:scale-105 transition-transform">
                            <Logo />
                        </Link>
                        <p className="text-[var(--foreground)]/80 font-bold mb-8 max-w-xs leading-relaxed uppercase tracking-widest text-xs">
                            Create high-converting brochures and marketing assets with AI.
                        </p>
                        <div className="flex gap-6">
                            {socialLinks.map((social) => (
                                <a key={social.name} href={social.href} className="w-12 h-12 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--foreground)]/80 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/50 hover:shadow-lg transition-all group">
                                    <span className="sr-only">{social.name}</span>
                                    <social.icon size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {[
                        { title: 'Product', links: [{ n: 'Pricing', h: '/pricing' }, { n: 'Layout Templates', h: '/templates' }, { n: 'API & Docs', h: '/developers' }, { n: 'Help Center', h: '/faq' }] },
                        { title: 'Company', links: [{ n: 'About', h: '/about' }, { n: 'Contact', h: '/contact' }, { n: 'Blog', h: '/blog' }, { n: 'Enterprise', h: '/enterprise' }] },
                        { title: 'Legal', links: [{ n: 'Privacy Policy', h: '/privacy' }, { n: 'Terms of Use', h: '/terms' }, { n: 'Refund Policy', h: '/refund-policy' }, { n: 'Referrals', h: '/referrals' }] }
                    ].map((col) => (
                        <div key={col.title}>
                            <h3 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.3em] mb-8 italic">{col.title}</h3>
                            <ul className="space-y-4">
                                {col.links.map((link) => (
                                    <li key={link.h}><Link href={link.h} className="text-[var(--foreground)]/80 font-bold hover:text-[var(--foreground)] transition-colors text-[10px] uppercase tracking-widest leading-none">{link.n}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-[var(--glass-border)] pt-12 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col gap-4">
                            <p className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.2em]">
                                © {new Date().getFullYear()} BROCHUREGEN. ALL RIGHTS RESERVED.
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-[8px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.3em]">Institutional Node:</span>
                                <img 
                                    src="/endlesstech.png" 
                                    alt="EndLessTech LLC" 
                                    className="h-6 opacity-60 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>


                        {/* Newsletter Subscription */}
                        <form onSubmit={handleSubscribe} className="flex items-center gap-3 bg-[var(--foreground)]/5 p-2 rounded-2xl border border-[var(--glass-border)] max-w-sm w-full md:w-auto overflow-hidden relative">
                            {status === 'success' ? (
                                <div className="absolute inset-0 bg-[var(--accent-primary)] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-full duration-300">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    SUCCESSFULLY SUBSCRIBED
                                </div>
                            ) : null}
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ENTER YOUR EMAIL..."
                                className="bg-transparent border-none text-[10px] font-black tracking-widest px-4 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground)]/80 focus:ring-0 w-full uppercase"
                            />
                            <button
                                type="submit"
                                disabled={status !== 'idle'}
                                className="bg-[var(--foreground)] text-[var(--background)] text-[10px] font-black px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                                {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
}
