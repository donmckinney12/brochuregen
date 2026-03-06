"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function UsageHistory() {
    const { user, getToken } = useAuth();
    const [brochures, setBrochures] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrochures = async () => {
            if (!user?.id) return;
            try {
                const token = await getToken();
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/brochures/?user_id=${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setBrochures(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching history:", error);
                setBrochures([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrochures();
    }, [user?.id, getToken]);

    if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div></div>;

    if (brochures.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center border-dashed">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No brochures yet</h4>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Generate your first brochure above to see it appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brochures.map((item: any) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-lg truncate pr-4">{item.title}</h4>
                            <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                                Generated
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 truncate">{item.url}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                            <span className="text-xs text-slate-400">
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
