"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, ClipboardList, Sparkles, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";

interface Interview {
    id: string;
    role: string;
    avg_score: number;
    created_at: string;
}

export default function MyInterviewsPage() {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            const { data } = await supabase
                .from("interviews")
                .select("id, role, avg_score, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            setInterviews(data || []);
            setLoading(false);
        };
        fetch();
    }, [user]);

    const getVerdict = (score: number) => {
        const s = score * 10;
        if (s >= 75) return { label: "READY", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]" };
        if (s >= 50) return { label: "ALMOST", cls: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
        return { label: "NEEDS WORK", cls: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            {/* Header Banner */}
            <div className="relative rounded-3xl p-8 overflow-hidden border border-emerald-500/30 glass-emerald-card backdrop-blur-2xl shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic History
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sora">
                            Interview <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Vault & Telemetry</span>
                        </h1>
                        <p className="text-emerald-300/70 mt-2 max-w-xl text-sm leading-relaxed">
                            Review detailed multi-round performance telemetry, AI transcripts, and scoring metrics for all completed mock sessions.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/student/new"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] shrink-0 text-sm"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" /> Launch New Session
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-300/70 animate-pulse">Retrieving interview records...</p>
                </div>
            ) : interviews.length === 0 ? (
                <div className="glass-emerald-card text-center py-20 px-6 space-y-5 rounded-3xl border border-emerald-500/30">
                    <Trophy className="w-16 h-16 text-emerald-500/40 mx-auto" />
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white font-sora">No Interview History Found</h3>
                        <p className="text-sm text-emerald-300/70 max-w-md mx-auto">Initialize your first AI-evaluated mock interview session to unlock comprehensive diagnostic feedback.</p>
                    </div>
                    <Link 
                        href="/dashboard/student/new" 
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" /> Start Mock Interview
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {interviews.map((interview, i) => {
                        const score = Math.round((interview.avg_score || 0) * 10);
                        const { label, cls } = getVerdict(interview.avg_score || 0);
                        return (
                            <motion.div
                                key={interview.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 glass-emerald-card backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400 rounded-3xl transition-all duration-300 gap-4 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-extrabold text-emerald-400 text-base shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                        #{interviews.length - i}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors font-sora">{interview.role}</h3>
                                        <p className="text-xs text-emerald-300/60 mt-0.5">
                                            {new Date(interview.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-emerald-500/10 pt-4 sm:pt-0">
                                    <div className="text-right hidden sm:block">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2.5 bg-emerald-950/60 rounded-full overflow-hidden border border-emerald-500/20 p-0.5">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${score >= 75 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : score >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-extrabold text-white font-mono">{score}%</span>
                                        </div>
                                    </div>
                                    <span className={`px-3.5 py-1 rounded-xl text-[11px] font-bold border tracking-wider uppercase ${cls}`}>{label}</span>
                                    <button
                                        onClick={() => router.push(`/dashboard/student/results/${interview.id}`)}
                                        className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-400 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                                    >
                                        Analytics <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

