"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingWizard() {
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('onboarding_complete');
        if (!hasSeenOnboarding) {
            setIsVisible(true);
        }
    }, []);

    const completeOnboarding = () => {
        localStorage.setItem('onboarding_complete', 'true');
        setIsVisible(false);
    };

    const steps = [
        {
            title: "Welcome to BrochureGen! 🚀",
            content: "Generate professional, high-converting brochures from any website URL in seconds using AI.",
            button: "Next",
        },
        {
            title: "1. Paste a URL",
            content: "Just copy the link to any business website and paste it into the generator on your dashboard.",
            button: "Got it",
        },
        {
            title: "2. AI Magic",
            content: "Our AI will scrape the site, extract key information, and write compelling copy tailored to your brand.",
            button: "Almost there",
        },
        {
            title: "3. Download & Print",
            content: "Once generated, you can refine the content or download a print-ready PDF immediately.",
            button: "Let's Go!",
        }
    ];

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
                <div className="bg-blue-600 h-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        className="bg-blue-400 h-full"
                    />
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="min-h-[160px]"
                        >
                            <h2 className="text-2xl font-bold mb-4">{steps[step].title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                {steps[step].content}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}></div>
                            ))}
                        </div>

                        <button
                            onClick={step === steps.length - 1 ? completeOnboarding : () => setStep(step + 1)}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            {steps[step].button}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
