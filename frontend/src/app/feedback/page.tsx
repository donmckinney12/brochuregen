"use client";
import React from 'react';
import SuiteLayout from '@/components/SuiteLayout';
import FeedbackHub from '@/components/FeedbackHub';
import TierGuard from '@/components/TierGuard';

export default function FeedbackPage() {
    return (
        <SuiteLayout>
            <TierGuard feature="FEEDBACK">
                <FeedbackHub />
            </TierGuard>
        </SuiteLayout>
    );
}
