"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      {/* ─── ANIMATED BACKGROUND ─── */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1a2a4a] to-[#0f172a]"></div>
        
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-[#f97316] rounded-full blur-3xl opacity-10"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0ea5e9] rounded-full blur-3xl opacity-10"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#f97316]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#0ea5e9] rounded-lg flex items-center justify-center font-bold text-sm">
              YAT
            </div>
            <span className="font-bold text-xl">YAT AI interview</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="hover:text-[#f97316] transition">
              Features
            </a>
            <a href="#stages" className="hover:text-[#f97316] transition">
              5 Stages
            </a>
            <a href="#testimonials" className="hover:text-[#f97316] transition">
              Reviews
            </a>
          </div>

          {/* CTA + Mobile Menu */}
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="hidden md:inline px-6 py-2 bg-[#f97316] text-[#0f172a] rounded-lg font-semibold hover:bg-[#f97316]/90 transition"
            >
              Login
            </Link>
            <button
              className="md:hidden text-[#f97316]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-[#0f172a]/95 border-t border-[#f97316]/20 p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-4">
              <a href="#features">Features</a>
              <a href="#stages">5 Stages</a>
              <a href="#testimonials">Reviews</a>
              <Link href="/login" className="text-[#f97316]">
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="min-h-screen pt-20 flex items-center justify-center px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subheading */}
          <motion.div
            className="inline-block mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-4 py-2 bg-[#f97316]/10 border border-[#f97316] rounded-full text-[#f97316] text-sm font-semibold">
              ✨ AI-Powered Assessment Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Test Your Knowledge.
            <br />
            <span className="bg-gradient-to-r from-[#f97316] to-[#0ea5e9] bg-clip-text text-transparent">
              Master Your Preparation.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl text-[#f8fafc]/70 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Progress through 5 comprehensive stages and discover exactly what you
            know—and what you need to improve. Get personalized feedback and
            actionable insights in just 30 minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/interview/setup"
              className="px-8 py-4 bg-gradient-to-r from-[#f97316] to-[#0ea5e9] text-[#0f172a] rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#f97316]/50 transition flex items-center justify-center gap-2"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 border-2 border-[#0ea5e9] text-[#0ea5e9] rounded-lg font-bold hover:bg-[#0ea5e9]/10 transition">
              Learn More
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-col md:flex-row justify-center gap-8 text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div>
              <div className="text-3xl font-bold text-[#f97316]">5 Stages</div>
              <div className="text-[#f8fafc]/60">Comprehensive Assessment</div>
            </div>
            <div className="hidden md:block w-px bg-[#f97316]/20"></div>
            <div>
              <div className="text-3xl font-bold text-[#0ea5e9]">30 Min</div>
              <div className="text-[#f8fafc]/60">Complete Evaluation</div>
            </div>
            <div className="hidden md:block w-px bg-[#0ea5e9]/20"></div>
            <div>
              <div className="text-3xl font-bold text-[#f97316]">Instant</div>
              <div className="text-[#f8fafc]/60">Detailed Report</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-[#0ea5e9] text-center">
            <div className="text-sm mb-2">Scroll to explore</div>
            <div className="border-2 border-[#0ea5e9] rounded-full w-6 h-10 flex items-center justify-center mx-auto">
              <div className="w-1 h-2 bg-[#0ea5e9] rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 5 STAGES SECTION ─── */}
      <section id="stages" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Path to Mastery in{" "}
              <span className="text-[#f97316]">5 Stages</span>
            </h2>
            <p className="text-[#f8fafc]/70 text-lg max-w-2xl mx-auto">
              Each stage builds on the previous one, testing different aspects of
              your knowledge and preparation.
            </p>
          </motion.div>

          {/* 5 Stage Cards */}
          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                stage: 1,
                title: "Foundation",
                desc: "Core concepts and fundamentals",
                icon: "🔷",
              },
              {
                stage: 2,
                title: "Technical Depth",
                desc: "Advanced expertise and skills",
                icon: "⚙️",
              },
              {
                stage: 3,
                title: "Application",
                desc: "Real-world scenario handling",
                icon: "🎯",
              },
              {
                stage: 4,
                title: "Problem Solving",
                desc: "Practical challenges and logic",
                icon: "💡",
              },
              {
                stage: 5,
                title: "Communication",
                desc: "Clarity and explanation skills",
                icon: "🎤",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-gradient-to-br from-[#f97316]/10 to-[#0ea5e9]/10 border border-[#f97316]/20 rounded-lg p-6 hover:border-[#f97316]/50 transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-[#f97316] font-bold mb-2">Stage {item.stage}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-[#f8fafc]/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="py-20 px-6 bg-[#0f172a]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What You'll <span className="text-[#0ea5e9]">Get</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "📊 Instant Score Report",
              "🎯 Weakness Analysis",
              "📈 Improvement Plans",
              "✅ Progress Tracking",
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-gradient-to-br from-[#0ea5e9]/10 to-[#f97316]/10 border border-[#0ea5e9]/20 rounded-lg p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="font-semibold text-lg">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Students <span className="text-[#f97316]">Say</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Raj Kumar",
                role: "Engineering Student",
                text: "Went from 40% to 78% in 3 weeks using YAT AI interview.",
              },
              {
                name: "Priya Sharma",
                role: "CS Student",
                text: "The 5-stage system helped me identify exact knowledge gaps.",
              },
              {
                name: "Arjun Patel",
                role: "Final Year Student",
                text: "Best preparation tool for interviews and placements.",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="bg-gradient-to-br from-[#f97316]/5 to-[#0ea5e9]/5 border border-[#f97316]/20 rounded-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="mb-6 text-[#f8fafc]/80">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-[#f97316]">{testimonial.name}</p>
                  <p className="text-[#f8fafc]/60 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#f97316]/10 to-[#0ea5e9]/10 border-t border-[#f97316]/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Master Your <span className="text-[#f97316]">Preparation?</span>
            </h2>
            <p className="text-lg text-[#f8fafc]/70 mb-8">
              Start your 5-stage assessment today. No signup required. Get results in 30 minutes.
            </p>
            <Link
              href="/interview/setup"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#f97316] to-[#0ea5e9] text-[#0f172a] rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#f97316]/50 transition"
            >
              Start Your Assessment Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}