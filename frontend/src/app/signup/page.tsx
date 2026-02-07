"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Signup() {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Background Blob/Mesh Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse delay-700" />

            <Navbar />

            <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] relative z-10">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Benefits Section (Left Column) */}
                    <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                Create professional brochures in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">seconds.</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300">
                                Join 2,000+ businesses automating their marketing materials.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "AI-powered brochure generation",
                                "Professional print-ready exports",
                                "7-day free trial on all plans",
                                "No design skills required"
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-200 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-slate-700">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500`}>
                                            {/* Placeholder avatars */}
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                                "This tool saved me hours of design work. The AI writer is surprisingly good!"
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
                                — Sarah J., Marketing Director
                            </p>
                        </div>
                    </div>

                    {/* Sign Up Card (Right Column) */}
                    <div className="w-full">
                        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
                            {/* Subtle top highlight */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                            <div className="text-center mb-6 flex flex-col items-center">
                                <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
                                    <Link href="/">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <span className="text-white font-bold text-2xl">B</span>
                                        </div>
                                    </Link>
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create Account</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Start your 7-day free trial</p>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 text-slate-700 dark:text-slate-300 text-sm font-medium hover:shadow-sm">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 text-slate-700 dark:text-slate-300 text-sm font-medium hover:shadow-sm">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or sign up with email</span>
                                </div>
                            </div>

                            <form className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400"
                                        placeholder="name@company.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400"
                                        placeholder="••••••••"
                                    />
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 ml-1">
                                        Must be at least 8 characters.
                                    </p>
                                </div>

                                <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-200">
                                    Create Account
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-500 transition-colors">Sign in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
