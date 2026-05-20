"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Sparkles,
    Palette,
    BarChart3,
    Users,
    Zap,
    Settings,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Grid3X3,
    Activity,
    LogOut,
    Battery
} from 'lucide-react';
import Logo from './Logo';

const ZapIcon = ({ size = 20, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);
import { API_URL } from '@/config';
import { useAuth } from '@/context/AuthContext';
import { OrganizationSwitcher } from '@clerk/nextjs';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Creator', href: '/command', icon: Sparkles },
    { name: 'Brand Assets', href: '/brand', icon: Palette },
    { name: 'Templates', href: '/templates', icon: Grid3X3 },
    { name: 'Analytics', href: '/insights', icon: BarChart3, requiredFeature: 'ANALYTICS' },
    { name: 'Leads', href: '/leads', icon: Users, badgeKey: 'unread_leads', requiredFeature: 'LEADS' },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare, badgeKey: 'unread_comments', requiredFeature: 'FEEDBACK' },
    { name: 'Settings', href: '/settings', icon: Settings },
];

interface SuiteSidebarProps {
    mobileOpen?: boolean;
    onClose?: () => void;
}

export default function SuiteSidebar({ mobileOpen, onClose }: SuiteSidebarProps) {
    const pathname = usePathname();
    const { user, getToken, hasFeature } = useAuth();
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
                const res = await fetch(`${API_URL}/api/v1/command/pulse`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const unreadLeads = data.filter((p: any) => p.type === 'LEAD' && !p.metadata.is_read).length;
                    const unreadFeedback = data.filter((p: any) => p.type === 'FEEDBACK' && !p.metadata.is_read).length;
                    setPulse({ unread_comments: unreadFeedback, unread_leads: unreadLeads, total_pulse: data.length });
                }
            } catch (err) {
                console.error("Activity sync failed", err);
            }
        };
        fetchPulse();
        const interval = setInterval(fetchPulse, 60000);
        return () => clearInterval(interval);
    }, [getToken]);

    if (!mounted) return (
        <aside className="w-[80px] h-[calc(100vh-2rem)] m-4 rounded-[2.5rem] bg-[var(--foreground)]/[0.02] border border-[var(--glass-border)] animate-pulse" />
    );

    return (
        <motion.aside
            initial={false}
            animate={{
                width: collapsed ? 100 : 300,
                x: mobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
            }}
            className={`h-[calc(100vh-2rem)] sticky top-4 left-4 m-4 rounded-[3rem] ${collapsed ? 'bg-[var(--background)] border-indigo-500/30' : 'bg-[var(--glass-bg)] border-[var(--glass-border)] dark:border-[var(--accent-primary)]/30 backdrop-blur-3xl'} flex flex-col z-50 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(var(--accent-primary-rgb),0.15)] transition-all duration-500 shadow-2xl`}
        >
            {/* Elite Logo Area */}
            <div className={`${collapsed ? 'p-4' : 'p-8'} flex items-center justify-between transition-all duration-500`}>
                {!collapsed && (
                    <Link href="/">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center"
                        >
                            <Logo showEnterprise={false} className="scale-90 origin-left" />
                        </motion.div>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-3 hover:bg-[var(--foreground)]/10 rounded-2xl transition-all text-[var(--foreground)]/60 hover:text-[var(--foreground)] mx-auto lg:mx-0"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Premium Org Switcher */}
            <div className={`${collapsed ? 'px-3' : 'px-6'} mb-10 transition-all duration-500`}>
                <div className={`flex items-center ${collapsed ? 'justify-center p-1' : 'p-3'} rounded-2xl bg-[var(--foreground)]/[0.03] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-all overflow-hidden`}>
                    <OrganizationSwitcher
                        appearance={{
                            elements: {
                                organizationSwitcherTrigger: `text-[var(--foreground)]/90 hover:bg-transparent transition-all ${collapsed ? 'p-0 w-10 h-10 flex items-center justify-center scale-125' : 'py-1'}`,
                                organizationPreviewTextContainer: collapsed ? "hidden" : "block text-[var(--foreground)]",
                                organizationPreviewMainIdentifier: "text-[var(--foreground)] font-bold text-xs uppercase tracking-widest",
                                organizationPreviewSecondaryIdentifier: "text-[var(--foreground)]/60 text-[9px] uppercase tracking-tight"
                            }
                        }}
                    />
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className={`flex-1 ${collapsed ? 'px-3' : 'px-6'} space-y-3 overflow-y-auto custom-scrollbar transition-all duration-500`}>
                {navItems.filter(item => !item.requiredFeature || hasFeature(item.requiredFeature as any)).map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} p-4 rounded-2xl transition-all group relative border ${isActive
                                    ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]/40 text-[var(--foreground)] shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.1)]'
                                    : 'text-[var(--foreground)]/40 hover:text-[var(--foreground)]/90 bg-transparent border-transparent hover:bg-[var(--foreground)]/[0.03]'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-[var(--accent-primary)]' : 'group-hover:text-[var(--foreground)]/90 text-[var(--foreground)]/60 transition-colors'} />
                                {!collapsed && (
                                    <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {item.name}
                                    </span>
                                )}
                                {item.badgeKey && (pulse as any)[item.badgeKey] > 0 && (
                                    <span className={`absolute ${collapsed ? 'top-2 right-2' : 'right-4'} flex h-5 min-w-[1.25rem] px-1 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[9px] font-black text-white shadow-xl animate-pulse border border-white/20`}>
                                        {(pulse as any)[item.badgeKey]}
                                    </span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active-glow"
                                        className="absolute inset-0 bg-[var(--foreground)]/5 blur-xl -z-10 rounded-2xl"
                                    />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Usage Status */}
            <div className={`${collapsed ? 'p-3' : 'p-6'} mt-auto transition-all duration-500`}>
                {!collapsed ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--foreground)]/5 p-6 rounded-[2rem] border border-[var(--glass-border)] space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Battery size={14} className="text-[var(--accent-primary)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/60">Account Credits</span>
                            </div>
                            <span className="text-[9px] font-black text-[var(--foreground)] px-2 py-0.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] uppercase italic">Active</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-[var(--foreground)] italic tracking-tighter">
                                {user?.credits || 0}
                                <span className="text-xs font-bold text-[var(--foreground)]/40 ml-2 uppercase tracking-[0.3em]">Units</span>
                            </div>
                            <div className="w-full bg-[var(--foreground)]/5 h-2 rounded-full overflow-hidden border border-[var(--glass-border)]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(((user?.credits || 0) / 50) * 100, 100)}%` }}
                                    className="h-full bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.5)]"
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center bg-[var(--foreground)]/5 p-4 rounded-3xl border border-[var(--glass-border)] aspect-square overflow-hidden">
                        <Logo showText={false} showEnterprise={false} className="scale-[0.6] opacity-60" />
                    </div>
                )}
            </div>

            {/* Sign Out */}
            <div className={`${collapsed ? 'p-3' : 'p-6'} border-t border-[var(--glass-border)] transition-all duration-500`}>
                <Link
                    href="/"
                    className="flex items-center justify-center lg:justify-start p-4 rounded-2xl text-[var(--foreground)]/60 hover:text-[var(--foreground)]/90 hover:bg-[var(--foreground)]/5 transition-all group"
                >
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    {!collapsed && <span className="ml-4 text-[9px] font-black uppercase tracking-[0.3em]">Logout</span>}
                </Link>
            </div>
        </motion.aside>
    );
}
