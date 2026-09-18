"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BrainCircuit,
    BarChart3,
    Trophy,
    Briefcase,
    ShieldCheck,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Plus,
    Sparkles,
    Dna
} from "lucide-react";
import { motion } from "framer-motion";

export default function DNACardsPage() {
    const [report, setReport] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const data = sessionStorage.getItem("final_dna_report");
        if (data) {
            try {
                setReport(JSON.parse(data));
            } catch { }
        }
    }, []);

    const getScoreColor = (s: number) =>
        s >= 75 ? "text-emerald-400" : s >= 50 ? "text-amber-400" : "text-rose-400";

    const getBarColor = (s: number) =>
        s >= 75 ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : s >= 50 ? "bg-amber-400" : "bg-rose-400";

    const getVerdictStyle = (v: string) => {
        switch (v) {
            case "STRONG HIRE": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
            case "HIRE": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]";
            case "BORDERLINE": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
            default: return "bg-rose-500/10 text-rose-400 border-rose-500/30";
        }
    };

    const rounds = report?.roundScores ? [
        { label: "Round 1", sub: "Aptitude", score: report.roundScores.round1 ?? 0 },
        { label: "Round 2", sub: "Technical", score: report.roundScores.round2 ?? 0 },
        { label: "Round 3", sub: "Resume", score: report.roundScores.round3 ?? 0 },
        { label: "Round 4", sub: "Coding", score: report.roundScores.round4 ?? 0 },
        { label: "Round 5", sub: "Written", score: report.roundScores.round5 ?? 0 },
    ] : [];

    // No report yet
    if (!report) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <div className="relative rounded-3xl p-8 overflow-hidden border border-emerald-500/30 glass-emerald-card backdrop-blur-2xl shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3">
                            <Dna className="w-3.5 h-3.5" /> Skill Genome Matrix
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sora">
                            Candidate <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">DNA Telemetry</span>
                        </h1>
                        <p className="text-emerald-300/70 mt-2 max-w-xl text-sm leading-relaxed">
                            Your comprehensive multi-round skill matrix will display here automatically once you complete an interview session.
                        </p>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-emerald-card border-2 border-dashed border-emerald-500/30 rounded-3xl p-16 flex flex-col items-center text-center backdrop-blur-xl"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <BrainCircuit className="text-emerald-400 w-10 h-10 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold font-sora text-white mb-3">No Skill DNA Card Active</h2>
                    <p className="text-emerald-300/70 max-w-md mb-8 text-sm leading-relaxed">
                        Complete a full 5-round mock evaluation to generate your verified candidate DNA card with automated scoring telemetry.
                    </p>
                    <button 
                        onClick={() => router.push("/dashboard/student/new")}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] text-sm"
                    >
                        <Plus className="w-5 h-5 stroke-[3]" /> Launch Mock Evaluation
                    </button>
                </motion.div>
            </div>
        );
    }

    const overallScore = report.overallScore ?? 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> Verified Genome Diagnostic
                    </div>
                    <h1 className="text-3xl font-extrabold text-white font-sora tracking-tight">Interview <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">DNA Report</span></h1>
                    <p className="text-emerald-300/70 text-sm mt-1">Multi-round candidate synthesis and competency breakdown</p>
                </div>
                <button 
                    onClick={() => router.push("/dashboard/report/latest")}
                    className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold px-6 py-3 rounded-2xl transition-all border border-emerald-500/30 backdrop-blur-md text-sm shrink-0"
                >
                    View Full Report <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
            </div>

            {/* Hero Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl border border-emerald-500/30 glass-emerald-card backdrop-blur-2xl p-8 overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-emerald-400">
                    <Trophy className="w-64 h-64" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Latest Assessment
                        </p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-sora tracking-wide">{report.candidateName || "Candidate"}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <Briefcase className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300 font-bold text-base">{report.role || "—"}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        <span className={`px-6 py-2.5 rounded-2xl border font-extrabold text-base tracking-wider uppercase ${getVerdictStyle(report.verdict)}`}>
                            {report.verdict}
                        </span>
                        <div className="text-right">
                            <p className="text-[11px] text-emerald-400/80 uppercase tracking-widest font-mono">Overall Score</p>
                            <p className={`text-5xl font-black font-sora ${getScoreColor(overallScore)}`}>
                                {overallScore}<span className="text-lg text-emerald-500/50 font-normal">%</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Round-by-Round Scores */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-emerald-500/30 glass-emerald-card backdrop-blur-xl p-8 space-y-6"
            >
                <h3 className="text-xl font-bold font-sora text-white flex items-center gap-2.5">
                    <BarChart3 className="text-emerald-400 w-6 h-6" /> Round-by-Round Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {rounds.map((r, i) => (
                        <motion.div 
                            key={r.label}
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.15 + i * 0.07 }}
                            className="glass-emerald-subcard rounded-2xl border border-emerald-500/20 p-5 text-center group hover:border-emerald-400 transition-colors"
                        >
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">{r.label}</p>
                            <p className="text-[11px] font-medium text-emerald-300 mb-3">{r.sub}</p>
                            <p className={`text-3xl font-black font-sora ${getScoreColor(r.score)}`}>
                                {r.score}<span className="text-xs font-normal text-emerald-500/50">%</span>
                            </p>
                            <div className="mt-3 h-1.5 bg-emerald-950/60 rounded-full overflow-hidden border border-emerald-500/20">
                                <motion.div 
                                    className={`h-full rounded-full ${getBarColor(r.score)}`}
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${r.score}%` }}
                                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }} 
                                />
                            </div>
                            <p className={`text-[10px] font-bold mt-2.5 tracking-wider ${r.score >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {r.score >= 50 ? '✓ QUALIFIED' : '✗ UNQUALIFIED'}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Summary + Selling Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="rounded-3xl border border-emerald-500/30 glass-emerald-card backdrop-blur-xl p-8 space-y-5"
                >
                    <h3 className="text-xl font-bold font-sora text-white flex items-center gap-2.5">
                        <TrendingUp className="text-teal-400 w-5 h-5" /> Executive AI Evaluation
                    </h3>
                    <div className="p-5 glass-emerald-subcard rounded-2xl border border-emerald-500/20 italic text-emerald-100 text-sm leading-relaxed">
                        &ldquo;{report.summary}&rdquo;
                    </div>
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm flex gap-3">
                        <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-emerald-200 text-xs leading-relaxed">{report.recommendation}</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="rounded-3xl border border-emerald-500/30 glass-emerald-card backdrop-blur-xl p-8 space-y-5"
                >
                    <h3 className="text-xl font-bold font-sora text-white flex items-center gap-2.5">
                        <CheckCircle2 className="text-emerald-400 w-5 h-5" /> Core Competencies & Strengths
                    </h3>
                    <div className="space-y-3">
                        {(report.sellingPoints || []).map((p: string, i: number) => (
                            <div key={i} className="flex gap-3 items-start p-4 glass-emerald-subcard rounded-2xl border border-emerald-500/20">
                                <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                <p className="text-sm text-emerald-200 font-medium">{p}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                    onClick={() => router.push("/dashboard/report/latest")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] text-sm"
                >
                    View Comprehensive Diagnostic Report <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => router.push("/dashboard/student/new")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 glass-emerald-subcard hover:border-emerald-400 text-white font-bold px-8 py-4 rounded-2xl border border-emerald-500/30 backdrop-blur-md transition-all text-sm"
                >
                    <Plus className="w-4 h-4" /> Start New Evaluation
                </button>
            </div>
        </div>
    );
}

