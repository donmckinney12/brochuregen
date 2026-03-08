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
                {/* Global Background (Inherited from root but reinforced) */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[var(--background)] opacity-50"></div>
                    <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1)_0%,_rgba(0,0,0,1)_100%)] bg-[radial-gradient(circle_at_50%_50%,_var(--accent-primary)_0%,_transparent_100%)] opacity-5"></div>
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[var(--accent-secondary)]/5 dark:bg-purple-600/10 blur-[100px] rounded-full animate-pulse delay-700"></div>
                </div>

                {/* Mobile Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                        />
                    )}
                </AnimatePresence>

                <SuiteSidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 flex flex-col min-w-0">
                    <SuiteHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

                    <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
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
