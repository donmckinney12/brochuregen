"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function RoadmapPage() {
    const roadmapItems = [
        {
            status: "In Progress",
            title: "Multi-language Support",
            description: "Generate brochures in over 20 languages with native AI localization.",
            votes: 142,
            icon: "🌐"
        },
        {
            status: "Next",
            title: "Template Editor",
            description: "Drag-and-drop editor to customize the layout and design of your PDF brochures.",
            votes: 284,
            icon: "🎨"
        },
        {
            status: "Planned",
            title: "Team Collaboration",
            description: "Invite team members and share brochures across your organization.",
            votes: 95,
            icon: "👥"
        },
        {
            status: "Investigating",
            title: "Direct Social Mailing",
            description: "Automatically post your brochures to LinkedIn, Facebook, and Instagram.",
            votes: 110,
            icon: "📱"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-40 pb-20 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider mb-6 inline-block">
                        What's Coming
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Product Roadmap</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        See what we're building and vote on the features that matter most to you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roadmapItems.map((item, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-4xl">{item.icon}</div>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${item.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                                            item.status === 'Next' ? 'bg-green-100 text-green-700' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                                    <span className="font-bold">{item.votes} votes</span>
                                </div>
                                <button className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all">
                                    Vote
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 mb-6">Have a feature request that isn't here?</p>
                    <Link href="/contact" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        Suggest a feature &rarr;
                    </Link>
                </div>
            </main>
        </div>
    );
}
