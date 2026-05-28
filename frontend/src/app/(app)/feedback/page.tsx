"use client";
import React from 'react';
import FeedbackHub from '@/components/FeedbackHub';
import TierGuard from '@/components/TierGuard';

export default function FeedbackPage() {
    return (
        <>
            <TierGuard feature="FEEDBACK">
                <FeedbackHub />
            </TierGuard>
        </>
    );
}
