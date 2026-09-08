"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
    Briefcase,
    Code,
    ChevronRight,
    Sparkles,
    Zap,
    Cpu,
    Target,
    Paperclip,
    Upload,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ClipboardEdit,
    X,
    FileText,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

function InterviewSetupContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const driveRegId = searchParams.get("driveRegId");
    const driveId = searchParams.get("driveId");
    const driveRole = searchParams.get("role");

    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [parseStatus, setParseStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [usingSavedResume, setUsingSavedResume] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualGrades, setManualGrades] = useState({ tenth: '', twelfth: '', cgpa: '', branch: '' });
    const [savingGrades, setSavingGrades] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [pendingParsedData, setPendingParsedData] = useState<any>(null);
    const [savingToProfile, setSavingToProfile] = useState(false);
    const [formData, setFormData] = useState({
        role: driveRole || ""
    });

    const router = useRouter();

    // Prevent going back to this page during a live drive
    useEffect(() => {
        if (mode === "drive" && driveRegId) {
            const existingSetup = sessionStorage.getItem("interview_setup");
            if (existingSetup) {
                try {
                    const parsed = JSON.parse(existingSetup);
                    if (parsed.mode === 'drive' && parsed.driveRegId === driveRegId) {
                        sessionStorage.removeItem("interview_setup");
                        sessionStorage.removeItem("current_interview_config");
                        alert("Drive sessions cannot be restarted or modified once initiated. Returning to dashboard.");
                        router.push("/dashboard");
                    }
                } catch (e) { }
            }
        }
    }, [mode, driveRegId, router]);

    // Pre-fill from profile — load saved resume if available
    useEffect(() => {
        if (mode === "drive" && driveRole) {
            setFormData({ role: driveRole });
            setUsingSavedResume(false);
        } else if (profile && !formData.role) {
            if (profile.resume_role) {
                setFormData({ role: profile.resume_role || "" });
                setUsingSavedResume(true);
            } else {
                setFormData(prev => ({
                    ...prev,
                    role: (profile.role && profile.role !== 'candidate') ? profile.role : "",
                }));
            }
        }
    }, [profile]);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setParsing(true);
        setParseStatus(null);

        try {
            const apiFormData = new FormData();
            apiFormData.append('file', file);

            let res: Response;
            try {
                res = await fetch('/api/parse-resume', {
                    method: 'POST',
                    body: apiFormData
                });
            } catch (networkErr: any) {
                throw new Error('Network error — could not reach server. Check your connection.');
            }

            let result: any;
            if (!res.ok) {
                try { result = await res.json(); } catch { result = {}; }
                if (result?.requiresManualEntry) {
                    setParseStatus({ type: 'error', text: 'PDF could not be read. Please enter your grades manually below.' });
                    setShowManualEntry(true);
                    return;
                }
                throw new Error(result?.error || `Server error (${res.status})`);
            }

            result = await res.json();
            if (!result.success) {
                if (result.requiresManualEntry) {
                    setParseStatus({ type: 'error', text: 'Could not extract data from PDF. Enter grades manually.' });
                    setShowManualEntry(true);
                    return;
                }
                throw new Error(result.error || 'Resume processing failed');
            }

            const data = result.data;

            const extractedRole =
                data.detectedIndustry ||
                data.experience?.[0]?.role ||
                (data.primaryTechStack?.[0] ? `${data.primaryTechStack[0]} Developer` : '') ||
                "";
            if (mode !== 'drive') {
                setFormData({
                    role: extractedRole || formData.role
                });
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('profiles').update({
                    resume_role: extractedRole || formData.role,
                }).eq('id', user.id);
            }

            sessionStorage.setItem("parsed_resume", JSON.stringify(data));

            setPendingParsedData(data);
            setShowSavePrompt(true);
            setUsingSavedResume(false);
            setParseStatus({ type: 'success', text: `✅ Resume analyzed successfully by Groq AI! Fields auto-filled.` });
        } catch (error: any) {
            console.error("Resume integration error:", error);
            setParseStatus({ type: 'error', text: error.message || "Failed to analyze resume." });
        } finally {
            setParsing(false);
        }
    };

    const handleSaveToProfileChoice = async (saveToProfile: boolean) => {
        if (saveToProfile && pendingParsedData) {
            setSavingToProfile(true);
            try {
                await fetch("/api/resume/saved", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ parsedData: pendingParsedData }),
                });
            } catch (e) {
                console.error("Save to profile error:", e);
            } finally {
                setSavingToProfile(false);
            }
        }
        setShowSavePrompt(false);
    };

    const handleManualGradesSave = async () => {
        setSavingGrades(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const updates: Record<string, any> = {};
            if (manualGrades.tenth) updates.tenth_percent = parseFloat(manualGrades.tenth);
            if (manualGrades.twelfth) updates.twelfth_percent = parseFloat(manualGrades.twelfth);
            if (manualGrades.cgpa) updates.grad_cgpa = parseFloat(manualGrades.cgpa);
            if (manualGrades.branch) updates.branch = manualGrades.branch;
            if (Object.keys(updates).length > 0) {
                await supabase.from('profiles').update(updates).eq('id', user.id);
            }
            setShowManualEntry(false);
            setParseStatus({ type: 'success', text: '✅ Academic grades saved successfully!' });
        } catch (e: any) {
            setParseStatus({ type: 'error', text: 'Failed to save grades: ' + e.message });
        } finally {
            setSavingGrades(false);
        }
    };

    const handleStart = async () => {
        if (!formData.role) return;

        setLoading(true);

        const setupData = {
            role: formData.role,
            domain: formData.role,
            experience: "Freshers/Entry-Level",
            pattern: "Standard",
            mode: mode || "practice",
            driveRegId: driveRegId || null,
            driveId: driveId || null
        };

        sessionStorage.setItem("interview_setup", JSON.stringify(setupData));
        sessionStorage.setItem("current_interview_config", JSON.stringify(formData));

        router.push("/interview/session/round-1");
    };

    const isDriveMode = mode === 'drive';

    return (
        <div className="min-h-screen bg-[#030806] text-emerald-50 p-4 md:p-10 relative overflow-hidden">
            {/* Background Bioluminescent Radial Glows */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                {/* Header HUD Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 glass-emerald-card rounded-3xl border border-emerald-500/30">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] shrink-0">
                            <Cpu className="w-8 h-8 animate-pulse" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold uppercase tracking-wider mb-1">
                                <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Calibration Engine
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black font-sora text-white tracking-tight">
                                Evaluation <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Launch Studio</span>
                            </h1>
                            <p className="text-xs text-emerald-300/70">Seed candidate telemetry and calibrate multi-round technical assessment parameters.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <div className="px-4 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Groq AI Core: Active</span>
                        </div>
                    </div>
                </div>

                {/* 2-Column Asymmetric Studio Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN (5 Cols): Resume Uplink & Laser Scanner Dropzone */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <div className="glass-emerald-card p-7 rounded-3xl border border-emerald-500/30 space-y-6 relative overflow-hidden backdrop-blur-2xl">
                            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                        <Paperclip className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold font-sora text-white">Resume Laser Uplink</h3>
                                        <p className="text-xs text-emerald-300/70">Groq AI Automated Skill Extraction</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold rounded-full border border-emerald-500/30">
                                    PDF Parser
                                </span>
                            </div>

                            {/* Dropzone Laser Box */}
                            <label className="group relative block glass-emerald-dropzone rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleResumeUpload}
                                    disabled={parsing}
                                />
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                        {parsing ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                                        ) : (
                                            <Upload className="w-8 h-8 text-emerald-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white font-sora">
                                            {parsing ? "Parsing PDF Telemetry..." : "Drop PDF Resume Here"}
                                        </p>
                                        <p className="text-xs text-emerald-300/60 mt-1">
                                            {parsing ? "Extracting skills, projects, and target role..." : "Click or drag to upload candidate resume"}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-md">
                                        {parsing ? "Processing..." : "Select Resume PDF"}
                                    </div>
                                </div>
                            </label>

                            {parseStatus && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold border ${
                                        parseStatus.type === 'success'
                                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                            : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                                    }`}
                                >
                                    {parseStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                                    <span className="leading-relaxed">{parseStatus.text}</span>
                                </motion.div>
                            )}

                            {/* Using Saved Resume Alert */}
                            {usingSavedResume && (
                                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-emerald-400" />
                                        <span>Using Profile Saved Resume Telemetry</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Loaded</span>
                                </div>
                            )}

                            {/* Display Parsed Stacks if available */}
                            {pendingParsedData && (
                                <div className="p-4 glass-emerald-subcard rounded-2xl space-y-3">
                                    <p className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Extracted Telemetry Matrix</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(pendingParsedData.primaryTechStack || []).map((tech: string) => (
                                            <span key={tech} className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono rounded-lg">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN (7 Cols): Target Role Calibration & 5-Round Sequence */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div className="glass-emerald-card p-7 md:p-9 rounded-3xl border border-emerald-500/30 space-y-8 backdrop-blur-2xl">
                            {/* Target Engineering Role */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 font-mono">
                                        <Briefcase className="w-4 h-4 text-emerald-400" /> Target Engineering Domain
                                    </label>
                                    <span className="text-[11px] text-emerald-400/80 font-mono">Required Parameter</span>
                                </div>

                                <div className="relative">
                                    <input
                                        className={`w-full glass-emerald-input border ${
                                            isDriveMode ? 'border-emerald-500/50 text-emerald-300 cursor-not-allowed opacity-80' : 'border-emerald-500/30 focus:border-emerald-400 focus:shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                                        } rounded-2xl px-6 py-4 outline-none text-white text-lg font-semibold transition-all placeholder:text-emerald-700/60`}
                                        placeholder="e.g. Full Stack Developer, AI Engineer, Backend Specialist..."
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        readOnly={mode === 'drive'}
                                    />
                                </div>

                                {/* Quick Role Selection Presets */}
                                {!isDriveMode && (
                                    <div className="space-y-2 pt-1">
                                        <p className="text-[11px] text-emerald-400/70 font-mono">Quick Preset Domains:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "⚡ Full Stack Engineer",
                                                "🤖 AI / ML Specialist",
                                                "🛡️ Cloud DevOps Architect",
                                                "💻 Backend Systems Engineer",
                                                "🎨 Lead Frontend Developer"
                                            ].map((preset) => {
                                                const cleanRole = preset.replace(/^[^\w]+/, "").trim();
                                                return (
                                                    <button
                                                        key={preset}
                                                        type="button"
                                                        onClick={() => setFormData({ role: cleanRole })}
                                                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 transition-all active:scale-95"
                                                    >
                                                        {preset}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 5-Round Sequence Blueprint Preview */}
                            <div className="space-y-4 pt-4 border-t border-emerald-500/20">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-white font-sora flex items-center gap-2">
                                        <Target className="w-4 h-4 text-emerald-400" /> 5-Round Evaluation Blueprint
                                    </h4>
                                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                        Sequential Pipeline
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                                    {[
                                        { step: "01", name: "Aptitude", desc: "Logic & Math" },
                                        { step: "02", name: "Tech Core", desc: "CS Fundamentals" },
                                        { step: "03", name: "Resume Probe", desc: "Project Defense" },
                                        { step: "04", name: "Live Coding", desc: "Algorithms" },
                                        { step: "05", name: "Behavioral", desc: "Communication" },
                                    ].map((round) => (
                                        <div
                                            key={round.step}
                                            className="p-3 glass-emerald-subcard rounded-xl text-center space-y-1 hover:border-emerald-400 transition-colors"
                                        >
                                            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">Round {round.step}</span>
                                            <p className="text-xs font-bold text-white font-sora">{round.name}</p>
                                            <p className="text-[9px] text-emerald-300/60 truncate">{round.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Footer Launch Button */}
                            <div className="pt-6 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs text-emerald-300/80">
                                    <Zap className="text-emerald-400 w-4 h-4 animate-pulse" />
                                    <span>Adaptive 5-Round Diagnostic Sequence</span>
                                </div>

                                <button
                                    onClick={handleStart}
                                    disabled={loading || !formData.role}
                                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 disabled:opacity-50 text-slate-950 font-black px-10 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(16,185,129,0.4)] text-base font-sora active:scale-95"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                                            <span>Calibrating Session...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Launch Evaluation Session</span>
                                            <ChevronRight className="w-5 h-5 stroke-[3]" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Manual Entry Modal */}
            <AnimatePresence>
                {showManualEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <div className="glass-emerald-card border border-emerald-500/30 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
                            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                                <h3 className="font-bold text-lg text-white font-sora flex items-center gap-2">
                                    <ClipboardEdit className="w-5 h-5 text-emerald-400" />
                                    Manual Grade Entry
                                </h3>
                                <button onClick={() => setShowManualEntry(false)} className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-emerald-300/70 leading-relaxed">Enter your academic percentage metrics to seed your profile.</p>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">10th %</label>
                                        <input type="number" step="0.01" min="0" max="100" value={manualGrades.tenth}
                                            onChange={e => setManualGrades({ ...manualGrades, tenth: e.target.value })}
                                            className="w-full mt-1 glass-emerald-input border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                                            placeholder="e.g. 85.5" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">12th %</label>
                                        <input type="number" step="0.01" min="0" max="100" value={manualGrades.twelfth}
                                            onChange={e => setManualGrades({ ...manualGrades, twelfth: e.target.value })}
                                            className="w-full mt-1 glass-emerald-input border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                                            placeholder="e.g. 88.0" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">CGPA</label>
                                        <input type="number" step="0.01" min="0" max="10" value={manualGrades.cgpa}
                                            onChange={e => setManualGrades({ ...manualGrades, cgpa: e.target.value })}
                                            className="w-full mt-1 glass-emerald-input border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                                            placeholder="e.g. 8.5" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Branch</label>
                                        <input type="text" value={manualGrades.branch}
                                            onChange={e => setManualGrades({ ...manualGrades, branch: e.target.value })}
                                            className="w-full mt-1 glass-emerald-input border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                                            placeholder="Computer Science" />
                                    </div>
                                </div>
                                <button
                                    onClick={handleManualGradesSave}
                                    disabled={savingGrades}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3.5 rounded-xl transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md"
                                >
                                    {savingGrades ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <CheckCircle2 className="w-4 h-4 text-slate-950" />}
                                    {savingGrades ? 'Saving...' : 'Save Academic Data'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Save Resume to Profile Modal */}
            <AnimatePresence>
                {showSavePrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-emerald-card border border-emerald-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto text-3xl text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                💾
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold font-sora text-white">Save Resume to Profile?</h3>
                                <p className="text-xs text-emerald-300/70 leading-relaxed">
                                    Would you like to save this parsed resume telemetry to your candidate profile for 1-click loading in future mock sessions?
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    disabled={savingToProfile}
                                    onClick={() => handleSaveToProfileChoice(true)}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                >
                                    {savingToProfile ? "Saving to Profile..." : "✓ Yes, Save to My Profile"}
                                </button>
                                <button
                                    disabled={savingToProfile}
                                    onClick={() => handleSaveToProfileChoice(false)}
                                    className="w-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 font-bold py-3 rounded-xl border border-emerald-500/20 transition-all text-sm"
                                >
                                    Use for This Session Only
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function NewInterviewSetup() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#030806] text-emerald-400 p-12 text-center text-sm font-mono animate-pulse">Loading Interview Wizard...</div>}>
            <InterviewSetupContent />
        </Suspense>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    );
}
