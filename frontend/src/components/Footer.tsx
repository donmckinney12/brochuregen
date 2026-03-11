"use client";
import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Globe, Shield, Zap, Sparkles, MessageSquare, ExternalLink, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import { API_URL } from '@/config';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

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
            alert('Protocol Sync Failed. Please try again.');
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
                            Synthesizing high-fidelity marketing assets through neural cluster manifestation.
                        </p>
                        <div className="flex gap-6">
                            {[
                                { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                                { name: 'GitHub', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
                                { name: 'LinkedIn', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2 z M4 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4 z' }
                            ].map((social) => (
                                <a key={social.name} href="#" className="w-12 h-12 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] flex items-center justify-center text-[var(--foreground)]/80 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/50 hover:shadow-lg transition-all">
                                    <span className="sr-only">{social.name}</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon}></path></svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {[
                        { title: 'Protocol', links: [{ n: 'Verify Pricing', h: '/pricing' }, { n: 'Logic Templates', h: '/templates' }, { n: 'Nexus API', h: '/developers' }, { n: 'Neural FAQ', h: '/faq' }] },
                        { title: 'Node', links: [{ n: 'About Internal', h: '/about' }, { n: 'Contact Intake', h: '/contact' }, { n: 'Data Stream', h: '/blog' }, { n: 'Enterprise Node', h: '/enterprise' }] },
                        { title: 'Directives', links: [{ n: 'Privacy Protocol', h: '/privacy' }, { n: 'Terms of Use', h: '/terms' }, { n: 'Refund Policy', h: '/refund-policy' }, { n: 'Referral Sync', h: '/referrals' }] }
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
                        <p className="text-[10px] font-black text-[var(--foreground)]/80 uppercase tracking-[0.2em]">
                            © {new Date().getFullYear()} BROCHUREGEN_OPS [v29.3]. ALL SYSTEMS NOMINAL.
                        </p>


                        {/* Newsletter Protcol */}
                        <form onSubmit={handleSubscribe} className="flex items-center gap-3 bg-[var(--foreground)]/5 p-2 rounded-2xl border border-[var(--glass-border)] max-w-sm w-full md:w-auto overflow-hidden relative">
                            {status === 'success' ? (
                                <div className="absolute inset-0 bg-[var(--accent-primary)] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-full duration-300">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    NODE CONNECTED
                                </div>
                            ) : null}
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="SYNC STREAM..."
                                className="bg-transparent border-none text-[10px] font-black tracking-widest px-4 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground)]/80 focus:ring-0 w-full uppercase"
                            />
                            <button
                                type="submit"
                                disabled={status !== 'idle'}
                                className="bg-[var(--foreground)] text-[var(--background)] text-[10px] font-black px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                                {status === 'loading' ? 'SYNCING...' : 'CONNECT'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
}
