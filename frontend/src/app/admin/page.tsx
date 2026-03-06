"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats] = useState([
        { label: "Total Users", value: "1,284", change: "+12%", color: "blue" },
        { label: "Monthly Revenue", value: "$4,520", change: "+8%", color: "green" },
        { label: "AI Generations", value: "8,492", change: "+15%", color: "purple" },
        { label: "Conversion Rate", value: "3.2%", change: "+0.5%", color: "orange" },
    ]);

    // Simple security check (mock)
    if (user?.email !== 'don@mckinney.com') { // Assuming 'don@mckinney.com' is the admin
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
                <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md">
                    <div className="text-4xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-slate-500 mb-8">You do not have administrative privileges to access this area.</p>
                    <a href="/dashboard" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl">Back to Dashboard</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-slate-600 dark:text-slate-400">Manage your platform metrics and user accounts.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium shadow-sm">
                            Export CSV
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg">
                            System Health
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`}></div>
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">{stat.label}</h3>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-extrabold">{stat.value}</span>
                                <span className="text-green-500 text-sm font-bold">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* User List Mockup */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-xl">Recent Users</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-8 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">User</th>
                                    <th className="px-8 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Plan</th>
                                    <th className="px-8 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                                    <th className="px-8 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Credits</th>
                                    <th className="px-8 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {[1, 2, 3, 4, 5].map((u) => (
                                    <tr key={u} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">U{u}</div>
                                                <div>
                                                    <p className="font-bold">User {u}</p>
                                                    <p className="text-xs text-slate-500">user{u}@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${u % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {u % 2 === 0 ? 'Pro' : 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-sm">Active</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium">
                                            {u * 100} / 1000
                                        </td>
                                        <td className="px-8 py-5">
                                            <button className="text-blue-600 font-bold text-sm hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
                        <button className="text-slate-500 font-medium hover:text-blue-600 transition-colors">View all users</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
