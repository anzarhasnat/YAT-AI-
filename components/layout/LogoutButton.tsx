"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { clearAuthCache } from "@/hooks/useAuth";

export default function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);

        try {
            // 1. Immediately clear in-memory caches and client storage
            clearAuthCache();
            try {
                sessionStorage.clear();
                localStorage.clear();
            } catch {}

            // 2. Clear all auth cookies immediately
            if (typeof document !== "undefined") {
                document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
            }

            // 3. Notify Supabase with a 500ms maximum timeout so it never hangs
            try {
                await Promise.race([
                    supabase.auth.signOut({ scope: "local" }),
                    new Promise((resolve) => setTimeout(resolve, 500))
                ]);
            } catch (error) {
                console.warn("Supabase signOut error:", error);
            }
        } finally {
            // 4. Force hard redirect to home immediately, clearing all state
            window.location.replace("/");
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors font-medium text-sm group disabled:opacity-60 cursor-pointer"
        >
            {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin text-rose-400" />
            ) : (
                <LogOut className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            )}
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
    );
}
