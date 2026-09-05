"use client";

import { useState } from "react";
import Image from "next/image";
import { usePortfolio } from "@/context/PortfolioContext";
import { ArrowDown, Check, Copy, Download, Sparkles } from "lucide-react";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const { personalInfo, projects, stack, education } = usePortfolio();

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Extract name parts for display
  const nameParts = personalInfo.name.split(" ").filter(Boolean);
  const firstName = nameParts[0] || "Pasindu";
  const middleName = nameParts.length >= 3 ? nameParts[1] : (personalInfo.shortName.split(" ")[1] || "Sri");
  const lastName = nameParts.length >= 3 ? nameParts.slice(2).join(" ") : (nameParts[1] || "Induwara");

  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center justify-center pt-24 pb-16 px-6 lg:px-12 overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit mb-8 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-medium">
              {personalInfo.internshipStatus}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.98] mb-6 text-white">
            {firstName} <br />
            <span
              style={{
                WebkitTextStroke: "1.5px rgba(99,102,241,0.6)",
                color: "transparent",
              }}
            >
              {middleName}
            </span>{" "}
            <span className="text-indigo-500 drop-shadow-[0_0_24px_rgba(99,102,241,0.35)]">
              {lastName}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed max-w-xl mb-8">
            {personalInfo.tagline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-12">
            <button
              onClick={() => scrollToSection("projects")}
              data-hover
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium text-sm shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Explore My Work</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={copyEmail}
              data-hover
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 font-mono text-xs hover:border-indigo-500/50 hover:text-white transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{personalInfo.email}</span>
                </>
              )}
            </button>

            <a
              href={personalInfo.resumeUrl || "/api/resume"}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-zinc-400 font-mono text-xs hover:text-white hover:border-white/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get CV</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/8 max-w-lg">
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-indigo-400">
                {projects.length}+
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
                Featured Projects
              </div>
            </div>

            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-400">
                {stack.length}+
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
                Tech Stack Tools
              </div>
            </div>

            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-1">
                BSc IT
                <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mt-1">
                Univ of Moratuwa
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Avatar with Orbiting System */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[460px]">
          {/* Ambient Glows */}
          <div className="absolute w-[360px] h-[360px] rounded-full bg-indigo-600/15 blur-[90px] pointer-events-none" />
          <div className="absolute w-[280px] h-[280px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none translate-y-12" />

          {/* Outer Dashed Ring */}
          <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-indigo-500/25 animate-spin-slow pointer-events-none" />

          {/* Inner Solid Opposite Ring */}
          <div className="absolute w-[310px] h-[310px] rounded-full border border-emerald-500/20 animate-spin-slow-reverse pointer-events-none" />

          {/* Orbiting Satellite Dot 1 */}
          <div className="absolute w-[350px] h-[350px] rounded-full animate-spin-slow pointer-events-none">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]" />
          </div>

          {/* Orbiting Satellite Dot 2 */}
          <div className="absolute w-[310px] h-[310px] rounded-full animate-spin-slow-reverse pointer-events-none">
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
          </div>

          {/* Floating Skill Chips Top */}
          <div className="absolute top-2 flex items-center gap-2 z-20">
            {stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#0a0a14]/90 border border-white/10 text-zinc-400 backdrop-blur-md shadow-md"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Main Glowing Avatar Frame */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-emerald-400 to-indigo-600 shadow-[0_0_40px_rgba(99,102,241,0.3)] animate-spin-fast">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#050508] relative">
              <div className="w-full h-full relative animate-spin-fast-reverse">
                <Image
                  src={personalInfo.avatar || "/images/profile.jpg"}
                  alt={personalInfo.name}
                  fill
                  sizes="(max-width: 768px) 256px, 288px"
                  priority
                  className="object-cover object-top rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Floating University of Moratuwa Badge */}
          <div className="absolute -bottom-4 z-20 bg-[#070914]/95 backdrop-blur-md border border-[#2b2f6b]/60 rounded-2xl px-6 py-3 shadow-2xl text-center">
            <div className="font-mono text-xs font-semibold text-[#7c82fb] tracking-wider">
              {education[0]?.institution || "University of Moratuwa"}
            </div>
            <div className="font-mono text-[11px] text-zinc-400 mt-1">
              {education[0]?.degree || "BSc (Hons) IT"} · {education[0]?.year || "2024–Present"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
