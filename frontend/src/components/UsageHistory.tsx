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

    if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-20 bg-[var(--foreground)]/5 rounded-xl w-full"></div></div>;

    if (brochures.length === 0) {
        return (
            <div className="bg-[var(--background)]/60 rounded-2xl border border-[var(--glass-border)] p-12 text-center border-dashed backdrop-blur-md">
                <div className="w-16 h-16 bg-[var(--foreground)]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--foreground)]/20 border border-[var(--glass-border)]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-[var(--foreground)] mb-2 uppercase tracking-tighter">Void History</h4>
                <p className="text-[var(--foreground)]/40 mb-6 max-w-sm mx-auto text-sm">Synchronize with the network to generate your first document.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {brochures.map((item: any) => (
                <div key={item.id} className="premium-card overflow-hidden hover:shadow-[var(--accent-primary)]/10 transition-all group border-[var(--glass-border)]">
                    <div className="aspect-[3/4] bg-[var(--background)]/40 relative overflow-hidden flex items-center justify-center border-b border-[var(--glass-border)]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 group-hover:opacity-100 opacity-60 transition-opacity"></div>
                        <svg className="w-12 h-12 text-[var(--foreground)]/10 group-hover:text-[var(--accent-primary)]/20 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 w-[70%]" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h4 className="font-black text-[var(--foreground)] truncate uppercase tracking-tighter mb-1 select-none">{item.title || 'Untitled Prototype'}</h4>
                        <p className="text-[10px] text-[var(--accent-primary)] font-bold mb-4 truncate italic opacity-50">{item.url}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                            <span className="text-[10px] text-[var(--foreground)]/40 font-bold uppercase tracking-widest">
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex gap-1">
                                <button className="p-2 text-[var(--foreground)]/40 hover:text-[var(--accent-primary)] transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                </button>
                                <button className="p-2 text-[var(--foreground)]/40 hover:text-[var(--accent-secondary)] transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
