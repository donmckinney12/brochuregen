import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">B</span>
            </div>
            {showText && (
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                    Brochure<span className="font-light text-slate-500 dark:text-slate-400">Gen</span>
                </span>
            )}
        </div>
    );
}
