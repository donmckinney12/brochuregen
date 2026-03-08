"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GenerationStudio from '@/components/GenerationStudio';
import SuiteLayout from '@/components/SuiteLayout';
import Navbar from '@/components/Navbar';
import FeaturedTemplates from '@/components/FeaturedTemplates';
import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // No forced redirect, allow users to view landing page even if authenticated
  // This allows the "Way back to home page" request to work naturally.

  if (isLoading) return null;

  return (
    <main className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent-primary)]/30 selection:text-[var(--foreground)] transition-colors duration-500">
      <Navbar />
      <div className="pt-32 px-8">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h1 className="text-7xl font-black text-[var(--foreground)] italic tracking-tighter uppercase leading-tight">
              Neural <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">Brochure</span> Flow
            </h1>
            <p className="text-[var(--foreground)]/80 font-bold tracking-[0.4em] uppercase text-sm">
              Convert Digital Assets into Print-Ready Genius
            </p>
          </div>
          <GenerationStudio />
          <FeaturedTemplates />
          <HowItWorks />
        </div>
      </div>
    </main>
  );
}
