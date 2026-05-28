"use client";
import React from 'react';
import LeadsVault from '@/components/LeadsVault';
import TierGuard from '@/components/TierGuard';

export default function LeadsPage() {
    return (
        <>
            <TierGuard feature="LEADS">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Leads Vault</h1>
                        <p className="text-[var(--foreground)]/80 font-bold tracking-[0.3em] uppercase mt-2 text-xs italic">
                            Institutional Prospect Management & Neural Follow-up Sequences
                        </p>
                    </div>
                    <LeadsVault />
                </div>
            </TierGuard>
        </>
    );
}
