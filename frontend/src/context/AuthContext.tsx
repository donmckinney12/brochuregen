"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type Plan = 'free' | 'pro' | 'agency' | null;

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    plan: Plan;
    credits: number;
    refine_credits: number; // Snake case to match likely DB column
    brand_vault?: any;      // JSONB column
    created_at?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signInWithGoogle: () => Promise<{ error: any }>;
    signInWithPassword: (email: string, password: string) => Promise<{ data: any; error: any }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    currentPlan: Plan;
    deductCredit: (type: 'generate' | 'refine') => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async (userId: string, userEmail: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code === 'PGRST116') {
                // Profile doesn't exist? Create one (fallback)
                console.log("Profile missing, creating default...");
                const newProfile = {
                    id: userId,
                    email: userEmail,
                    plan: 'free',
                    credits: 5,
                    refine_credits: 0,
                    brand_vault: { active: false }
                };
                const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
                if (!insertError) setUser(newProfile as any);
            } else if (data) {
                setUser({
                    ...data,
                    // Map DB snake_case to what frontend expects if needed, or update frontend types
                    // For now, let's stick to the interface defined above
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        // 2. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                // router.push('/login'); // Optional: Force redirect
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    };

    const signInWithPassword = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        // We rely on the useEffect to create the profile if it doesn't exist, 
        // or we could create it here explicitly.
        return { data, error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // Temporary client-side deduction (Secure this later with RLS or Backend)
    const deductCredit = async (type: 'generate' | 'refine') => {
        if (!user || !session) return { success: false, error: 'Not logged in' };

        const currentBalance = type === 'generate' ? user.credits : user.refine_credits;
        const column = type === 'generate' ? 'credits' : 'refine_credits';

        if (currentBalance <= 0) {
            return { success: false, error: `Insufficient ${type} credits.` };
        }

        const { error } = await supabase
            .from('profiles')
            .update({ [column]: currentBalance - 1 })
            .eq('id', user.id);

        if (error) {
            return { success: false, error: error.message };
        }

        // Optimistic update or refetch
        await fetchProfile(user.id, user.email);
        return { success: true };
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isAuthenticated: !!session,
            isLoading,
            signInWithGoogle,
            signInWithPassword,
            signUp,
            signOut,
            refreshProfile: async () => { if (session?.user) await fetchProfile(session.user.id, session.user.email!) },
            currentPlan: user?.plan || null,
            deductCredit
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
