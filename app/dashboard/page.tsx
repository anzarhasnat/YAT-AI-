"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Clock, Trophy, CheckCircle, BarChart3, ArrowUpRight, Cpu, TrendingUp, GraduationCap, AlertTriangle, Sparkles, Activity, FileText, Zap, ShieldCheck, PlayCircle, Eye, ExternalLink, X, RefreshCw, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    const [savedResume, setSavedResume] = useState<any>(null);
    const [loadingSavedResume, setLoadingSavedResume] = useState(true);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [activePreviewTab, setActivePreviewTab] = useState<'pdf' | 'skills' | 'text'>('pdf');
    const [launchingInterview, setLaunchingInterview] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchSavedResume = async () => {
            try {
                const res = await fetch("/api/resume/saved");
                const data = await res.json();
                if (data.success && data.hasSavedResume) {
                    setSavedResume(data);
                    if (!data.fileUrl) {
                        setActivePreviewTab('skills');
                    }
                }
            } catch (e) {
                console.warn("Could not fetch saved resume in dashboard:", e);
            } finally {
                setLoadingSavedResume(false);
            }
        };
        fetchSavedResume();
    }, []);

    const handleLaunchSavedInterview = () => {
        if (!savedResume?.data) {
            router.push("/dashboard/student/new");
            return;
        }
        setLaunchingInterview(true);
        const targetRole =
            savedResume.data.detectedIndustry ||
            savedResume.data.experience?.[0]?.role ||
            profile?.resume_role ||
            "Full Stack Developer";

        const setupData = {
            role: targetRole,
            domain: targetRole,
            experience: "Freshers/Entry-Level",
            pattern: "Standard",
            mode: "practice",
            driveRegId: null,
            driveId: null
        };

        sessionStorage.setItem("interview_setup", JSON.stringify(setupData));
        sessionStorage.setItem("current_interview_config", JSON.stringify({ role: targetRole }));
        sessionStorage.setItem("parsed_resume", JSON.stringify(savedResume.data));

        router.push("/interview/session/round-1");
    };

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

                        {loadingSavedResume ? (
                            <div className="py-4 text-center">
                                <p className="text-xs text-emerald-300/60 animate-pulse font-mono">Syncing saved telemetry...</p>
                            </div>
                        ) : savedResume ? (
                            <div className="space-y-4">
                                {/* File preview card */}
                                <div className="p-4 rounded-2xl glass-emerald-subcard border border-emerald-500/30 space-y-2.5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold text-white font-sora truncate">
                                                {savedResume.fileName || `${profile?.full_name || 'Candidate'}_Resume.pdf`}
                                            </p>
                                            <p className="text-[10px] text-emerald-300/70 truncate mt-0.5">
                                                Target: <strong className="text-emerald-300">{savedResume.data?.detectedIndustry || profile?.resume_role || 'Software Engineer'}</strong>
                                                {savedResume.updatedAt && ` • ${new Date(savedResume.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick skills tags */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {(
                                            savedResume.data?.skills?.technical?.slice(0, 4) ||
                                            savedResume.data?.primaryTechStack?.slice(0, 4) ||
                                            []
                                        ).map((skill: string) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreviewModal(true)}
                                        className="inline-flex items-center justify-center gap-1.5 glass-emerald-subcard hover:border-emerald-400 text-emerald-300 font-bold py-3 px-3 rounded-2xl transition-all text-xs"
                                    >
                                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>See Preview</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowPreviewModal(true)}
                                        className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3 px-3 rounded-2xl transition-all text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                                    >
                                        <PlayCircle className="w-3.5 h-3.5 text-slate-950" />
                                        <span>Quick Start</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-xs text-emerald-200/80 leading-relaxed">
                                    Upload a PDF resume to save it to your candidate vault for instant 1-click interview calibration.
                                </p>
                                <Link
                                    href="/dashboard/student/new"
                                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3.5 rounded-2xl transition-all text-xs shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                                >
                                    <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                                    <span>Upload Resume PDF</span>
                                </Link>
                            </div>
                        )}
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

            {/* Resume Preview & Verification Modal */}
            <AnimatePresence>
                {showPreviewModal && savedResume && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-4xl glass-emerald-card border border-emerald-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.25)] my-6 max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold font-sora text-white">
                                                Saved Resume Vault: Document Verification
                                            </h3>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                Active Telemetry
                                            </span>
                                        </div>
                                        <p className="text-xs text-emerald-300/70">
                                            Inspect your saved resume and extracted parameters before launching Round 1.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowPreviewModal(false)}
                                    className="p-2 rounded-xl text-emerald-300/70 hover:text-white hover:bg-emerald-500/10 transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Meta info ribbon */}
                            <div className="p-4 rounded-2xl glass-emerald-subcard border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 shrink-0">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        PDF
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-white font-sora">
                                            {savedResume.fileName || `${profile?.full_name || 'Candidate'}_Resume.pdf`}
                                        </p>
                                        <p className="text-[11px] text-emerald-300/60 mt-0.5">
                                            Target Domain: <strong className="text-emerald-300">{savedResume.data?.detectedIndustry || profile?.resume_role || 'Software Engineer'}</strong>
                                            {savedResume.updatedAt && ` • Synced: ${new Date(savedResume.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {savedResume.fileUrl ? (
                                        <a
                                            href={savedResume.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span>Open PDF in New Tab</span>
                                        </a>
                                    ) : (
                                        <Link
                                            href="/dashboard/student/new"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Upload PDF to Vault</span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Tabs selector */}
                            <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setActivePreviewTab('pdf')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                                        activePreviewTab === 'pdf'
                                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                                            : 'text-emerald-300/70 hover:text-white hover:bg-emerald-500/10'
                                    }`}
                                >
                                    <Eye className="w-3.5 h-3.5" /> PDF Document
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActivePreviewTab('skills')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                                        activePreviewTab === 'skills'
                                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                                            : 'text-emerald-300/70 hover:text-white hover:bg-emerald-500/10'
                                    }`}
                                >
                                    <Zap className="w-3.5 h-3.5" /> Extracted Skills & Telemetry
                                </button>
                                {savedResume.rawText && (
                                    <button
                                        type="button"
                                        onClick={() => setActivePreviewTab('text')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
                                            activePreviewTab === 'text'
                                                ? 'bg-emerald-500 text-slate-950 shadow-md'
                                                : 'text-emerald-300/70 hover:text-white hover:bg-emerald-500/10'
                                        }`}
                                    >
                                        <FileText className="w-3.5 h-3.5" /> Raw Document Text
                                    </button>
                                )}
                            </div>

                            {/* Tab Content Body */}
                            <div className="flex-1 overflow-y-auto pr-1 min-h-[350px]">
                                {activePreviewTab === 'pdf' && (
                                    savedResume.fileUrl ? (
                                        <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 shadow-inner">
                                            <iframe
                                                src={`${savedResume.fileUrl}#toolbar=0`}
                                                className="w-full h-full"
                                                title="Resume PDF Preview"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-[380px] rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-950/20 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div className="max-w-md space-y-1">
                                                <h4 className="text-base font-bold text-white font-sora">
                                                    No Cloud PDF Attached to Current Record
                                                </h4>
                                                <p className="text-xs text-emerald-300/70 leading-relaxed">
                                                    This saved resume was created before PDF cloud archiving was enabled. Upload your PDF file in the Studio to view its pages directly here anytime and enable instant 1-click launch!
                                                </p>
                                            </div>
                                            <Link
                                                href="/dashboard/student/new"
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg hover:shadow-emerald-500/20 transition-all font-sora"
                                            >
                                                <Upload className="w-4 h-4 stroke-[2.5]" />
                                                <span>Upload Your PDF Resume Now</span>
                                            </Link>
                                        </div>
                                    )
                                )}

                                {activePreviewTab === 'skills' && (
                                    <div className="space-y-4 p-1">
                                        {/* Candidate Summary */}
                                        {savedResume.data?.summary && (
                                            <div className="p-4 rounded-2xl glass-emerald-subcard border border-emerald-500/20 space-y-1.5">
                                                <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Professional Summary</p>
                                                <p className="text-xs text-emerald-100/90 leading-relaxed">{savedResume.data.summary}</p>
                                            </div>
                                        )}

                                        {/* Technical Skills */}
                                        <div className="p-4 rounded-2xl glass-emerald-subcard border border-emerald-500/20 space-y-3">
                                            <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Extracted Technical Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(
                                                    savedResume.data?.skills?.technical?.length
                                                        ? savedResume.data.skills.technical
                                                        : (savedResume.data?.primaryTechStack || [])
                                                ).map((s: string) => (
                                                    <span key={s} className="px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono rounded-lg">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Identified Projects */}
                                        {Array.isArray(savedResume.data?.projects) && savedResume.data.projects.length > 0 && (
                                            <div className="p-4 rounded-2xl glass-emerald-subcard border border-emerald-500/20 space-y-3">
                                                <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Identified Projects</p>
                                                <div className="space-y-2">
                                                    {savedResume.data.projects.map((p: any, idx: number) => (
                                                        <div key={idx} className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20">
                                                            <p className="text-xs font-bold text-white font-sora">{p.name || p.title || `Project ${idx + 1}`}</p>
                                                            {p.techStack && <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack}</p>}
                                                            {p.description && <p className="text-[11px] text-emerald-200/70 mt-1">{p.description}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activePreviewTab === 'text' && (
                                    <div className="p-4 rounded-2xl glass-emerald-subcard border border-emerald-500/20 bg-slate-950/60">
                                        <pre className="text-xs text-emerald-200/90 whitespace-pre-wrap font-mono leading-relaxed select-text">
                                            {savedResume.rawText || 'No raw text saved for this resume.'}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Controls */}
                            <div className="border-t border-emerald-500/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                                <Link
                                    href="/dashboard/student/new"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
                                >
                                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                                    <span>🔄 Upload Newer Resume</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLaunchSavedInterview}
                                    disabled={launchingInterview}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] text-xs font-sora active:scale-95 disabled:opacity-50"
                                >
                                    {launchingInterview ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                            <span>Calibrating Round 1...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PlayCircle className="w-4 h-4 stroke-[2.5]" />
                                            <span>Start Interview with this Resume (Round 1) →</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

