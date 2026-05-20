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
            <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] relative transition-colors duration-500">
                {/* Global Background (Synced with Landing Page [v30.2]) */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[var(--background)]"></div>
                    <div className="absolute inset-0 noise-overlay"></div>
                    <div className="absolute inset-0 mesh-gradient opacity-60 dark:opacity-80"></div>
                    
                    {/* High-Intensity Atmospheric Layers */}
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--accent-primary)]/40 blur-[150px] rounded-full animate-pulse transition-opacity duration-1000"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[var(--accent-secondary)]/40 blur-[150px] rounded-full animate-pulse delay-1000 transition-opacity duration-1000"></div>
                    <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-[var(--accent-tertiary)]/30 blur-[130px] rounded-full animate-pulse delay-500 transition-opacity duration-1000"></div>
                    
                    {/* Synchronized Aurora/Neural Layers */}
                    <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-[var(--accent-primary)]/30 via-[var(--accent-secondary)]/20 to-transparent blur-[140px] opacity-70"></div>
                    
                    {/* Landing Hero Specific Mesh Sync */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--accent-primary-rgb),0.15),transparent_70%)] opacity-80"></div>
                    
                    <div className="absolute inset-0 animate-aurora mix-blend-screen opacity-50"></div>
                    <div className="scanline opacity-40"></div>
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
