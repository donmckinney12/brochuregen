"use client";
import React from 'react';
import SuiteLayout from '@/components/SuiteLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <SuiteLayout>{children}</SuiteLayout>;
}
