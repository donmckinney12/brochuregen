"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Palette,
    BarChart3,
    Users,
    Zap,
    Settings,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Radio,
    Grid3X3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OrganizationSwitcher } from '@clerk/nextjs';

const navItems = [
    { name: 'Command Center', href: '/command', icon: Radio },
    { name: 'Generation Studio', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Brand Vault', href: '/brand', icon: Palette },
    { name: 'Templates', href: '/templates', icon: Grid3X3 },
    { name: 'Studio Insights', href: '/insights', icon: BarChart3 },
    { name: 'Leads Vault', href: '/leads', icon: Users, badgeKey: 'unread_leads' },
    { name: 'Feedback Hub', href: '/feedback', icon: MessageSquare, badgeKey: 'unread_comments' },
    { name: 'Settings', href: '/settings', icon: Settings },
];

interface SuiteSidebarProps {
    mobileOpen?: boolean;
    onClose?: () => void;
}

export default function SuiteSidebar({ mobileOpen, onClose }: SuiteSidebarProps) {
    const pathname = usePathname();
    const { user, getToken } = useAuth();
    const [collapsed, setCollapsed] = React.useState(false);
    const [pulse, setPulse] = React.useState({ unread_comments: 0, unread_leads: 0, total_pulse: 0 });
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        const fetchPulse = async () => {
            try {
                const token = await getToken();
                if (!token) return;
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/command/pulse`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const unreadLeads = data.filter((p: any) => p.type === 'LEAD' && !p.metadata.is_read).length;
                    const unreadFeedback = data.filter((p: any) => p.type === 'FEEDBACK' && !p.metadata.is_read).length;
                    setPulse({ unread_comments: unreadFeedback, unread_leads: unreadLeads, total_pulse: data.length });
                }
            } catch (err) {
                console.error("Pulse sync failed", err);
            }
        };
        fetchPulse();
        const interval = setInterval(fetchPulse, 60000); // Sync every minute
        return () => clearInterval(interval);
    }, [getToken]);

    if (!mounted) return (
        <aside className="w-[80px] h-screen bg-[var(--glass-bg)] border-r border-[var(--glass-border)] animate-pulse" />
    );

    return (
        <motion.aside
            initial={false}
            animate={{
                width: collapsed ? 80 : 280,
                x: mobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
            }}
            className={`h-screen fixed lg:sticky top-0 left-0 bg-[var(--glass-bg)] backdrop-blur-xl border-r border-[var(--glass-border)] flex flex-col z-50 overflow-y-auto overflow-x-hidden transition-colors duration-500 ${mobileOpen ? 'shadow-2xl translate-x-0' : 'max-lg:-translate-x-full'}`}
        >
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <Link href="/">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-2xl font-black bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent italic cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            PROTOCOL
                        </motion.div>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:block p-2 hover:bg-[var(--foreground)]/5 rounded-lg transition-colors text-[var(--foreground)]/80"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-[var(--foreground)]/5 rounded-lg transition-colors text-[var(--foreground)]/80"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* Org Switcher */}
            <div className="px-4 mb-8">
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} bg-[var(--foreground)]/5 p-2 rounded-xl border border-[var(--glass-border)] overflow-hidden min-h-[48px]`}>
                    {mounted ? (
                        <OrganizationSwitcher
                            appearance={{
                                elements: {
                                    organizationSwitcherTrigger: "text-[var(--foreground)] hover:bg-[var(--foreground)]/10 py-1 transition-all",
                                    organizationPreviewTextContainer: collapsed ? "hidden" : "block text-[var(--foreground)]",
                                    organizationPreviewMainIdentifier: "text-[var(--foreground)] font-medium",
                                    organizationPreviewSecondaryIdentifier: "text-[var(--foreground)]/80"
                                }
                            }}
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-[var(--foreground)]/10 animate-pulse" />
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center p-3 rounded-xl transition-all group relative ${isActive
                                ? 'bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 text-[var(--foreground)] border border-[var(--accent-primary)]/20'
                                : 'text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5 border border-transparent'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-[var(--accent-primary)]' : 'group-hover:text-[var(--accent-primary)] transition-colors'} />
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-3 font-medium whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            {item.badgeKey && (pulse as any)[item.badgeKey] > 0 && (
                                <span className={`absolute ${collapsed ? 'top-2 right-2' : 'right-4'} flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[8px] font-black text-white shadow-lg animate-pulse`}>
                                    {(pulse as any)[item.badgeKey]}
                                </span>
                            )}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-glow"
                                    className="absolute inset-0 bg-[var(--accent-primary)]/5 blur-xl -z-10"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Credits */}
            <div className="p-4 border-t border-[var(--glass-border)] space-y-4">
                {!collapsed && (
                    <div className="bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--background)] p-4 rounded-xl border border-[var(--accent-primary)]/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase tracking-tighter text-[var(--accent-primary)] font-bold">Neural Balance</span>
                            <Zap size={12} className="text-yellow-500 animate-pulse" />
                        </div>
                        <div className="text-xl font-black text-[var(--foreground)]">{user?.credits || 0} <span className="text-xs font-normal text-[var(--foreground)]/80">Tokens</span></div>
                        <div className="w-full bg-[var(--foreground)]/10 h-1 rounded-full mt-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((user?.credits || 0) / 50) * 100, 100)}%` }}
                                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                            />
                        </div>
                    </div>
                )}

                <Link
                    href="/"
                    className="flex items-center p-3 text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors group"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <motion.div whileHover={{ scale: 1.2 }}>
                            <Zap size={18} className="text-[var(--accent-secondary)]" />
                        </motion.div>
                    </div>
                    {!collapsed && <span className="ml-3 font-medium whitespace-nowrap">Exit to Website</span>}
                </Link>

            </div>
        </motion.aside>
    );
}
