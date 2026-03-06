"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type Plan = 'free' | 'pro' | 'agency' | 'enterprise' | null;

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    plan: Plan;
    credits: number;
    refine_credits: number;
    brand_logo_url?: string;
    brand_primary_color?: string;
    brand_secondary_color?: string;
    brand_font?: string;
    brand_voice_tone?: string;
    brand_voice_calibration?: string;
    created_at?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    currentPlan: Plan;
    deductCredit: (type: 'generate' | 'refine') => Promise<{ success: boolean; error?: string }>;
    getToken: (options?: any) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
    const { signOut: clerkSignOut } = useClerk();
    const { getToken } = useClerkAuth();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const router = useRouter();

    const fetchProfile = async () => {
        console.log("🔄 Starting fetchProfile...");
        if (!clerkUser) {
            console.log("ℹ️ No Clerk user found, skipping fetchProfile");
            setUser(null);
            setIsLoadingProfile(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn("⚠️ fetchProfile timed out after 30s");
            controller.abort();
            setIsLoadingProfile(false);
        }, 30000);

        try {
            console.log("🛡️ Getting Clerk token...");
            const token = await getToken();
            if (!token) {
                console.error("❌ Failed to get Clerk token");
                setIsLoadingProfile(false);
                return;
            }
            console.log("🎟️ Token received, prefix:", token.substring(0, 10));

            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            console.log(`🌐 Syncing with backend: ${apiBase}/api/v1/profiles/`);

            const response = await fetch(`${apiBase}/api/v1/profiles/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                signal: controller.signal,
                body: JSON.stringify({
                    id: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress,
                    full_name: clerkUser.fullName,
                    plan: 'free',
                    credits: 10,
                    refine_credits: 5
                })
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Profile fetched successfully:", data.id);
                setUser(data);
                console.log("📊 Fetched plan:", data.plan);
            } else {
                const errText = await response.text();
                console.error(`❌ Backend error (${response.status}):`, errText);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error("❌ Profile fetch aborted due to timeout");
            } else {
                console.error("❌ Error fetching profile:", error);
            }
        } finally {
            setIsLoadingProfile(false);
            console.log("🏁 fetchProfile finished");
        }
    };

    useEffect(() => {
        if (isClerkLoaded) {
            fetchProfile();
        }
    }, [clerkUser?.id, isClerkLoaded]);

    const signOut = async () => {
        await clerkSignOut();
        setUser(null);
        router.push('/');
    };

    const deductCredit = async (type: 'generate' | 'refine') => {
        if (!user) return { success: false, error: 'Not logged in' };

        try {
            const token = await getToken();
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiBase}/api/v1/profiles/deduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.id,
                    type: type
                })
            });

            if (response.ok) {
                const data = await response.json();
                setUser(prev => prev ? { ...prev, credits: data.new_balance } : null);
                return { success: true };
            } else {
                const err = await response.json();
                return { success: false, error: err.detail || 'Failed to deduct credits' };
            }
        } catch (error) {
            return { success: false, error: 'Connection error' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!isSignedIn,
            isLoading: !isClerkLoaded || isLoadingProfile,
            signOut,
            refreshProfile: fetchProfile,
            currentPlan: user?.plan || null,
            deductCredit,
            getToken
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
