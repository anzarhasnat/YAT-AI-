"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, CheckCircle, Award, BrainCircuit, Activity } from "lucide-react";
import Link from "next/link";
import ParticlesBackground from "@/components/ParticlesBackground";
import WelcomeScreen from "@/components/WelcomeScreen";
import CustomCursor from "@/components/CustomCursor";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-normal cursor-none overflow-x-hidden transition-colors duration-500 text-[#0f172a] dark:text-[#f0fdf4]">
      <CustomCursor />
      <WelcomeScreen />
      
      {/* ─── 3D BACKGROUND (21st.dev Particles) ─── */}
      <ParticlesBackground />

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#030806]/60 backdrop-blur-md border-b border-gray-200 dark:border-[#10b981]/20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-3 cursor-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 3 }}
            data-cursor-magnify="true"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#0ea5e9] rounded-full flex items-center justify-center text-sm font-medium text-white shadow-md">
              YAT
            </div>
            <span className="text-xl font-medium tracking-wide" style={{ fontFamily: "var(--font-lora)" }}>YAT AI</span>
          </motion.div>

          <div className="hidden md:flex gap-8 items-center text-gray-600 dark:text-[#86efac]">
            <a href="#rounds" className="hover:text-[#10b981] dark:hover:text-[#f0fdf4] transition duration-300 cursor-none" data-cursor-magnify="true">
              5 Rounds
            </a>
            <a href="#evaluation" className="hover:text-[#10b981] dark:hover:text-[#f0fdf4] transition duration-300 cursor-none" data-cursor-magnify="true">
              Evaluation & Results
            </a>
          </div>

          <div className="flex gap-4 items-center">
            <ThemeToggle />
            
            <Link
              href="/login"
              className="hidden md:inline px-6 py-2 rounded-full border border-gray-300 dark:border-[#10b981]/50 text-gray-700 dark:text-[#10b981] hover:bg-gray-100 dark:hover:bg-[#10b981]/10 transition duration-300 cursor-none tracking-wide"
              data-cursor-magnify="true"
            >
              Log In
            </Link>
            
            <Link
              href="/signup"
              className="hidden md:inline px-6 py-2 rounded-full bg-[#10b981] text-white hover:bg-[#059669] transition duration-300 cursor-none tracking-wide shadow-md"
              data-cursor-magnify="true"
            >
              Sign Up
            </Link>
            
            <button
              className="md:hidden text-gray-800 dark:text-[#10b981] cursor-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-cursor-magnify="true"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-[#030806]/95 border-t border-gray-200 dark:border-[#10b981]/20 p-6 backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-6 text-center text-gray-600 dark:text-[#86efac]">
              <a href="#rounds" className="hover:text-[#10b981] dark:hover:text-[#f0fdf4]">5 Rounds</a>
              <a href="#evaluation" className="hover:text-[#10b981] dark:hover:text-[#f0fdf4]">Evaluation & Results</a>
              <Link href="/login" className="text-gray-800 dark:text-[#10b981]">Log In</Link>
              <Link href="/signup" className="text-gray-800 dark:text-[#10b981]">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="min-h-screen pt-24 flex items-center justify-center px-6 relative">
        <div className="max-w-4xl mx-auto text-center z-10">
          <motion.div
            className="inline-block mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2 }}
          >
            <span className="px-5 py-2 bg-emerald-50 dark:bg-[#10b981]/10 border border-emerald-200 dark:border-[#10b981]/30 rounded-full text-emerald-700 dark:text-[#34d399] text-sm tracking-widest uppercase shadow-sm">
              ✨ The Modern Standard for Interview Prep
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl mb-8 leading-tight font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4 }}
            style={{ fontFamily: "var(--font-lora)" }}
          >
            Effortless preparation.
            <br />
            <span className="bg-gradient-to-r from-[#10b981] to-[#0ea5e9] bg-clip-text text-transparent">
              Precision results.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-gray-600 dark:text-[#86efac] mb-12 max-w-3xl mx-auto font-normal leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.6 }}
          >
            Progress through five comprehensive stages and discover exactly what you know. 
            Receive a detailed DNA analytics report on your interview performance in thirty minutes.
          </motion.p>
          
          <motion.div
            className="flex flex-col md:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.8 }}
          >
            <Link
              href="/signup"
              className="px-10 py-4 bg-gradient-to-r from-[#10b981] to-[#0ea5e9] text-white rounded-full text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition duration-500 flex items-center justify-center gap-3 cursor-none"
              data-cursor-magnify="true"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. THE 5 INTERVIEW ROUNDS ─── */}
      <section id="rounds" className="py-32 px-6 relative bg-white dark:bg-transparent dark:border-t dark:border-[#10b981]/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl mb-6 font-medium text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-lora)" }}>
              Five Stages of <span className="text-[#10b981]">Mastery</span>
            </h2>
            <p className="text-gray-600 dark:text-[#86efac] text-xl max-w-2xl mx-auto font-normal">
              Our AI orchestrates a tailored progression of challenges, directly matching your uploaded resume to ensure relevancy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Foundation", desc: "Assesses core concepts and fundamentals. Can you explain the basics clearly?" },
              { num: "02", title: "Technical Depth", desc: "Dives into advanced expertise, technical architecture, and specific framework knowledge." },
              { num: "03", title: "Application", desc: "Tests how well you apply your skills to real-world scenarios and system designs." },
              { num: "04", title: "Problem Solving", desc: "Presents practical challenges, edge cases, and complex logic puzzles." },
              { num: "05", title: "Communication", desc: "Evaluates the clarity, confidence, and structure of your final explanations." },
            ].map((round, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-50 dark:bg-transparent dark:glass-emerald-card rounded-2xl p-10 cursor-none border border-gray-200 dark:border-[#10b981]/20 hover:border-[#10b981] dark:hover:border-[#34d399] transition-colors duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                data-cursor-magnify="true"
              >
                <div className="text-[#10b981] dark:text-[#34d399] mb-4 tracking-widest uppercase text-sm font-medium">Stage {round.num}</div>
                <h3 className="text-2xl mb-4 text-gray-900 dark:text-[#f0fdf4] font-medium" style={{ fontFamily: "var(--font-lora)" }}>{round.title}</h3>
                <p className="text-gray-600 dark:text-[#86efac] font-normal leading-relaxed">{round.desc}</p>
                <div className="absolute top-0 right-0 p-6 text-6xl text-gray-200 dark:text-white/5 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none" style={{ fontFamily: "var(--font-lora)" }}>
                  {round.num}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. EVALUATION & RESULTS ─── */}
      <section id="evaluation" className="py-32 px-6 relative bg-emerald-50/50 dark:bg-transparent dark:border-t dark:border-[#10b981]/10">
        <div className="dark:absolute dark:inset-0 dark:bg-gradient-to-b dark:from-transparent dark:via-[#10b981]/5 dark:to-transparent dark:-z-10"></div>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl mb-8 font-medium text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-lora)" }}>
              Intelligent Evaluation & <br />
              <span className="text-[#10b981]">DNA Analytics</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-[#86efac] font-normal leading-relaxed mb-8">
              We don't just ask questions; we deeply analyze your answers. Powered by advanced AI models (Groq & Gemini), YAT AI breaks down your logic in real-time to provide the ultimate performance report.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-6 h-6 text-[#10b981]" />
                </div>
                <div>
                  <h4 className="text-xl text-gray-900 dark:text-white font-medium mb-2" style={{ fontFamily: "var(--font-lora)" }}>Logic & Complexity Analysis</h4>
                  <p className="text-gray-600 dark:text-[#86efac] font-normal">Our engines parse your technical reasoning and code complexity exactly like a senior engineering manager would.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <div>
                  <h4 className="text-xl text-gray-900 dark:text-white font-medium mb-2" style={{ fontFamily: "var(--font-lora)" }}>DNA Performance Report</h4>
                  <p className="text-gray-600 dark:text-[#86efac] font-normal">Upon finishing the 5 rounds, you instantly receive a breakdown of your strengths, weaknesses, and a final score out of 100.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 bg-white dark:bg-[#030806] rounded-3xl p-8 border border-gray-200 dark:border-[#10b981]/30 shadow-xl cursor-none"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            data-cursor-magnify="true"
          >
            <div className="text-sm tracking-widest uppercase text-gray-500 dark:text-[#34d399] mb-8 font-medium">Sample DNA Result</div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-[#10b981]/20 bg-gray-50 dark:bg-[#10b981]/5">
                <div className="flex justify-between text-gray-700 dark:text-[#86efac] mb-2 font-medium text-sm">
                  <span>Overall Score</span>
                  <span className="text-emerald-600 dark:text-emerald-400">92/100</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-[#030806] rounded-full overflow-hidden border border-gray-300 dark:border-emerald-900/50">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "92%" }} 
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 dark:border-[#10b981]/20 bg-gray-50 dark:bg-[#10b981]/5">
                <div className="flex justify-between text-gray-700 dark:text-[#86efac] mb-2 font-medium text-sm">
                  <span>Problem Solving Logic</span>
                  <span className="text-amber-600 dark:text-amber-400">75/100</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-[#030806] rounded-full overflow-hidden border border-gray-300 dark:border-emerald-900/50">
                  <motion.div 
                    className="h-full bg-amber-400" 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "75%" }} 
                    transition={{ duration: 1.5, delay: 0.7 }}
                  />
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#10b981]/20 flex items-start gap-4">
                <Award className="w-8 h-8 text-[#10b981]" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-1">Strong Recommendation</div>
                  <div className="text-sm text-gray-600 dark:text-[#86efac]">Candidate demonstrates exceptional core knowledge. Recommended for immediate next steps in the placement portal.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 4. LAUNCHPAD (CTA) ─── */}
      <section className="py-32 px-6 relative overflow-hidden bg-white dark:bg-transparent">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-[#10b981]/5 to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl mb-8 font-medium text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-lora)" }}>
              Ready to Master Your <span className="text-[#10b981]">Preparation?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-[#86efac] mb-12 font-normal max-w-2xl mx-auto">
              Start your five-stage assessment today. Experience real-world pressure in a safe environment.
            </p>
            <Link
              href="/signup"
              className="inline-block px-12 py-5 bg-[#10b981] border border-[#10b981] text-white rounded-full text-xl hover:bg-[#059669] transition duration-500 cursor-none shadow-lg"
              data-cursor-magnify="true"
            >
              Join YAT AI Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER (Fat Footer) ─── */}
      <footer className="border-t border-gray-200 dark:border-[#10b981]/20 bg-white dark:bg-[#030806]/80 backdrop-blur-md pt-20 pb-8 px-6 transition-colors duration-500 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* The Brand Block */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#0ea5e9] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                  YAT
                </div>
                <span className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white" style={{ fontFamily: "var(--font-lora)" }}>
                  YAT AI
                </span>
              </div>
              <p className="text-gray-600 dark:text-[#86efac] text-sm leading-relaxed mb-6 font-normal max-w-md">
                We don't just assess skills. We uncover potential. Experience the future of intelligent, automated AI interviews.
              </p>
            </div>

            {/* The Sitemap Links - Company */}
            <div className="md:col-span-1">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-6 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#rounds" className="text-gray-600 dark:text-[#86efac]/80 hover:text-[#10b981] dark:hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">5 Rounds Framework</a></li>
                <li><a href="#evaluation" className="text-gray-600 dark:text-[#86efac]/80 hover:text-[#10b981] dark:hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">Evaluation Engine</a></li>
                <li><a href="/login" className="text-gray-600 dark:text-[#86efac]/80 hover:text-[#10b981] dark:hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">Log In</a></li>
                <li><a href="/signup" className="text-gray-600 dark:text-[#86efac]/80 hover:text-[#10b981] dark:hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">Create Account</a></li>
              </ul>
            </div>

            {/* The Contact Block */}
            <div className="md:col-span-1">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact</h4>
              <ul className="space-y-4 text-sm font-normal text-gray-600 dark:text-[#86efac]/80">
                <li><a href="mailto:support@yatai.com" className="hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">support@yatai.com</a></li>
                <li><a href="tel:+1800YATAI99" className="hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">+1 800 YAT-AI-99</a></li>
              </ul>
            </div>
            
          </div>

          {/* The Utility Bar */}
          <div className="border-t border-gray-200 dark:border-[#10b981]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-normal text-gray-500 dark:text-[#86efac]/60">
            <div>
              &copy; {new Date().getFullYear()} YAT AI. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">Privacy Policy</a>
              <a href="#" className="hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">Terms</a>
              <a href="#" className="hover:text-[#10b981] transition cursor-none" data-cursor-magnify="true">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}