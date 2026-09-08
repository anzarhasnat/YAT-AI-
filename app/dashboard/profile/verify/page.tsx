"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, BookOpen, GraduationCap, CheckCircle2, AlertCircle, Sparkles, Loader2, Award, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AVAILABLE_BRANCHES } from "@/lib/constants";

export default function VerifyProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        college_name: "",
        tenth_percent: "",
        twelfth_percent: "",
        grad_cgpa: "",
        branch: "",
        active_backlogs: "0",
        passing_year: ""
    });

    useEffect(() => {
        const init = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("college_name, tenth_percent, twelfth_percent, grad_cgpa, branch, active_backlogs, passing_year")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setFormData({
                        college_name: profile.college_name ?? "",
                        tenth_percent: profile.tenth_percent?.toString() ?? "",
                        twelfth_percent: profile.twelfth_percent?.toString() ?? "",
                        grad_cgpa: profile.grad_cgpa?.toString() ?? "",
                        branch: profile.branch ?? "",
                        active_backlogs: (profile.active_backlogs ?? 0).toString(),
                        passing_year: profile.passing_year?.toString() ?? "",
                    });
                }
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSaved(false);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error: saveErr } = await supabase.from('profiles').upsert({
                id: user.id,
                college_name: formData.college_name || null,
                tenth_percent: formData.tenth_percent ? parseFloat(formData.tenth_percent) : null,
                twelfth_percent: formData.twelfth_percent ? parseFloat(formData.twelfth_percent) : null,
                grad_cgpa: formData.grad_cgpa ? parseFloat(formData.grad_cgpa) : null,
                branch: formData.branch || null,
                active_backlogs: parseInt(formData.active_backlogs || "0"),
                passing_year: formData.passing_year ? parseInt(formData.passing_year) : null,
            });

            if (saveErr) throw saveErr;
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to save academic data.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full glass-emerald-input border border-emerald-500/30 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all font-mono text-sm placeholder:text-emerald-700/50";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-400 relative z-10" />
                </div>
                <p className="text-sm font-medium text-emerald-300/60 animate-pulse">Accessing Academic Vault...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-7 pb-16">

            {/* Header Banner */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl p-7 overflow-hidden border border-emerald-500/30 glass-emerald-card backdrop-blur-2xl shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> Official Record Vault
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sora">
                            Academic <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Verification</span>
                        </h1>
                        <p className="text-emerald-300/60 mt-1.5 text-sm max-w-lg leading-relaxed">
                            Your verified academic credentials are used for AI interview telemetry and performance benchmarking.
                        </p>
                    </div>
                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Award className="w-8 h-8" />
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
                className="rounded-3xl border border-emerald-500/30 glass-emerald-card backdrop-blur-xl p-8 shadow-2xl">

                {/* Success Banner */}
                <AnimatePresence>
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-sm rounded-2xl flex items-center gap-3 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                            Academic profile saved successfully! ✓
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-2xl flex items-center gap-3 font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSave} className="space-y-6">

                    {/* College Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400" /> College / University Name
                        </label>
                        <input
                            type="text"
                            value={formData.college_name}
                            onChange={e => setFormData({ ...formData, college_name: e.target.value })}
                            className={inputClass}
                            placeholder="e.g. MIT, IIT Bombay, VIT..."
                        />
                    </div>

                    {/* 10th & 12th */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <BookOpen className="w-3.5 h-3.5" /> 10th Standard %
                            </label>
                            <input type="number" step="0.01" min="0" max="100"
                                value={formData.tenth_percent}
                                onChange={e => setFormData({ ...formData, tenth_percent: e.target.value })}
                                className={inputClass} placeholder="e.g. 85.5" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <BookOpen className="w-3.5 h-3.5" /> 12th / Diploma %
                            </label>
                            <input type="number" step="0.01" min="0" max="100"
                                value={formData.twelfth_percent}
                                onChange={e => setFormData({ ...formData, twelfth_percent: e.target.value })}
                                className={inputClass} placeholder="e.g. 88.0" />
                        </div>
                    </div>

                    {/* CGPA & Backlogs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <GraduationCap className="w-3.5 h-3.5" /> Current CGPA
                            </label>
                            <input type="number" step="0.01" min="0" max="10"
                                value={formData.grad_cgpa}
                                onChange={e => setFormData({ ...formData, grad_cgpa: e.target.value })}
                                className="w-full glass-emerald-input border border-emerald-500/40 rounded-2xl px-4 py-3.5 text-emerald-300 outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all font-mono text-base font-extrabold placeholder:text-emerald-700/50"
                                placeholder="e.g. 8.5" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Active Backlogs
                            </label>
                            <input type="number" min="0"
                                value={formData.active_backlogs}
                                onChange={e => setFormData({ ...formData, active_backlogs: e.target.value })}
                                className={inputClass} placeholder="0" />
                        </div>
                    </div>

                    {/* Graduation Year & Branch */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <GraduationCap className="w-4 h-4" /> Graduation Year
                            </label>
                            <input type="number" min="2000" max="2035"
                                value={formData.passing_year}
                                onChange={e => setFormData({ ...formData, passing_year: e.target.value })}
                                className={inputClass} placeholder="e.g. 2026" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                                <BookOpen className="w-4 h-4" /> Branch / Specialization
                            </label>
                            <select
                                value={formData.branch}
                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full glass-emerald-input border border-emerald-500/30 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-emerald-400 transition-all text-sm appearance-none font-medium">
                                <option value="" className="bg-[#03100a] text-emerald-400/60">Select your branch...</option>
                                {AVAILABLE_BRANCHES.map(branch => (
                                    <option key={branch} value={branch} className="bg-[#03100a] text-white">{branch}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={saving}
                        className="w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold py-4 rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 text-sm font-sora">
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : saved ? (
                            <><CheckCircle2 className="w-5 h-5" /> Verified & Saved!</>
                        ) : (
                            <><Save className="w-5 h-5 stroke-[2.5]" /> Commit Academic Profile</>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
