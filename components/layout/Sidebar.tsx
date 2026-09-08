"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    Dna,
    Settings,
    Users,
    Building2,
    GraduationCap,
    Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/types";
import LogoutButton from "./LogoutButton";
import { motion } from "framer-motion";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["candidate", "student"] },
    { label: "My Interviews", href: "/dashboard/interviews", icon: <ClipboardList className="w-5 h-5" />, roles: ["candidate", "student"] },
    { label: "My DNA Cards", href: "/dashboard/dna-cards", icon: <Dna className="w-5 h-5" />, roles: ["candidate", "student"] },
    { label: "Profile", href: "/dashboard/profile", icon: <Users className="w-5 h-5" />, roles: ["candidate", "student"] },
    { label: "Academic Profile", href: "/dashboard/profile/verify", icon: <GraduationCap className="w-5 h-5" />, roles: ["candidate", "student"] },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" />, roles: ["candidate", "student"] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, profile } = useAuth();

    const role = profile?.role || user?.user_metadata?.role || "candidate";
    const filteredNav = navItems.filter(item => item.roles.includes(role));

    const getInitials = (name: string, email?: string) => {
        if (name && name.trim()) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        if (email) return email[0].toUpperCase();
        return "C";
    };

    return (
        <aside className="w-64 glass-emerald-card border-r border-emerald-500/20 h-screen flex flex-col fixed left-0 top-0 z-40 backdrop-blur-2xl">
            <div className="p-6 flex-1 flex flex-col min-h-0">
                {/* Brand Logo */}
                <Link href="/dashboard" className="flex items-center gap-3 mb-8 group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <div className="w-full h-full bg-[#030806] rounded-[15px] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-sora tracking-tight text-white flex items-center gap-1">
                            YAT <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 font-extrabold">AI</span>
                        </span>
                        <span className="text-[10px] text-emerald-400/80 font-mono uppercase tracking-widest font-semibold">Candidate Hub</span>
                    </div>
                </Link>

                {/* Account Profile Box */}
                {profile && (
                    <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-center gap-3 relative overflow-hidden group hover:border-emerald-400/50 transition-all shadow-md">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                                {getInitials(profile.full_name, profile.email)}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030806] animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate text-white group-hover:text-emerald-400 transition-colors">
                                {profile.full_name || "Candidate Account"}
                            </p>
                            <p className="text-[11px] text-emerald-300/70 truncate">{profile.email}</p>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                    {filteredNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all text-sm font-bold group ${
                                    isActive
                                        ? "text-white bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                        : "text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute left-0 w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                                    />
                                )}
                                <span className={`transition-transform duration-200 ${isActive ? "text-emerald-400 scale-110" : "group-hover:scale-110 text-slate-400 group-hover:text-emerald-300"}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Logout Footer */}
            <div className="p-5 border-t border-emerald-500/20 bg-emerald-950/20">
                <LogoutButton />
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-emerald-400/70 uppercase tracking-widest font-mono font-semibold">
                    <span>⚡</span>
                    <span>AI Practice Engine v2.0</span>
                </div>
            </div>
        </aside>
    );
}
