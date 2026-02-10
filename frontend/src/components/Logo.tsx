import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                    src="/logo.png"
                    alt="BrochureGen Logo"
                    fill
                    className="object-contain"
                />
            </div>
            {showText && (
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                    Brochure<span className="font-light text-slate-500 dark:text-slate-400">Gen</span>
                </span>
            )}
        </div>
    );
}
