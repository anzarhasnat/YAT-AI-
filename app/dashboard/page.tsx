"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Clock, Trophy, CheckCircle, BarChart3, ArrowUpRight, Cpu, TrendingUp, GraduationCap, AlertTriangle, Sparkles, Activity, FileText, Zap, ShieldCheck, PlayCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Interview {
    id: string;
    role: string;
    avg_score: number;
    created_at: string;
    drive_id: string | null;
    drives: { results_published: boolean } | null;
}

export default function CandidateDashboard() {
    const { profile, user } = useAuth();
    const firstName = profile?.full_name?.split(" ")[0] || "Candidate";
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loadingInterviews, setLoadingInterviews] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        const fetchInterviews = async () => {
            const { data } = await supabase
                .from("interviews")
                .select("id, role, avg_score, created_at, drive_id, drives(results_published)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(10);
            setInterviews(data || []);
            setLoadingInterviews(false);
        };
        fetchInterviews();
    }, [user]);

    // Derive stats from real data
    const totalInterviews = interviews.length;
    const avgScore = interviews.length
        ? Math.round(interviews.reduce((s: number, i: any) => s + (i.avg_score || 0), 0) / interviews.length * 10)
        : 0;
    const bestScore = interviews.length
        ? Math.max(...interviews.map((i: any) => (i.avg_score || 0) * 10))
        : 0;
    const passedCount = interviews.filter((i: any) => (i.avg_score || 0) >= 7).length;

    // Skill DNA: extract unique keywords from all interview roles
    const skillDNA = Array.from(new Set(
        interviews.flatMap((i: any) =>
            i.role.split(/[\s,/&]+/).filter((w: string) => w.length > 2)
        )
    )).slice(0, 16);

    const chartData = [...interviews]
        .slice(0, 6)
        .reverse()
        .map((inv: any, idx: number) => ({
            name: `Test ${idx + 1}`,
            score: (inv.avg_score || 0) * 10,
            role: inv.role.length > 15 ? inv.role.substring(0, 15) + "..." : inv.role
        }));

    const getVerdict = (score: number) => {
        const s = score * 10;
        if (s >= 75) return { label: "QUALIFIED", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]" };
        if (s >= 50) return { label: "REVIEW", cls: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
        return { label: "RETRY", cls: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Top Telemetry Status Command Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 glass-emerald-card rounded-2xl border border-emerald-500/30">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                    <div>
                        <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">Candidate Diagnostic Pulse: Online</p>
                        <p className="text-xs text-emerald-200/80 font-medium">Bioluminescent Technical Practice Engine Active</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 glass-emerald-subcard px-3.5 py-1.5 rounded-xl text-xs font-mono text-emerald-300">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Completed: <strong className="text-white">{totalInterviews}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 glass-emerald-subcard px-3.5 py-1.5 rounded-xl text-xs font-mono text-emerald-300">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Best Score: <strong className="text-white">{bestScore}%</strong></span>
                    </div>
                </div>
            </div>

            {/* Academic Profile Verification Warning if missing CGPA */}
            {profile && !(profile as any).grad_cgpa && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 glass-emerald-card border border-amber-500/40 bg-amber-950/20 rounded-2xl"
                >
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-amber-500/20 rounded-xl shrink-0 mt-0.5 border border-amber-500/30 text-amber-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-amber-400 text-sm font-sora">Candidate Verification Pending</p>
                            <p className="text-xs text-emerald-200/80 mt-0.5">
                                Complete your 10th %, 12th %, CGPA, and Active Backlogs profile to finalize your candidate credentials.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/profile/verify"
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                        <GraduationCap className="w-4 h-4 stroke-[2.5]" />
                        Complete Profile
                    </Link>
                </motion.div>
            )}

            {/* Asymmetric 2-Column Main Command Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT WORKSPACE (7 Columns) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Hero Spotlight Command Pod */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden p-8 md:p-10 rounded-3xl glass-emerald-card border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-2xl"
                    >
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-semibold text-emerald-400 uppercase">
                                    <Sparkles className="w-3.5 h-3.5" /> Candidate Readiness Matrix
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black font-sora text-white tracking-tight leading-tight">
                                    Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">{firstName}</span>
                                </h1>
                                <p className="text-emerald-300/80 text-sm max-w-lg leading-relaxed">
                                    {totalInterviews === 0
                                        ? "Calibrate your target software domain and launch your first multi-round AI evaluation."
                                        : `You have completed ${totalInterviews} technical mock interview session${totalInterviews > 1 ? 's' : ''} with an average score of ${avgScore}%.`}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                                <Link
                                    href="/dashboard/student/new"
                                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:shadow-[0_0_40px_rgba(52,211,153,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all text-sm font-sora"
                                >
                                    <Plus className="w-5 h-5 stroke-[3]" />
                                    <span>Launch Mock Evaluation</span>
                                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                                </Link>

                                <Link
                                    href="/dashboard/interviews"
                                    className="inline-flex items-center justify-center gap-2 glass-emerald-subcard hover:border-emerald-400 text-emerald-300 font-bold px-6 py-4 rounded-2xl transition-all text-sm"
                                >
                                    <Clock className="w-4 h-4 text-emerald-400" />
                                    <span>Session History</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive 5-Round Technical Evaluation Studio */}
                    <div className="glass-emerald-card rounded-3xl p-7 border border-emerald-500/30 space-y-6">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold font-sora text-white">5-Round Evaluation Studio</h2>
                                    <p className="text-xs text-emerald-300/70">Sequential candidate assessment pipeline</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold rounded-full border border-emerald-500/30">
                                Automated Scoring
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                            {[
                                { round: "01", name: "Aptitude", detail: "Logic & Quant" },
                                { round: "02", name: "Technical", detail: "CS Fundamentals" },
                                { round: "03", name: "Resume", detail: "Project Probe" },
                                { round: "04", name: "Coding", detail: "Live Algorithms" },
                                { round: "05", name: "Behavioral", detail: "Communication" },
                            ].map((r) => (
                                <div
                                    key={r.round}
                                    className="p-4 glass-emerald-subcard border border-emerald-500/20 rounded-2xl text-center space-y-1.5 hover:border-emerald-400 transition-all group"
                                >
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">R{r.round}</span>
                                    <p className="text-xs font-bold text-white font-sora group-hover:text-emerald-300 transition-colors">{r.name}</p>
                                    <p className="text-[10px] text-emerald-300/60 truncate">{r.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Telemetry Graph */}
                    <div className="glass-emerald-card rounded-3xl p-7 border border-emerald-500/30 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold font-sora text-white">Score Trajectory</h2>
                                    <p className="text-xs text-emerald-300/70">Candidate percentage trend across sessions</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-56">
                            {chartData.length > 1 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#030806', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '16px', color: '#FFF' }}
                                            labelStyle={{ color: '#86EFAC', marginBottom: '4px' }}
                                            formatter={(value: any) => [`${value}%`, 'Score']}
                                            labelFormatter={(label, payload) => payload?.[0]?.payload?.role || label}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#34D399"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorEmerald)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-emerald-300/60 text-xs space-y-2 py-8">
                                    <BarChart3 className="w-10 h-10 opacity-30 text-emerald-400" />
                                    <p className="text-xs text-emerald-300/60">Complete 2 or more tests to plot your score trajectory curve.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COMMAND SIDEBAR (5 Columns) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Saved Resume 1-Click Vault Pod */}
                    <div className="glass-emerald-card rounded-3xl p-7 border border-emerald-500/30 space-y-5">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold font-sora text-white">Saved Resume Vault</h2>
                                    <p className="text-xs text-emerald-300/70">Instant profile auto-seeding</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold rounded-full border border-emerald-500/30">
                                1-Click Load
                            </span>
                        </div>

                        <p className="text-xs text-emerald-200/80 leading-relaxed">
                            {profile?.resume_role
                                ? `Saved Target Role: "${profile.resume_role}". Uploading new PDFs updates your saved candidate telemetry.`
                                : "Upload a PDF resume during your next interview setup to save it to your profile for 1-click loading."}
                        </p>

                        <Link
                            href="/dashboard/student/new"
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3.5 rounded-2xl transition-all text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        >
                            <PlayCircle className="w-4 h-4 text-slate-950" />
                            <span>Quick Start with Saved Resume</span>
                        </Link>
                    </div>

                    {/* Skill Genome Matrix Cloud */}
                    {skillDNA.length > 0 && (
                        <div className="glass-emerald-card rounded-3xl p-7 border border-emerald-500/30 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold font-sora text-white flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-400" /> Skill Genome Matrix
                                </h3>
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                    {skillDNA.length} Verified Skills
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skillDNA.map(skill => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-emerald-subcard border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Sessions Feed */}
                    <div className="glass-emerald-card rounded-3xl p-7 border border-emerald-500/30 space-y-5">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                            <h3 className="text-base font-bold font-sora text-white">Recent Evaluation Vault</h3>
                            <Link href="/dashboard/interviews" className="text-xs font-bold text-emerald-400 hover:underline">
                                View All ({interviews.length})
                            </Link>
                        </div>

                        {loadingInterviews ? (
                            <p className="text-xs text-emerald-300/60 animate-pulse text-center py-6">Retrieving sessions...</p>
                        ) : interviews.length === 0 ? (
                            <div className="text-center py-8 space-y-3">
                                <Sparkles className="w-8 h-8 text-emerald-400/40 mx-auto" />
                                <p className="text-xs text-emerald-200/80">No mock sessions completed yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {interviews.slice(0, 4).map(inv => {
                                    const score = Math.round((inv.avg_score || 0) * 10);
                                    const { label, cls } = getVerdict(inv.avg_score || 0);
                                    return (
                                        <div
                                            key={inv.id}
                                            onClick={() => router.push(`/dashboard/student/results/${inv.id}`)}
                                            className="p-4 glass-emerald-subcard border border-emerald-500/20 rounded-2xl flex items-center justify-between hover:border-emerald-400 transition-all cursor-pointer group"
                                        >
                                            <div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors font-sora">{inv.role}</h4>
                                                <p className="text-[10px] text-emerald-300/60 mt-0.5">
                                                    {new Date(inv.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-black text-white font-mono">{score}%</span>
                                                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${cls}`}>{label}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

