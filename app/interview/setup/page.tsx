"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Upload,
    FileText,
    Check,
    X,
    ChevronRight,
    ChevronLeft,
    Briefcase,
    Building2,
    Trophy,
    History,
    Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewSetup() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [savedResume, setSavedResume] = useState<any>(null);
    const [loadingSaved, setLoadingSaved] = useState(true);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [pendingParsedData, setPendingParsedData] = useState<any>(null);
    const [savingToProfile, setSavingToProfile] = useState(false);
    const [jobData, setJobData] = useState({
        role: "",
        company: "",
        domain: "Information Technology (IT Services)",
        pattern: "Generic IT",
        experience: "Fresher (0–1 yr)",
        skills: [] as string[],
        timeLimit: "30 mins",
        isLink: false,
        sCode: ""
    });

    const router = useRouter();

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await fetch("/api/resume/saved");
                const data = await res.json();
                if (data.success && data.hasSavedResume) {
                    setSavedResume(data.data);
                }
            } catch (e) {
                console.warn("Could not fetch saved resume:", e);
            } finally {
                setLoadingSaved(false);
            }
        };
        fetchSaved();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
        }
    };

    const handleLoadSavedResume = () => {
        if (!savedResume) return;
        sessionStorage.setItem("parsed_resume", JSON.stringify(savedResume));
        const detected = savedResume.detectedIndustry || savedResume.experience?.[0]?.role;
        if (detected) {
            setJobData(prev => ({ ...prev, role: detected }));
        }
        setStep(2);
    };

    const handleStartAnalysis = async () => {
        if (!file) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                sessionStorage.setItem("interview_setup", JSON.stringify(jobData));
                sessionStorage.setItem("parsed_resume", JSON.stringify(data.data));
                setPendingParsedData(data.data);
                setShowSavePrompt(true);
                setIsUploading(false);
            } else {
                alert(data.error);
                setIsUploading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
            setIsUploading(false);
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
        router.push("/interview/pre-check");
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary p-6">
            <div className="max-w-4xl mx-auto pt-12">
                {/* Stepper */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className={`absolute top-1/2 left-0 w-full h-0.5 bg-border-color -z-10`}></div>
                    <StepIndicator current={step} index={1} label="Upload Resume" />
                    <StepIndicator current={step} index={2} label="Job Details" />
                    <StepIndicator current={step} index={3} label="Health Check" />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-bg-secondary p-10 rounded-[2rem] border border-border-color"
                        >
                            <h1 className="text-2xl font-bold font-sora mb-2">Step 1: Upload Your Resume</h1>
                            <p className="text-text-secondary mb-8">We'll use your resume to tailor every single interview question to your background.</p>

                            {/* Saved Resume Quick Load Banner */}
                            {savedResume && (
                                <div className="mb-8 p-5 bg-accent-blue/10 border border-accent-blue/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center text-white font-bold shrink-0">
                                            ⚡
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-text-primary">You have a saved resume in your profile!</p>
                                            <p className="text-xs text-text-secondary">
                                                {savedResume.personalInfo?.name || "Candidate"} · {savedResume.detectedIndustry || "Saved Resume"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLoadSavedResume}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-accent-blue hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shrink-0 shadow-md shadow-accent-blue/20"
                                    >
                                        Use Saved Resume →
                                    </button>
                                </div>
                            )}

                            <div
                                className={`relative group border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${file ? 'border-accent-green bg-accent-green/5' : 'border-border-color hover:border-accent-blue/50 bg-bg-card'}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
}}
                                onClick={() => document.getElementById('resume-upload')?.click()}
                            >
                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png,.gif"
                                    onChange={handleFileChange}
                                />

                                {file ? (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-accent-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Check className="text-white w-10 h-10" />
                                        </div>
                                        <p className="font-bold text-lg mb-1">{file.name}</p>
                                        <p className="text-text-secondary text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Document'}</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="mt-6 text-accent-red hover:underline text-sm font-bold flex items-center gap-1 mx-auto"
                                        >
                                            <X className="w-4 h-4" /> Remove file
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="text-accent-blue w-8 h-8" />
                                        </div>
                                        <p className="font-bold text-lg mb-1">Drop your resume here</p>
                                        <p className="text-text-secondary text-sm">or click to browse files</p>
                                        <p className="mt-8 text-xs text-text-secondary py-2 px-4 rounded-full bg-bg-secondary inline-block">PDF only • Max 5MB</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 flex flex-col items-center text-center">
                                <p className="text-xs text-text-secondary max-w-xs mb-8">
                                    Your resume is read by AI and never stored as a file.
                                    Only the extracted text is saved securely.
                                </p>
                                <button
                                    disabled={!file}
                                    onClick={() => setStep(2)}
                                    className="bg-accent-blue disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 text-white font-bold px-10 py-4 rounded-2xl transition-all flex items-center gap-2"
                                >
                                    Next: Job Details <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-bg-secondary p-10 rounded-[2rem] border border-border-color"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <button onClick={() => setStep(1)} className="text-text-secondary hover:text-white"><ChevronLeft /></button>
                                <h1 className="text-2xl font-bold font-sora">Step 2: Target Job Details</h1>
                            </div>
                            <p className="text-text-secondary mb-10 ml-8">Tell us about the role you want so we can calibrate the difficulty.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputGroup label="Job Role You Are Applying For" mandatory>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                                        <input
                                            className="w-full bg-bg-card border border-border-color rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent-blue"
                                            placeholder="e.g. React Developer"
                                            value={jobData.role}
                                            onChange={(e) => setJobData({ ...jobData, role: e.target.value })}
                                        />
                                    </div>
                                </InputGroup>

                                <InputGroup label="Company Name">
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                                        <input
                                            className="w-full bg-bg-card border border-border-color rounded-xl py-3 pl-12 pr-4 outline-none focus:border-accent-blue"
                                            placeholder="e.g. Google, TCS, etc."
                                            value={jobData.company}
                                            onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                                        />
                                    </div>
                                </InputGroup>

                                <InputGroup label="Company Domain / Industry" mandatory>
                                    <select
                                        className="w-full bg-bg-card border border-border-color rounded-xl py-3 px-4 outline-none focus:border-accent-blue appearance-none"
                                        value={jobData.domain}
                                        onChange={(e) => setJobData({ ...jobData, domain: e.target.value })}
                                    >
                                        <option>Information Technology (IT Services)</option>
                                        <option>Banking & Finance (BFSI)</option>
                                        <option>E-Commerce & Retail</option>
                                        <option>Healthcare & Pharma</option>
                                        <option>EdTech & Education</option>
                                        <option>Consulting & Management</option>
                                        <option>Manufacturing & Engineering</option>
                                        <option>Startup / Product Company</option>
                                        <option>Other</option>
                                    </select>
                                </InputGroup>

                                {jobData.domain.includes("IT") && (
                                    <InputGroup label="Target Company Pattern">
                                        <select
                                            className="w-full bg-bg-card border border-border-color rounded-xl py-3 px-4 outline-none focus:border-accent-blue appearance-none"
                                            value={jobData.pattern}
                                            onChange={(e) => setJobData({ ...jobData, pattern: e.target.value })}
                                        >
                                            <option>Generic IT</option>
                                            <option>TCS NQT Style</option>
                                            <option>Infosys InfyTQ Style</option>
                                            <option>Wipro NLTH Style</option>
                                            <option>Accenture Style</option>
                                        </select>
                                    </InputGroup>
                                )}

                                <InputGroup label="Experience Level" mandatory>
                                    <div className="flex flex-wrap gap-2">
                                        {["Fresher (0–1 yr)", "Junior (1–3 yrs)", "Mid-Level (3–5 yrs)", "Senior (5+ yrs)"].map(level => (
                                            <button
                                                key={level}
                                                onClick={() => setJobData({ ...jobData, experience: level })}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${jobData.experience === level ? 'bg-accent-blue border-accent-blue text-white' : 'bg-bg-card border-border-color text-text-secondary hover:border-accent-blue/50'}`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </InputGroup>

                                <InputGroup label="Time Limit Per Round">
                                    <select
                                        className="w-full bg-bg-card border border-border-color rounded-xl py-3 px-4 outline-none focus:border-accent-blue appearance-none"
                                        value={jobData.timeLimit}
                                        onChange={(e) => setJobData({ ...jobData, timeLimit: e.target.value })}
                                    >
                                        <option>No Limit</option>
                                        <option>15 mins</option>
                                        <option>20 mins</option>
                                        <option>30 mins</option>
                                        <option>45 mins</option>
                                    </select>
                                </InputGroup>
                            </div>

                            <div className="mt-12 flex flex-col items-center">
                                <button
                                    disabled={!jobData.role || isUploading}
                                    onClick={handleStartAnalysis}
                                    className="w-full md:w-auto bg-gradient-to-r from-accent-blue to-accent-purple hover:scale-[1.02] active:scale-[0.98] text-white font-bold px-12 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-accent-blue/20"
                                >
                                    {isUploading ? "AI is analysing your resume..." : "Generate My Pre-Interview Check →"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Save Resume to Profile Modal */}
            <AnimatePresence>
                {showSavePrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-bg-secondary border border-border-color rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-accent-blue/10 border border-accent-blue/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                                💾
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold font-sora">Save Resume to Profile?</h3>
                                <p className="text-sm text-text-secondary">
                                    Would you like to save this parsed resume to your candidate profile for 1-click loading in future mock interviews?
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    disabled={savingToProfile}
                                    onClick={() => handleSaveToProfileChoice(true)}
                                    className="w-full bg-accent-blue hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/20"
                                >
                                    {savingToProfile ? "Saving to Profile..." : "✓ Yes, Save to My Profile"}
                                </button>
                                <button
                                    disabled={savingToProfile}
                                    onClick={() => handleSaveToProfileChoice(false)}
                                    className="w-full bg-bg-card hover:bg-bg-card/80 text-text-secondary hover:text-text-primary font-bold py-3 rounded-xl border border-border-color transition-all text-sm"
                                >
                                    Use for This Test Only
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StepIndicator({ current, index, label }: { current: number, index: number, label: string }) {
    const isActive = current >= index;
    return (
        <div className="flex flex-col items-center gap-3 relative z-10 p-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 border-4 ${isActive ? 'bg-accent-blue border-accent-blue text-white shadow-lg shadow-accent-blue/30' : 'bg-bg-secondary border-border-color text-text-secondary'}`}>
                {isActive && current > index ? <Check className="w-6 h-6" /> : index}
            </div>
            <span className={`text-sm font-bold transition-all duration-500 ${isActive ? 'text-white' : 'text-text-secondary'}`}>{label}</span>
        </div>
    );
}

function InputGroup({ label, children, mandatory }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary ml-1">
                {label} {mandatory && <span className="text-accent-red">*</span>}
            </label>
            {children}
        </div>
    );
}
