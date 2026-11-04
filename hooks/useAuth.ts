"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

// ── Shared In-Memory & Storage Cache ──────────────────────────────────────────
let globalCachedUser: User | null = null;
let globalCachedProfile: Profile | null = null;
let inFlightPromise: Promise<Profile | null> | null = null;
const listeners = new Set<() => void>();

// Try to hydrate from localStorage on client-side boot for instant 0ms renders
if (typeof window !== "undefined") {
    try {
        const storedProfile = localStorage.getItem("yat_cached_profile");
        if (storedProfile) {
            globalCachedProfile = JSON.parse(storedProfile);
        }
    } catch {}
}

function notifyListeners() {
    listeners.forEach(fn => fn());
}

export function mutateCachedProfile(partial: Partial<Profile>) {
    if (globalCachedProfile) {
        globalCachedProfile = { ...globalCachedProfile, ...partial };
        try {
            localStorage.setItem("yat_cached_profile", JSON.stringify(globalCachedProfile));
        } catch {}
        notifyListeners();
    }
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(() => globalCachedUser);
    const [profile, setProfile] = useState<Profile | null>(() => globalCachedProfile);
    const [loading, setLoading] = useState<boolean>(() => !globalCachedProfile && !globalCachedUser);
    const router = useRouter();

    const syncState = useCallback(() => {
        setUser(globalCachedUser);
        setProfile(globalCachedProfile);
        if (globalCachedUser || globalCachedProfile) {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        listeners.add(syncState);

        async function fetchProfile(userId: string): Promise<Profile | null> {
            if (inFlightPromise) return inFlightPromise;

            inFlightPromise = (async () => {
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("id, full_name, email, role, phone, linkedin, github, summary, profession, skills, college_name, company_name, tenth_percent, twelfth_percent, grad_cgpa, branch, active_backlogs, passing_year, experience, projects, certifications, achievements, created_at")
                        .eq("id", userId)
                        .single();

                    if (!error && data) {
                        globalCachedProfile = data as Profile;
                        try {
                            localStorage.setItem("yat_cached_profile", JSON.stringify(data));
                        } catch {}
                        notifyListeners();
                        return globalCachedProfile;
                    }
                } catch (e) {
                    console.warn("fetchProfile error:", e);
                } finally {
                    inFlightPromise = null;
                }
                return null;
            })();

            return inFlightPromise;
        }

        async function getSession() {
            try {
                // getSession reads instantly from client storage (no network delay)
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    globalCachedUser = session.user;
                    notifyListeners();
                    await fetchProfile(session.user.id);
                }
            } catch (err) {
                console.warn("getSession error:", err);
            } finally {
                setLoading(false);
            }
        }

        if (!globalCachedUser || !globalCachedProfile) {
            getSession();
        } else {
            // Already cached, verify in background without blocking UI
            getSession();
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
            if (session?.user) {
                globalCachedUser = session.user;
                notifyListeners();
                await fetchProfile(session.user.id);
            } else if (event === "SIGNED_OUT") {
                globalCachedUser = null;
                globalCachedProfile = null;
                try {
                    localStorage.removeItem("yat_cached_profile");
                } catch {}
                notifyListeners();
            }
            setLoading(false);
        });

        return () => {
            listeners.delete(syncState);
            subscription.unsubscribe();
        };
    }, [syncState]);

    const signOut = async () => {
        globalCachedUser = null;
        globalCachedProfile = null;
        try {
            localStorage.removeItem("yat_cached_profile");
        } catch {}
        notifyListeners();
        await supabase.auth.signOut();
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/";
    };

    return { user, profile, loading, signOut, mutateProfile: mutateCachedProfile };
}
