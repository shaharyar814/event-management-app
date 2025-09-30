"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClientSupabase } from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase/types';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClientSupabase();

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                // Don't return early - still set loading to false
                setProfile(null);
                return;
            }

            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
        }
    }, [supabase]);

    useEffect(() => {
        let isMounted = true;

        // Set a timeout to ensure loading state doesn't get stuck
        const loadingTimeout = setTimeout(() => {
            if (isMounted) {
                console.warn('Auth loading timeout - forcing loading to false');
                setLoading(false);
            }
        }, 5000); // 5 second timeout

        // Get initial session
        const getInitialSession = async () => {
            try {
                console.log('Getting initial session...');

                // Check if Supabase is properly configured
                if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                    console.error('Supabase environment variables not configured');
                    if (isMounted) {
                        setLoading(false);
                        clearTimeout(loadingTimeout);
                    }
                    return;
                }

                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Error getting session:', error);
                }

                if (isMounted) {
                    setSession(session);
                    setUser(session?.user ?? null);

                    if (session?.user) {
                        console.log('User found, fetching profile...');
                        await fetchProfile(session.user.id);
                    } else {
                        console.log('No user found');
                    }

                    setLoading(false);
                    clearTimeout(loadingTimeout);
                }
            } catch (error) {
                console.error('Error getting initial session:', error);
                if (isMounted) {
                    setLoading(false);
                    clearTimeout(loadingTimeout);
                }
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.id);
                try {
                    if (isMounted) {
                        setSession(session);
                        setUser(session?.user ?? null);

                        if (session?.user) {
                            await fetchProfile(session.user.id);
                        } else {
                            setProfile(null);
                        }

                        setLoading(false);
                        clearTimeout(loadingTimeout);
                    }
                } catch (error) {
                    console.error('Error in auth state change:', error);
                    if (isMounted) {
                        setLoading(false);
                        clearTimeout(loadingTimeout);
                    }
                }
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            clearTimeout(loadingTimeout);
        };
    }, [supabase.auth, fetchProfile]);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { error };
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: new Error('No user logged in') };

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (!error) {
            setProfile(prev => prev ? { ...prev, ...updates } : null);
        }

        return { error };
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
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
