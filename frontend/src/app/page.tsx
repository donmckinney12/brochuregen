"use client";
import React from 'react';
import LandingHero from '@/components/LandingHero';
import FeatureShowcase from '@/components/FeatureShowcase';
import FeaturedTemplates from '@/components/FeaturedTemplates';
import HowItWorks from '@/components/HowItWorks';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Rocket, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent-primary)]/30 selection:text-[var(--foreground)] transition-colors duration-500 overflow-hidden">
      <Navbar />

      {/* Hero Layer */}
      <LandingHero />

      {/* Content Layers */}
      <div className="space-y-32">
        <FeatureShowcase />

        <div id="templates">
          <FeaturedTemplates />
        </div>

        <HowItWorks />

        {/* Final Call to Action Matrix */}
        <section className="py-32 relative">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="premium-card p-16 space-y-10 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white border-transparent shadow-[0_40px_100px_rgba(79,70,229,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-tertiary)]/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

              <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-tight relative z-10">
                Ready to Synthesize Your <br />
                <span className="text-black/20">First Protocol?</span>
              </h2>

              <p className="text-xl font-bold text-white/80 max-w-2xl mx-auto italic relative z-10">
                Join 48,000+ marketers and developers automating their creative collateral with neural precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-12 py-6 bg-white text-[var(--accent-primary)] hover:bg-black hover:text-white rounded-[2rem] font-black uppercase tracking-widest italic shadow-xl transition-all flex items-center justify-center gap-3 group"
                >
                  <Rocket size={24} className="group-hover:rotate-12 transition-transform" />
                  Launch Studio
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-12 py-6 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 rounded-[2rem] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2"
                >
                  Login to Vault
                </Link>
              </div>

              <div className="pt-8 border-t border-white/20 flex flex-wrap items-center justify-center gap-8 relative z-10">
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 Neural Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Infinite Scalability</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Ambient Gloom Background */}
      <div className="fixed inset-0 pointer-events-none opacity-50 -z-20">
        <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[var(--accent-primary)]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[800px] h-[800px] bg-[var(--accent-secondary)]/5 blur-[150px] rounded-full" />
      </div>
    </main>
  );
}
