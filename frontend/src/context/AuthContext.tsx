"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Plan = 'free' | 'pro' | null;

interface User {
    name: string;
    email: string;
    plan: Plan;
    credits: number; // For free tier (e.g. 1 free generation)
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    currentPlan: Plan;
    decrementCredits: () => void;
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
            credits: 1 // Give 1 free credit initially
        };
        setUser(newUser);
        localStorage.setItem('brochuregen_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('brochuregen_user');
    };

    const decrementCredits = () => {
        if (user) {
            const updatedUser = { ...user, credits: Math.max(0, user.credits - 1) };
            setUser(updatedUser);
            localStorage.setItem('brochuregen_user', JSON.stringify(updatedUser));
        }
    };

    const upgradeToPro = () => {
        if (user) {
            const updatedUser = { ...user, plan: 'pro' as Plan, credits: 9999 };
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
            decrementCredits,
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
