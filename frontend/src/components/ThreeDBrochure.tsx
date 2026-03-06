"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ThreeDBrochure({
    data,
    onOpenRefiner,
    activeVault
}: {
    data: any,
    onOpenRefiner?: (text: string, type: string) => void,
    activeVault?: { primaryColor: string; secondaryColor: string; font: string; logoUrl?: string } | null
}) {
    const [isHovered, setIsHovered] = useState(false);

    if (!data?.ai_content) return null;

    const { headline, subheadline, about_us, features, contact_info } = data.ai_content;
    const { bespoke_image, brand_logo, primary_color, secondary_color, brand_font } = data;

    const currentPrimary = activeVault?.primaryColor || primary_color || '#4F46E5';
    const currentSecondary = activeVault?.secondaryColor || secondary_color || '#EC4899';
    const currentFont = activeVault?.font || brand_font || 'Outfit';
    const currentLogo = activeVault?.logoUrl || brand_logo;
    const layout = data.layout_theme || 'modern';

    const getCoverBackground = () => {
        if (layout === 'classic') return `linear-gradient(180deg, ${currentSecondary} 0%, ${currentPrimary} 100%)`;
        if (layout === 'playful') return `radial-gradient(circle at top right, ${currentPrimary}, ${currentSecondary})`;
        return `linear-gradient(135deg, ${currentPrimary}, ${currentSecondary})`;
    };

    return (
        <div
            className="w-full h-[600px] flex items-center justify-center perspective-[2000px] cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative w-[300px] h-[450px] preserve-3d"
                animate={{
                    rotateY: isHovered ? -15 : -35,
                    rotateX: isHovered ? 5 : 10,
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            >
                {/* Right Panel (Front Cover) */}
                <motion.div
                    className="absolute inset-0 bg-white origin-left border border-slate-200 shadow-2xl overflow-hidden flex flex-col justify-center items-center p-8 z-30"
                    style={{
                        background: getCoverBackground(),
                        fontFamily: currentFont,
                        alignItems: layout === 'classic' ? 'flex-start' : 'center',
                        textAlign: layout === 'classic' ? 'left' : 'center'
                    }}
                    animate={{ rotateY: isHovered ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                >
                    <div className="absolute inset-0 bg-black/10 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                        {/* This constitutes the back of the front cover (Inside Right) */}
                        <div className="w-full h-full bg-slate-50 p-6 flex items-center justify-center">
                            <p className="text-slate-400 font-medium opacity-50">Inside Right Fold</p>
                        </div>
                    </div>

                    <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-white backface-visible">
                        <div className="w-16 h-16 mb-8 flex items-center justify-center bg-white/20 rounded-2xl backdrop-blur-md">
                            {currentLogo ? (
                                <img src={currentLogo} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                            ) : (
                                <span className="text-2xl font-bold">{headline?.[0]}</span>
                            )}
                        </div>

                        <h1
                            className="text-3xl font-extrabold mb-4 leading-tight hover:bg-white/10 rounded p-2 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onOpenRefiner?.(headline, 'headline'); }}
                        >
                            {headline}
                        </h1>
                        <p
                            className="text-sm opacity-90 hover:bg-white/10 rounded p-2 transition-colors"
                            onClick={(e) => { e.stopPropagation(); onOpenRefiner?.(subheadline, 'subheadline'); }}
                        >
                            {subheadline}
                        </p>

                        {bespoke_image && (
                            <div className="mt-8 relative w-full h-32 rounded-xl overflow-hidden shadow-inner">
                                <img src={bespoke_image} alt="Hero" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="mt-auto pt-8">
                            <span className="px-6 py-2 bg-white text-slate-900 text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                                Open
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Middle Panel (Back Cover) */}
                <div className="absolute inset-0 bg-white border border-slate-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between p-8 z-20 text-center text-slate-800">
                    <div style={{ fontFamily: currentFont }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">About Us</h3>
                        <p
                            className="text-sm leading-relaxed text-slate-600 hover:bg-slate-100 rounded p-2 transition-colors cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); onOpenRefiner?.(about_us, 'about_us'); }}
                        >
                            {about_us}
                        </p>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-8" style={{ fontFamily: currentFont }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: currentPrimary }}>Contact</h3>
                        <p className="font-bold text-lg">{contact_info}</p>
                    </div>

                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-auto font-bold opacity-50">
                        BrochureGen Premium
                    </div>
                </div>

                {/* Left Panel (Inside Flap) */}
                <motion.div
                    className="absolute inset-0 bg-white origin-right border border-slate-200 shadow-xl overflow-hidden p-8 z-10"
                    style={{ transform: 'translateX(-100%)' }}
                    animate={{ rotateY: isHovered ? -160 : 0 }}
                    transition={{ type: 'spring', stiffness: 30, damping: 20, delay: 0.1 }}
                >
                    <div className="absolute inset-0 bg-slate-50 backface-hidden" style={{ transform: 'rotateY(-180deg)' }}>
                        {/* Outside of the left fold */}
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center p-6 text-center">
                            <p className="text-slate-400 font-medium opacity-50 text-sm">Fold Inner Left</p>
                        </div>
                    </div>

                    <div className="relative z-10 w-full h-full backface-visible" style={{ fontFamily: currentFont }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: currentPrimary }}>Key Features</h3>
                        <ul className="space-y-4">
                            {features?.map((feature: string, i: number) => (
                                <li
                                    key={i}
                                    className={`text-sm bg-slate-50 p-4 ${layout === 'playful' ? 'rounded-3xl shadow-md border-b-4' : 'rounded-xl shadow-sm border'} border-slate-100 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex gap-3`}
                                    style={layout === 'playful' ? { borderBottomColor: currentSecondary } : {}}
                                    onClick={(e) => { e.stopPropagation(); onOpenRefiner?.(feature, 'feature'); }}
                                >
                                    <span className={`w-1.5 h-1.5 mt-1.5 shrink-0 ${layout === 'classic' ? 'rounded-none rotate-45' : 'rounded-full'}`} style={{ backgroundColor: currentSecondary }}></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

            </motion.div>

            {/* Hint text */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-sm font-medium flex items-center gap-2 pointer-events-none opacity-50">
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                Hover to interact
            </div>
        </div>
    );
}
