import { PERSONAL_INFO, EDUCATION } from "@/data/portfolio";
import { GraduationCap, MapPin, Award, Languages, Handshake, Download } from "lucide-react";

export default function About() {
  const INFO_CARDS = [
    {
      icon: <GraduationCap className="w-4 h-4 text-indigo-400" />,
      label: "Education",
      val: "BSc (Hons) IT · University of Moratuwa, 2024–Present",
    },
    {
      icon: <MapPin className="w-4 h-4 text-emerald-400" />,
      label: "Location",
      val: PERSONAL_INFO.location,
    },
    {
      icon: <Award className="w-4 h-4 text-amber-400" />,
      label: "Achievement",
      val: PERSONAL_INFO.achievement,
    },
    {
      icon: <Languages className="w-4 h-4 text-purple-400" />,
      label: "Languages",
      val: PERSONAL_INFO.languages.join(" · "),
    },
    {
      icon: <Handshake className="w-4 h-4 text-cyan-400" />,
      label: "Seeking",
      val: "Software Engineering Internship",
    },
  ];

  return (
    <section id="about" className="min-h-screen py-24 px-6 lg:px-12 relative flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-indigo-400">
          01 / About Me
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Story */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-8">
              Building systems that <br />
              <span className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-8">
                actually solve problems.
              </span>
            </h2>

            <div className="space-y-5 text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
              <p>
                I am an Information Technology undergraduate at the{" "}
                <span className="text-zinc-200 font-medium">University of Moratuwa</span>,
                driven by real-world engineering rather than just theoretical coursework. I build
                full-stack systems end-to-end — from database schema optimization and robust API
                contracts to responsive, accessible client interfaces.
              </p>

              <p>
                My projects bridge modern web technologies with emerging paradigms: from
                decentralized applications leveraging the XRP Ledger for instant creator micropayments,
                to scalable enterprise-grade LMS architectures powered by Spring Boot and PostgreSQL, to
                embedded IoT environmental monitors designed in C.
              </p>

              <p>
                I care deeply about software architecture, type-safety, clean code, and creating
                developer and user experiences that leave a lasting impression.
              </p>
            </div>

            {/* Resume button */}
            <div className="mt-8 pt-6 border-t border-white/8 flex items-center gap-4">
              <a
                href="/api/resume"
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official CV (PDF)</span>
              </a>
              <span className="text-xs font-mono text-zinc-500">Updated for 2025/2026</span>
            </div>
          </div>

          {/* RIGHT: Credentials Cards & Education Mini */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Cards */}
            {INFO_CARDS.map((c) => (
              <div
                key={c.label}
                data-hover
                className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/8 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 shrink-0 mt-0.5">
                  {c.icon}
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 mb-1">
                    {c.label}
                  </div>
                  <div className="text-sm font-medium text-zinc-200">{c.val}</div>
                </div>
              </div>
            ))}

            {/* Academic Background */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/8 mt-6">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Academic Record</span>
              </div>

              <div className="space-y-3.5">
                {EDUCATION.map((edu, idx) => (
                  <div
                    key={edu.institution}
                    className={`flex items-start justify-between pb-3 ${
                      idx < EDUCATION.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-zinc-200">
                        {edu.institution}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {edu.degree} {edu.details && `· ${edu.details}`}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-indigo-400 shrink-0 ml-4">
                      {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
