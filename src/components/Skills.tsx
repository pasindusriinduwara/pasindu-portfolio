"use client";

import { useState } from "react";
import { SKILLS, STACK } from "@/data/portfolio";
import { Code2, Cpu, Database, Globe, Layers } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Technologies" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Data & Cloud" },
  { id: "web3", label: "Web3 & IoT" },
];

const CATEGORY_MAP: Record<string, string[]> = {
  frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"],
  backend: ["Java", "Spring Boot", "Node.js", "Express", "JWT", "C"],
  database: ["PostgreSQL", "MySQL", "Supabase", "Cloudinary", "Git"],
  web3: ["XRPL", "Web3Auth", "C"],
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredStack =
    activeCategory === "all"
      ? STACK
      : STACK.filter((tool) =>
          CATEGORY_MAP[activeCategory]?.some(
            (item) => item.toLowerCase() === tool.toLowerCase()
          )
        );

  return (
    <section
      id="skills"
      className="min-h-screen py-24 px-6 lg:px-12 relative flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-indigo-400">
          02 / Skills & Toolkit
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Core Skill Proficiencies */}
          <div className="lg:col-span-6">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-8">
              Core <span className="text-indigo-400">Proficiencies</span>
            </h2>

            <div className="space-y-5">
              {SKILLS.map((skill) => (
                <div key={skill.label} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors">
                      {skill.label}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 group-hover:text-indigo-400 transition-colors">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Progress Track */}
                  <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Complete Tech Stack with Interactive Category Filter */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Full <span className="text-emerald-400">Toolkit</span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  data-hover
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-indigo-600/30 text-white border border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                      : "bg-white/[0.03] text-zinc-400 border border-white/8 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {filteredStack.map((tool, idx) => {
                const isPurple = idx % 3 === 0;
                const isGreen = idx % 3 === 1;

                return (
                  <span
                    key={tool}
                    data-hover
                    className={`font-mono text-xs px-3.5 py-1.5 rounded-lg border transition-all duration-200 cursor-default hover:scale-105 ${
                      isPurple
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/25 hover:border-indigo-400 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                        : isGreen
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        : "bg-amber-500/10 text-amber-300 border-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    }`}
                  >
                    {tool}
                  </span>
                );
              })}
            </div>

            {/* Competency Highlights */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 flex items-start gap-3">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Full-Stack Web</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Next.js, React 19, REST APIs</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 flex items-start gap-3">
                <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Enterprise Backend</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Spring Boot, Java, JWT Auth</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 flex items-start gap-3">
                <Database className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Databases & Storage</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">PostgreSQL, Supabase, Cloudinary</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 flex items-start gap-3">
                <Cpu className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Web3 & Embedded</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">XRPL, Web3Auth, ESP32 (C)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
