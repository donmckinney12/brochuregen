"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Plan = 'free' | 'pro' | 'agency' | null;

interface User {
    name: string;
    email: string;
    plan: Plan;
    credits: number; // Generation credits
    refineCredits: number; // AI tweak credits
    brandVault: {
        logo?: string;
        colors?: string[];
        active: boolean;
    };
    generationTimestamps: number[]; // For rate limiting
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    currentPlan: Plan;
    deductCredit: (type: 'generate' | 'refine') => { success: boolean; error?: string };
    upgradeToPro: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('brochuregen_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string) => {
        const newUser: User = {
            name: email.split('@')[0],
            email,
            plan: 'free',
            credits: 1, // 1 Generation credit
            refineCredits: 0, // 0 Refine credits for free tier
            brandVault: { active: false },
            generationTimestamps: []
        };
        setUser(newUser);
        localStorage.setItem('brochuregen_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('brochuregen_user');
    };

    const checkRateLimit = (timestamps: number[]) => {
        const oneHourAgo = Date.now() - 3600000;
        const recentGens = timestamps.filter(t => t > oneHourAgo);
        return recentGens.length < 10; // Limit: 10 per hour
    };

    const deductCredit = (type: 'generate' | 'refine') => {
        if (!user) return { success: false, error: 'Not logged in' };

        // 1. Check Rate Limit (Fair Use)
        if (type === 'generate') {
            if (!checkRateLimit(user.generationTimestamps)) {
                return { success: false, error: 'Rate limit reached (10/hour). Please try again later.' };
            }
        }

        // 2. Check & Deduct Credits
        let updatedUser = { ...user };

        if (type === 'generate') {
            if (user.credits <= 0) return { success: false, error: 'Insufficient generation credits.' };
            updatedUser.credits -= 1;
            updatedUser.generationTimestamps = [...user.generationTimestamps, Date.now()];
        } else if (type === 'refine') {
            if (user.refineCredits <= 0 && user.plan !== 'agency') { // Agency might have unlimited
                return { success: false, error: 'Insufficient refine credits.' };
            }
            if (user.plan !== 'agency') {
                updatedUser.refineCredits -= 1;
            }
        }

        setUser(updatedUser);
        localStorage.setItem('brochuregen_user', JSON.stringify(updatedUser));
        return { success: true };
    };

    const upgradeToPro = () => {
        if (user) {
            const updatedUser: User = {
                ...user,
                plan: 'pro',
                credits: 25,
                refineCredits: 10,
                brandVault: { active: true, colors: ['#2563EB', '#1E40AF', '#F3F4F6'] } // Mock brand data
            };
            setUser(updatedUser);
            localStorage.setItem('brochuregen_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            currentPlan: user?.plan || null,
            deductCredit,
            upgradeToPro
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
