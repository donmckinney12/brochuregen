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
    Grid3X3,
    Activity,
    LogOut,
    Battery
} from 'lucide-react';
import { API_URL } from '@/config';
import { useAuth } from '@/context/AuthContext';
import { OrganizationSwitcher } from '@clerk/nextjs';

const navItems = [
    { name: 'Command Center', href: '/command', icon: Radio },
    { name: 'Generation Studio', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Brand Vault', href: '/brand', icon: Palette },
    { name: 'Visual Layouts', href: '/templates', icon: Grid3X3 },
    { name: 'Studio Insights', href: '/insights', icon: BarChart3 },
    { name: 'Leads Vault', href: '/leads', icon: Users, badgeKey: 'unread_leads' },
    { name: 'Feedback Hub', href: '/feedback', icon: MessageSquare, badgeKey: 'unread_comments' },
    { name: 'Command Settings', href: '/settings', icon: Settings },
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
                console.error("Pulse sync failed", err);
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
            className={`h-[calc(100vh-2rem)] sticky top-4 left-4 m-4 rounded-[3rem] bg-[var(--glass-bg)] backdrop-blur-3xl border border-[var(--glass-border)] flex flex-col z-50 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.4)] transition-all duration-500`}
        >
            {/* Elite Logo Area */}
            <div className="p-8 flex items-center justify-between">
                {!collapsed && (
                    <Link href="/">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.5)]">
                                <Zap size={16} className="text-white" />
                            </div>
                            <span className="text-xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Protocol</span>
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
            <div className="px-6 mb-10">
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-4'} p-3 rounded-2xl bg-[var(--foreground)]/[0.03] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-all`}>
                    <OrganizationSwitcher
                        appearance={{
                            elements: {
                                organizationSwitcherTrigger: "text-[var(--foreground)]/80 hover:bg-transparent py-1 transition-all",
                                organizationPreviewTextContainer: collapsed ? "hidden" : "block text-[var(--foreground)]",
                                organizationPreviewMainIdentifier: "text-[var(--foreground)] font-bold text-xs uppercase tracking-widest",
                                organizationPreviewSecondaryIdentifier: "text-[var(--foreground)]/40 text-[9px] uppercase tracking-tight"
                            }
                        }}
                    />
                </div>
            </div>

            {/* Navigation Mesh */}
            <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar">
                {navItems.map((item, index) => {
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
                                className={`flex items-center p-4 rounded-2xl transition-all group relative border ${isActive
                                    ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]/40 text-[var(--foreground)] shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.1)]'
                                    : 'text-[var(--foreground)]/40 hover:text-[var(--foreground)]/90 bg-transparent border-transparent hover:bg-[var(--foreground)]/[0.03]'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-[var(--accent-primary)]' : 'group-hover:text-[var(--foreground)] transition-colors'} />
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

            {/* Neural Battery [v30.2] */}
            <div className="p-6 mt-auto">
                {!collapsed ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[var(--foreground)]/5 p-6 rounded-[2rem] border border-[var(--glass-border)] space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Battery size={14} className="text-[var(--accent-primary)]" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/40">Neural Power</span>
                            </div>
                            <span className="text-[9px] font-black text-[var(--foreground)] px-2 py-0.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--glass-border)] uppercase italic">Active</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-[var(--foreground)] italic tracking-tighter">
                                {user?.credits || 0}
                                <span className="text-xs font-bold text-[var(--foreground)]/20 ml-2 uppercase tracking-[0.3em]">Units</span>
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
                    <div className="flex flex-col items-center gap-4 bg-[var(--foreground)]/5 p-4 rounded-3xl border border-[var(--glass-border)]">
                        <Zap size={20} className="text-[var(--accent-primary)] animate-pulse" />
                    </div>
                )}
            </div>

            {/* Exit Node */}
            <div className="p-6 border-t border-[var(--glass-border)]">
                <Link
                    href="/"
                    className="flex items-center justify-center lg:justify-start p-4 rounded-2xl text-[var(--foreground)]/30 hover:text-[var(--foreground)]/90 hover:bg-[var(--foreground)]/5 transition-all group"
                >
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    {!collapsed && <span className="ml-4 text-[9px] font-black uppercase tracking-[0.3em]">Terminate Session</span>}
                </Link>
            </div>
        </motion.aside>
    );
}
