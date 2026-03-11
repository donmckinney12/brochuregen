"use client";
import React from 'react';
import SuiteLayout from '@/components/SuiteLayout';
import InsightsDashboard from '@/components/InsightsDashboard';

export default function InsightsPage() {
    return (
        <SuiteLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Studio Insights</h1>
                    <p className="text-[var(--foreground)]/80 font-bold tracking-[0.3em] uppercase mt-2 text-xs italic">
                        Real-Time Performance Metrics & Neural Resonance Analysis
                    </p>
                </div>
                <InsightsDashboard />
            </div>
        </SuiteLayout>
    );
}
