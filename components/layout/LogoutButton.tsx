"use client";

import { LogOut } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || "",
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
            );

            // Clear the Supabase session from cookies/localStorage
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            sessionStorage.clear();
            localStorage.clear();

            // Use Next.js router to navigate back to the landing page
            router.push("/");
            // Refresh to ensure server components see the auth change
            router.refresh();
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-text-secondary hover:bg-accent-red/10 hover:text-accent-red transition-colors font-medium"
        >
            <LogOut className="w-5 h-5" />
            Logout
        </button>
    );
}
