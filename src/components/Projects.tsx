"use client";

import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ArrowUpRight, CheckCircle2, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function Projects() {
  const { projects } = usePortfolio();
  const [activeProject, setActiveProject] = useState(0);

  const proj = projects[activeProject] || projects[0];

  if (!proj) return null;

  return (
    <section
      id="projects"
      className="min-h-screen py-24 px-6 lg:px-12 relative flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-indigo-400">
          03 / Selected Works
        </div>

        <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-12">
          Featured <span className="text-indigo-400">Engineering Projects</span>
        </h2>

        {/* Interactive Showcase Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a14]/60 backdrop-blur-md shadow-2xl">
          {/* TAB SELECTOR COLUMN */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.01]">
            {projects.map((p, idx) => {
              const isSelected = activeProject === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(idx)}
                  data-hover
                  className={`w-full text-left p-6 transition-all border-b border-white/5 last:border-b-0 cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? "bg-white/[0.04] border-l-4"
                      : "hover:bg-white/[0.02] border-l-4 border-l-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    borderLeftColor: isSelected ? p.color : "transparent",
                  }}
                >
                  <span className="text-2xl p-2 rounded-xl bg-white/5 shrink-0 border border-white/5">
                    {p.emoji}
                  </span>
                  <div>
                    <div className="font-display font-bold text-base text-white mb-1">
                      {p.name}
                    </div>
                    <div
                      className="font-mono text-xs font-medium tracking-wide"
                      style={{ color: isSelected ? p.color : "rgba(240,240,245,0.4)" }}
                    >
                      {p.type} · {p.year}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* PROJECT DETAILS COLUMN */}
          <div className="md:col-span-8 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient project color splash */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 transition-all duration-700"
              style={{ background: proj.color }}
            />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{proj.emoji}</span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {proj.name}
                    </h3>
                    <span
                      className="font-mono text-xs font-semibold tracking-wider uppercase"
                      style={{ color: proj.color }}
                    >
                      {proj.type} · {proj.year}
                    </span>
                  </div>
                </div>

                {/* Live / Code badge */}
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-zinc-300">
                  Production Ready
                </span>
              </div>

              {/* Summary */}
              <p className="text-zinc-300 font-light text-base sm:text-lg leading-relaxed mb-6 max-w-2xl">
                {proj.summary}
              </p>

              {/* Key Highlights */}
              {proj.highlights && (
                <div className="mb-8 space-y-2.5">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Key Highlights:
                  </div>
                  {proj.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: proj.color }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech Stack */}
              <div className="mb-8">
                <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-3">
                  Architecture & Tools:
                </div>
                <div className="flex flex-wrap gap-2">
                  {proj.tools.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-3 py-1 rounded-lg border backdrop-blur-sm"
                      style={{
                        background: proj.glow,
                        color: proj.color,
                        borderColor: `${proj.color}40`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
              {proj.live && (
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-semibold text-white transition-all shadow-md hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${proj.color}, #4f46e5)`,
                  }}
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}

              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs text-zinc-300 bg-white/5 border border-white/10 hover:text-white hover:border-white/25 transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>View Source</span>
                </a>
              )}

              <a
                href={`/api/projects?q=${encodeURIComponent(proj.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs text-zinc-400 bg-white/[0.02] border border-white/5 hover:text-indigo-400 hover:border-indigo-500/20 transition-all ml-auto"
                title="Query backend JSON API"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON API</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
