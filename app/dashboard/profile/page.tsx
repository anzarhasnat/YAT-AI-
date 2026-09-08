"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, X, Loader2, CheckCircle2, Cpu, User, Pencil, Save,
    Sparkles, Mail, ShieldCheck, Phone, Linkedin, Github, BriefcaseBusiness,
    FolderGit2, Award, BookMarked, ChevronDown, ChevronUp, ExternalLink, Target, FileText
} from "lucide-react";
import type { ExperienceEntry, ProjectEntry } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FullProfile {
    full_name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    summary: string;
    profession: string;
    skills: string[];
    experience: ExperienceEntry[];
    projects: ProjectEntry[];
    certifications: string[];
    achievements: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_PROFILE: FullProfile = {
    full_name: "", email: "", phone: "", linkedin: "", github: "",
    summary: "", profession: "", skills: [], experience: [],
    projects: [], certifications: [], achievements: [],
};

const EMPTY_EXP: ExperienceEntry = {
    company: "", role: "", duration: "", startDate: "", endDate: "", responsibilities: [],
};

const EMPTY_PROJ: ProjectEntry = {
    name: "", description: "", technologies: [], role: "", outcome: null, link: null,
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: string }) {
    return (
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
                <span className="text-emerald-400">{icon}</span>
                <h2 className="font-bold text-white text-base font-sora">{title}</h2>
            </div>
            {badge && (
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider">{badge}</span>
            )}
        </div>
    );
}

function SaveIndicator({ saving, saved }: { saving: boolean; saved: boolean }) {
    return (
        <AnimatePresence>
            {saving && (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> Syncing...
                </motion.span>
            )}
            {saved && !saving && (
                <motion.span key="saved" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </motion.span>
            )}
        </AnimatePresence>
    );
}

function GlassInput({ label, value, onChange, placeholder, type = "text", icon }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; icon?: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 flex items-center gap-1.5 font-mono">
                {icon && <span className="text-emerald-400">{icon}</span>}
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full glass-emerald-input border border-emerald-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all text-sm placeholder:text-emerald-700/50"
            />
        </div>
    );
}

function TagCloud({ tags, onRemove, onAdd, placeholder }: {
    tags: string[]; onRemove: (t: string) => void; onAdd: (t: string) => void; placeholder?: string;
}) {
    const [input, setInput] = useState("");
    const add = () => {
        const t = input.trim();
        if (t && !tags.includes(t)) onAdd(t);
        setInput("");
    };
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 min-h-[44px] glass-emerald-subcard border border-emerald-500/20 p-3 rounded-xl">
                <AnimatePresence>
                    {tags.map(tag => (
                        <motion.span key={tag}
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg group hover:border-emerald-400 transition-all">
                            {tag}
                            <button onClick={() => onRemove(tag)} className="opacity-50 group-hover:opacity-100 hover:text-rose-400 transition-all">
                                <X className="w-3 h-3" />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
                {tags.length === 0 && <span className="text-xs text-emerald-400/40 italic self-center">None added yet</span>}
            </div>
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
                    placeholder={placeholder || "Type and press Enter..."}
                    className="flex-1 glass-emerald-input border border-emerald-500/30 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-400 text-sm text-white placeholder:text-emerald-700/50 transition-all"
                />
                <button onClick={add} disabled={!input.trim()} className="px-4 py-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-500/25 transition-all disabled:opacity-40 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<FullProfile>(EMPTY_PROFILE);
    const [userId, setUserId] = useState<string | null>(null);

    // Per-section save state
    const [sectionSaving, setSectionSaving] = useState<Record<string, boolean>>({});
    const [sectionSaved, setSectionSaved] = useState<Record<string, boolean>>({});

    // Collapsible sections
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        identity: true, profession: true, skills: true, experience: true,
        projects: true, certs: true,
    });

    // ── Load all profile fields ───────────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const { data } = await supabase
                .from("profiles")
                .select("full_name, email, phone, linkedin, github, summary, profession, skills, experience, projects, certifications, achievements")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    linkedin: data.linkedin || "",
                    github: data.github || "",
                    summary: data.summary || "",
                    profession: data.profession || "",
                    skills: data.skills || [],
                    experience: data.experience || [],
                    projects: data.projects || [],
                    certifications: data.certifications || [],
                    achievements: data.achievements || [],
                });
            }
            setLoading(false);
        };
        init();
    }, []);

    // ── Generic section save ──────────────────────────────────────────────────
    const saveSection = useCallback(async (key: string, fields: Partial<FullProfile>) => {
        if (!userId) return;
        setSectionSaving(s => ({ ...s, [key]: true }));
        try {
            await supabase.from("profiles").upsert({ id: userId, ...fields });
            setSectionSaved(s => ({ ...s, [key]: true }));
            setTimeout(() => setSectionSaved(s => ({ ...s, [key]: false })), 2500);
        } finally {
            setSectionSaving(s => ({ ...s, [key]: false }));
        }
    }, [userId]);

    const toggleSection = (key: string) =>
        setOpenSections(s => ({ ...s, [key]: !s[key] }));

    // ─────────────────────────────────────────────────────────────────────────
    // EXPERIENCE helpers
    // ─────────────────────────────────────────────────────────────────────────
    const updateExp = (idx: number, field: keyof ExperienceEntry, value: string | string[]) => {
        const updated = profile.experience.map((e, i) => i === idx ? { ...e, [field]: value } : e);
        setProfile(p => ({ ...p, experience: updated }));
    };
    const addExp = () => setProfile(p => ({ ...p, experience: [...p.experience, { ...EMPTY_EXP }] }));
    const removeExp = (idx: number) => setProfile(p => ({ ...p, experience: p.experience.filter((_, i) => i !== idx) }));

    // ─────────────────────────────────────────────────────────────────────────
    // PROJECT helpers
    // ─────────────────────────────────────────────────────────────────────────
    const updateProj = (idx: number, field: keyof ProjectEntry, value: string | string[] | null) => {
        const updated = profile.projects.map((pr, i) => i === idx ? { ...pr, [field]: value } : pr);
        setProfile(p => ({ ...p, projects: updated }));
    };
    const addProj = () => setProfile(p => ({ ...p, projects: [...p.projects, { ...EMPTY_PROJ }] }));
    const removeProj = (idx: number) => setProfile(p => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }));

    // ─────────────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-400 relative z-10" />
                </div>
                <p className="text-sm font-medium text-emerald-300/60 animate-pulse">Loading Candidate Passport...</p>
            </div>
        );
    }

    const cardClass = "rounded-3xl border border-emerald-500/30 glass-emerald-card backdrop-blur-xl shadow-xl overflow-hidden";
    const headerBtnClass = "w-full flex items-center justify-between p-6 group";

    return (
        <div className="max-w-3xl mx-auto space-y-5 pb-16">

            {/* ── Banner ── */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl p-7 overflow-hidden border border-emerald-500/30 glass-emerald-card backdrop-blur-2xl shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="flex items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> Candidate Passport
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight font-sora">
                            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Profile</span>
                        </h1>
                        <p className="text-emerald-300/60 mt-1.5 text-sm leading-relaxed max-w-md">
                            All data auto-fills from your resume upload. Edit any section and save live to your profile.
                        </p>
                    </div>
                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_24px_rgba(16,185,129,0.15)]">
                        <User className="w-8 h-8" />
                    </div>
                </div>
            </motion.div>

            {/* ── 1. Identity ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={cardClass}>
                <button className={headerBtnClass} onClick={() => toggleSection("identity")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-bold text-white font-sora">Identity</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <SaveIndicator saving={sectionSaving["identity"]} saved={sectionSaved["identity"]} />
                        {openSections["identity"] ? <ChevronUp className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />}
                    </div>
                </button>
                <AnimatePresence>
                    {openSections["identity"] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="px-6 pb-6 space-y-4 border-t border-emerald-500/15">
                            <div className="h-4" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <GlassInput label="Full Name" value={profile.full_name} onChange={v => setProfile(p => ({ ...p, full_name: v }))}
                                    placeholder="Your legal name" icon={<User className="w-3.5 h-3.5" />} />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 flex items-center gap-1.5 font-mono">
                                        <Mail className="w-3.5 h-3.5 text-emerald-400" /> Auth Email
                                    </label>
                                    <p className="w-full glass-emerald-subcard border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-300 text-sm font-mono opacity-70">
                                        {profile.email || "—"}
                                    </p>
                                </div>
                                <GlassInput label="Phone" value={profile.phone} onChange={v => setProfile(p => ({ ...p, phone: v }))}
                                    placeholder="+91 00000 00000" type="tel" icon={<Phone className="w-3.5 h-3.5" />} />
                                <GlassInput label="LinkedIn URL" value={profile.linkedin} onChange={v => setProfile(p => ({ ...p, linkedin: v }))}
                                    placeholder="https://linkedin.com/in/..." icon={<Linkedin className="w-3.5 h-3.5" />} />
                                <GlassInput label="GitHub URL" value={profile.github} onChange={v => setProfile(p => ({ ...p, github: v }))}
                                    placeholder="https://github.com/..." icon={<Github className="w-3.5 h-3.5" />} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 flex items-center gap-1.5 font-mono">
                                    <FileText className="w-3.5 h-3.5 text-emerald-400" /> Professional Summary
                                </label>
                                <textarea
                                    value={profile.summary}
                                    onChange={e => setProfile(p => ({ ...p, summary: e.target.value }))}
                                    rows={3}
                                    placeholder="A brief professional summary extracted from your resume..."
                                    className="w-full glass-emerald-input border border-emerald-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all text-sm placeholder:text-emerald-700/50 resize-none"
                                />
                            </div>
                            <button onClick={() => saveSection("identity", {
                                full_name: profile.full_name, phone: profile.phone,
                                linkedin: profile.linkedin, github: profile.github, summary: profile.summary,
                            })}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] disabled:opacity-50 ml-auto"
                                disabled={sectionSaving["identity"]}>
                                <Save className="w-3.5 h-3.5" /> Save Identity
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── 2. Profession ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className={cardClass}>
                <button className={headerBtnClass} onClick={() => toggleSection("profession")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <Target className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-bold text-white font-sora">Target Profession</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <SaveIndicator saving={sectionSaving["profession"]} saved={sectionSaved["profession"]} />
                        {openSections["profession"] ? <ChevronUp className="w-4 h-4 text-emerald-400/60" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60" />}
                    </div>
                </button>
                <AnimatePresence>
                    {openSections["profession"] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="px-6 pb-6 border-t border-emerald-500/15">
                            <div className="h-4" />
                            <GlassInput label="Target Role / Industry" value={profile.profession} onChange={v => setProfile(p => ({ ...p, profession: v }))}
                                placeholder="e.g. Software Engineer, Data Scientist..." icon={<BriefcaseBusiness className="w-3.5 h-3.5" />} />
                            <p className="text-xs text-emerald-400/50 mt-2 mb-4">Auto-detected from your resume. You can edit this to match the role you want.</p>
                            <button onClick={() => saveSection("profession", { profession: profile.profession })}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] ml-auto"
                                disabled={sectionSaving["profession"]}>
                                <Save className="w-3.5 h-3.5" /> Save Role
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── 3. Skills ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} className={cardClass}>
                <button className={headerBtnClass} onClick={() => toggleSection("skills")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <Cpu className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-bold text-white font-sora">Skill Cloud</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                            {profile.skills.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <SaveIndicator saving={sectionSaving["skills"]} saved={sectionSaved["skills"]} />
                        {openSections["skills"] ? <ChevronUp className="w-4 h-4 text-emerald-400/60" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60" />}
                    </div>
                </button>
                <AnimatePresence>
                    {openSections["skills"] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="px-6 pb-6 border-t border-emerald-500/15">
                            <div className="h-4" />
                            <p className="text-xs text-emerald-300/60 mb-4 leading-relaxed">
                                All skills are auto-extracted from your resume and seeded into AI interview evaluations.
                            </p>
                            <TagCloud
                                tags={profile.skills}
                                onRemove={tag => {
                                    const updated = profile.skills.filter(s => s !== tag);
                                    setProfile(p => ({ ...p, skills: updated }));
                                    saveSection("skills", { skills: updated });
                                }}
                                onAdd={tag => {
                                    const updated = [...profile.skills, tag];
                                    setProfile(p => ({ ...p, skills: updated }));
                                    saveSection("skills", { skills: updated });
                                }}
                                placeholder="e.g. React, Python, SQL..."
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── 4. Experience ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className={cardClass}>
                <button className={headerBtnClass} onClick={() => toggleSection("experience")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <BriefcaseBusiness className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-bold text-white font-sora">Experience</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                            {profile.experience.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <SaveIndicator saving={sectionSaving["experience"]} saved={sectionSaved["experience"]} />
                        {openSections["experience"] ? <ChevronUp className="w-4 h-4 text-emerald-400/60" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60" />}
                    </div>
                </button>
                <AnimatePresence>
                    {openSections["experience"] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="px-6 pb-6 border-t border-emerald-500/15">
                            <div className="h-4" />
                            <AnimatePresence>
                                {profile.experience.map((exp, idx) => (
                                    <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                        className="glass-emerald-subcard border border-emerald-500/20 rounded-2xl p-5 mb-4 space-y-3 relative group">
                                        <button onClick={() => removeExp(idx)}
                                            className="absolute top-3 right-3 p-1.5 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <GlassInput label="Company" value={exp.company} onChange={v => updateExp(idx, "company", v)} placeholder="Company name" />
                                            <GlassInput label="Role / Title" value={exp.role} onChange={v => updateExp(idx, "role", v)} placeholder="e.g. Software Intern" />
                                            <GlassInput label="Start Date" value={exp.startDate} onChange={v => updateExp(idx, "startDate", v)} placeholder="e.g. Jan 2024" />
                                            <GlassInput label="End Date" value={exp.endDate} onChange={v => updateExp(idx, "endDate", v)} placeholder="e.g. Jun 2024 or Present" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 font-mono">Responsibilities (one per line)</label>
                                            <textarea
                                                value={exp.responsibilities.join("\n")}
                                                onChange={e => updateExp(idx, "responsibilities", e.target.value.split("\n"))}
                                                rows={3}
                                                placeholder="Built REST APIs for..."
                                                className="w-full glass-emerald-input border border-emerald-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm placeholder:text-emerald-700/50 resize-none transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {profile.experience.length === 0 && (
                                <p className="text-xs text-emerald-400/40 italic mb-4">No experience added yet. Auto-filled from resume upload.</p>
                            )}
                            <div className="flex items-center justify-between gap-3">
                                <button onClick={addExp}
                                    className="flex items-center gap-1.5 px-4 py-2.5 glass-emerald-subcard border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl hover:border-emerald-400 transition-all">
                                    <Plus className="w-3.5 h-3.5" /> Add Entry
                                </button>
                                <button onClick={() => saveSection("experience", { experience: profile.experience })}
                                    disabled={sectionSaving["experience"]}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] disabled:opacity-50">
                                    <Save className="w-3.5 h-3.5" /> Save Experience
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── 5. Projects ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className={cardClass}>
                <button className={headerBtnClass} onClick={() => toggleSection("projects")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <FolderGit2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-bold text-white font-sora">Projects</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                            {profile.projects.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <SaveIndicator saving={sectionSaving["projects"]} saved={sectionSaved["projects"]} />
                        {openSections["projects"] ? <ChevronUp className="w-4 h-4 text-emerald-400/60" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60" />}
                    </div>
                </button>
                <AnimatePresence>
                    {openSections["projects"] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="px-6 pb-6 border-t border-emerald-500/15">
                            <div className="h-4" />
                            <AnimatePresence>
                                {profile.projects.map((proj, idx) => (
                                    <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                        className="glass-emerald-subcard border border-emerald-500/20 rounded-2xl p-5 mb-4 space-y-3 relative group">
                                        <button onClick={() => removeProj(idx)}
                                            className="absolute top-3 right-3 p-1.5 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <GlassInput label="Project Name" value={proj.name} onChange={v => updateProj(idx, "name", v)} placeholder="Project title" />
                                            <GlassInput label="Your Role" value={proj.role} onChange={v => updateProj(idx, "role", v)} placeholder="e.g. Full Stack Developer" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 font-mono">Description</label>
                                            <textarea
                                                value={proj.description}
                                                onChange={e => updateProj(idx, "description", e.target.value)}
                                                rows={2}
                                                placeholder="What does this project do?"
                                                className="w-full glass-emerald-input border border-emerald-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm placeholder:text-emerald-700/50 resize-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 font-mono">Tech Stack (comma-separated)</label>
                                            <input
                                                value={proj.technologies.join(", ")}
                                                onChange={e => updateProj(idx, "technologies", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                                placeholder="React, Node.js, MongoDB..."
                                                className="w-full glass-emerald-input border border-emerald-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm placeholder:text-emerald-700/50 transition-all"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400/60 shrink-0" />
                                            <input
                                                value={proj.link || ""}
                                                onChange={e => updateProj(idx, "link", e.target.value || null)}
                                                placeholder="https://github.com/... or live link"
                                                className="flex-1 glass-emerald-input border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400 text-xs placeholder:text-emerald-700/50 transition-all"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {profile.projects.length === 0 && (
                                <p className="text-xs text-emerald-400/40 italic mb-4">No projects added yet. Auto-filled from resume upload.</p>
                            )}
                            <div className="flex items-center justify-between gap-3">
                                <button onClick={addProj}
                                    className="flex items-center gap-1.5 px-4 py-2.5 glass-emerald-subcard border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl hover:border-emerald-400 transition-all">
                                    <Plus className="w-3.5 h-3.5" /> Add Project
                                </button>
                                <button onClick={() => saveSection("projects", { projects: profile.projects })}
                                    disabled={sectionSaving["projects"]}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] disabled:opacity-50">
                                    <Save className="w-3.5 h-3.5" /> Save Projects
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── 6. Certifications & Achievements ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className={cardClass}>
                <button className={headerBtnClass} onClick={() => toggleSection("certs")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <Award className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-bold text-white font-sora">Certifications & Achievements</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <SaveIndicator saving={sectionSaving["certs"]} saved={sectionSaved["certs"]} />
                        {openSections["certs"] ? <ChevronUp className="w-4 h-4 text-emerald-400/60" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60" />}
                    </div>
                </button>
                <AnimatePresence>
                    {openSections["certs"] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                            className="px-6 pb-6 border-t border-emerald-500/15 space-y-5">
                            <div className="h-4" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 font-mono flex items-center gap-1.5 mb-3">
                                    <BookMarked className="w-3.5 h-3.5 text-emerald-400" /> Certifications
                                </p>
                                <TagCloud
                                    tags={profile.certifications}
                                    onRemove={tag => setProfile(p => ({ ...p, certifications: p.certifications.filter(c => c !== tag) }))}
                                    onAdd={tag => setProfile(p => ({ ...p, certifications: [...p.certifications, tag] }))}
                                    placeholder="e.g. AWS Certified, Google Cloud..."
                                />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 font-mono flex items-center gap-1.5 mb-3">
                                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Achievements
                                </p>
                                <TagCloud
                                    tags={profile.achievements}
                                    onRemove={tag => setProfile(p => ({ ...p, achievements: p.achievements.filter(a => a !== tag) }))}
                                    onAdd={tag => setProfile(p => ({ ...p, achievements: [...p.achievements, tag] }))}
                                    placeholder="e.g. Hackathon Winner, Published Paper..."
                                />
                            </div>
                            <button onClick={() => saveSection("certs", { certifications: profile.certifications, achievements: profile.achievements })}
                                disabled={sectionSaving["certs"]}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] disabled:opacity-50 ml-auto">
                                <Save className="w-3.5 h-3.5" /> Save All
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

        </div>
    );
}
