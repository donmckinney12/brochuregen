"use client";
import React from 'react';
import SuiteSidebar from './SuiteSidebar';
import SuiteHeader from './SuiteHeader';
import NotificationProvider from './NotificationProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface SuiteLayoutProps {
    children: React.ReactNode;
}

export default function SuiteLayout({ children }: SuiteLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <NotificationProvider>
            <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] relative transition-colors duration-500">
                {/* Global Background (Neural Mesh [v30.2]) */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[var(--background)]"></div>

                    {/* Primary Mesh Gradients - Enhanced for Light Mode */}
                    <div className="absolute inset-0 opacity-20 dark:opacity-30">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-primary)]/30 blur-[130px] rounded-full animate-pulse transition-opacity duration-1000"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-secondary)]/30 blur-[130px] rounded-full animate-pulse delay-1000 transition-opacity duration-1000"></div>
                        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-[var(--accent-tertiary)]/20 blur-[110px] rounded-full animate-pulse delay-500 transition-opacity duration-1000"></div>
                    </div>

                    {/* Neural Node Grid - Theme Aware Contrast */}
                    <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--accent-primary-rgb),0.08)_0%,_transparent_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--accent-primary-rgb),0.05)_0%,_transparent_100%)]"></div>
                </div>

                {/* Mobile Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[45] lg:hidden"
                        />
                    )}
                </AnimatePresence>

                <SuiteSidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 flex flex-col min-w-0 lg:pl-0">
                    <SuiteHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

                    <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </NotificationProvider>
    );
}
