"use client";
import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';

export default function Login() {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse delay-700" />

            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)] relative z-10">
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200",
                            card: "bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden",
                            headerTitle: "text-slate-900 dark:text-white",
                            headerSubtitle: "text-slate-500 dark:text-slate-400",
                            socialButtonsBlockButton: "rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all",
                            formFieldInput: "rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white",
                            footerActionLink: "text-blue-600 dark:text-blue-400 font-semibold hover:text-purple-500"
                        }
                    }}
                    signUpUrl="/signup"
                    forceRedirectUrl="/dashboard"
                    routing="path"
                    path="/login"
                />
            </main>
        </div>
    );
}
