"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function LegalHub() {
    const documents = [
        {
            title: "Terms of Service",
            description: "The rules and guidelines for using our platform.",
            path: "/terms",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        },
        {
            title: "Privacy Policy",
            description: "How we collect, use, and protect your personal data.",
            path: "/privacy",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        },
        {
            title: "Refund Policy",
            description: "Our policy on payments, upgrades, and cancellations.",
            path: "/refund-policy",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        },
        {
            title: "Cookie Policy",
            description: "Details on how we use cookies to improve your experience.",
            path: "/privacy#cookies",
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 16v2m3-6v6m3-8v8m2-10V5a2 2 0 00-2-2H9a2 2 0 00-2 2v3m4 0h4"></path></svg>
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-40 pb-20 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Legal Center</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Everything you need to know about our legal terms, privacy standards, and compliance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {documents.map((doc, idx) => (
                        <Link
                            key={idx}
                            href={doc.path}
                            className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {doc.icon}
                            </div>
                            <h2 className="text-2xl font-bold mb-3">{doc.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {doc.description}
                            </p>
                            <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-bold gap-2">
                                Read More
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 p-12 bg-blue-600 rounded-[40px] text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <h2 className="text-3xl font-bold mb-6">Questions about our legal terms?</h2>
                    <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                        If you have any questions regarding our terms or how we handle your data, please contact our legal team.
                    </p>
                    <Link href="/contact" className="px-8 py-4 bg-white text-blue-600 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-all inline-block">
                        Contact Support
                    </Link>
                </div>
            </main>
        </div>
    );
}
