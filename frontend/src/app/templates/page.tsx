"use client";
import React from 'react';
import SuiteLayout from '@/components/SuiteLayout';
import FeaturedTemplates from '@/components/FeaturedTemplates';

export default function TemplatesPage() {
    return (
        <SuiteLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[var(--foreground)] italic tracking-tighter uppercase">Visual Layouts</h1>
                    <p className="text-[var(--foreground)]/80 font-bold tracking-[0.3em] uppercase mt-2 text-xs italic">
                        High-Fidelity Neural Templates for Global Deployment
                    </p>
                </div>
                <FeaturedTemplates />
            </div>
        </SuiteLayout>
    );
}
