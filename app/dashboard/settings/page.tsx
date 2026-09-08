"use client";

import { useState } from "react";
import { User, Mail, Shield, Save, Bell, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
    const { profile } = useAuth();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header Banner */}
            <div className="relative rounded-3xl p-8 overflow-hidden border border-emerald-500/30 glass-emerald-card backdrop-blur-2xl shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> Candidate Control Room
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sora">
                            Account <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Settings</span>
                        </h1>
                        <p className="text-emerald-300/70 mt-2 text-sm max-w-lg leading-relaxed">
                            Configure security preferences, notification triggers, and candidate identity attributes.
                        </p>
                    </div>
                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Shield className="w-8 h-8" />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-emerald-500/30 glass-emerald-card backdrop-blur-xl p-8 md:p-10 shadow-2xl">
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="flex items-center gap-5 pb-8 border-b border-emerald-500/20">
                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.2)] font-black text-2xl font-sora">
                            {profile?.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white font-sora tracking-wide">{profile?.full_name || "Candidate User"}</h3>
                            <p className="text-emerald-300/70 text-sm font-medium mt-0.5">{profile?.college_name || "Institutional Affiliate"}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                                Role: Candidate
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <User className="w-4 h-4 text-emerald-400" /> Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue={profile?.full_name || ""}
                                className="w-full glass-emerald-input border border-emerald-500/30 rounded-2xl p-4 text-white outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <Mail className="w-4 h-4 text-emerald-400" /> Account Email
                            </label>
                            <input
                                type="email"
                                disabled
                                defaultValue={profile?.email || ""}
                                className="w-full glass-emerald-subcard border border-emerald-500/20 rounded-2xl p-4 text-emerald-400/60 font-mono text-sm cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-emerald-500/20">
                        <h4 className="font-bold text-white flex items-center gap-2.5 font-sora">
                            <Bell className="w-5 h-5 text-emerald-400" /> System Notification Preferences
                        </h4>
                        <label className="flex items-center gap-4 p-5 border border-emerald-500/30 rounded-2xl glass-emerald-subcard cursor-pointer hover:border-emerald-400 transition-all">
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-400 rounded cursor-pointer" />
                            <div>
                                <p className="font-bold text-sm text-white">Mock Interview Diagnostic Alerts</p>
                                <p className="text-xs text-emerald-300/70 mt-0.5">Receive immediate notifications when your AI evaluation reports and competency DNA cards are generated.</p>
                            </div>
                        </label>
                    </div>

                    <div className="pt-6 border-t border-emerald-500/20 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] flex items-center gap-2 text-sm disabled:opacity-50 font-sora"
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                            ) : saved ? (
                                <><CheckCircle2 className="w-4 h-4 text-slate-950" /> Preferences Saved</>
                            ) : (
                                <><Save className="w-4 h-4 stroke-[2.5]" /> Save Preferences</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

