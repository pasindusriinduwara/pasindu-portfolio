"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Hexagon, Settings, Disc } from "lucide-react";

export default function Skills() {
  const { data, personalInfo } = usePortfolio();

  // Helper to get category items from categorizedStack with default fallback
  const getCategoryItems = (catId: string, defaultItems: string[]) => {
    const cs = data.categorizedStack as Record<string, string[]> | undefined;
    if (cs && Array.isArray(cs[catId])) {
      return cs[catId];
    }
    return defaultItems;
  };

  const CATEGORIES = [
    {
      id: "languages",
      title: "LANGUAGES",
      icon: (
        <span className="font-mono text-sm font-bold text-[#6875f5] tracking-tight">
          {`{ }`}
        </span>
      ),
      titleColor: "text-[#6875f5]",
      bgColor: "bg-[#0b0d22]/80",
      borderColor: "border-[#252b66]/60 hover:border-[#384094]/80",
      glowColor: "shadow-[0_4px_30px_rgba(43,47,107,0.15)]",
      hasDot: true,
      defaultItems: ["Java", "TypeScript", "JavaScript", "C"],
      gridClass: "col-span-1",
    },
    {
      id: "frontend",
      title: "FRONTEND",
      icon: <Hexagon className="w-4 h-4 text-[#22d3ee] stroke-[2.2]" />,
      titleColor: "text-[#22d3ee]",
      bgColor: "bg-[#06151f]/80",
      borderColor: "border-[#14475e]/60 hover:border-[#206889]/80",
      glowColor: "shadow-[0_4px_30px_rgba(20,71,94,0.15)]",
      defaultItems: ["React", "Next.js", "Tailwind CSS"],
      gridClass: "col-span-1",
    },
    {
      id: "backend",
      title: "BACKEND",
      icon: <Settings className="w-4 h-4 text-[#34d399] stroke-[2.2]" />,
      titleColor: "text-[#34d399]",
      bgColor: "bg-[#071813]/80",
      borderColor: "border-[#13543e]/60 hover:border-[#1e7c5c]/80",
      glowColor: "shadow-[0_4px_30px_rgba(19,84,62,0.15)]",
      defaultItems: ["Node.js", "Express.js", "Spring Boot", "Spring Security"],
      gridClass: "col-span-1",
    },
  ];

  const SECOND_ROW_CATEGORIES = [
    {
      id: "databases",
      title: "DATABASES",
      icon: (
        <svg
          className="w-4 h-4 text-[#f59e0b]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 12l10 10 10-10L12 2z" />
          <path d="M12 7l-5 5 5 5 5-5-5-5z" fill="currentColor" fillOpacity="0.2" />
        </svg>
      ),
      titleColor: "text-[#f59e0b]",
      bgColor: "bg-[#171206]/80",
      borderColor: "border-[#523b0f]/60 hover:border-[#7d5917]/80",
      glowColor: "shadow-[0_4px_30px_rgba(82,59,15,0.15)]",
      defaultItems: ["PostgreSQL", "MySQL", "Supabase"],
      gridClass: "md:col-span-5",
    },
    {
      id: "tools",
      title: "TOOLS & PLATFORMS",
      icon: <Disc className="w-4 h-4 text-[#c084fc] stroke-[2.2]" />,
      titleColor: "text-[#c084fc]",
      bgColor: "bg-[#140b22]/80",
      borderColor: "border-[#482070]/60 hover:border-[#6f32ad]/80",
      glowColor: "shadow-[0_4px_30px_rgba(72,32,112,0.15)]",
      defaultItems: ["Git", "GitHub", "Cloudinary", "Web3Auth", "XRPL"],
      gridClass: "md:col-span-7",
    },
  ];

  // Spoken languages parser
  const languagesList = Array.isArray(personalInfo.languages)
    ? personalInfo.languages
    : ["English", "Sinhala"];

  const languageFlags: Record<string, string> = {
    english: "GB",
    sinhala: "LK",
    french: "FR",
    german: "DE",
    japanese: "JP",
  };

  return (
    <section
      id="skills"
      className="min-h-screen py-24 px-6 lg:px-12 relative flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[#7c82fb]">
          02 / SKILLS
        </div>

        {/* Section Title */}
        <h2 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-10">
          My <span className="text-[#6875f5]">stack</span>
        </h2>

        {/* TOP ROW: 3 Cards (Languages, Frontend, Backend) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const items = getCategoryItems(cat.id, cat.defaultItems);
            return (
              <div
                key={cat.id}
                className={`relative rounded-2xl p-6 ${cat.bgColor} border ${cat.borderColor} ${cat.glowColor} backdrop-blur-md transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center gap-2.5 mb-6">
                    {cat.icon}
                    <span
                      className={`font-mono text-xs font-bold tracking-wider ${cat.titleColor}`}
                    >
                      {cat.title}
                    </span>
                  </div>

                  {/* Tech Chips */}
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((tool) => (
                      <span
                        key={tool}
                        className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200 text-sm font-medium hover:border-white/20 hover:bg-white/[0.07] hover:text-white transition-all cursor-default shadow-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dot accent on Languages card */}
                {cat.hasDot && (
                  <div className="self-end mt-4">
                    <div className="w-4 h-4 rounded-full bg-[#6875f5] shadow-[0_0_12px_#6875f5]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SECOND ROW: 2 Cards (Databases & Tools) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
          {SECOND_ROW_CATEGORIES.map((cat) => {
            const items = getCategoryItems(cat.id, cat.defaultItems);
            return (
              <div
                key={cat.id}
                className={`${cat.gridClass} relative rounded-2xl p-6 ${cat.bgColor} border ${cat.borderColor} ${cat.glowColor} backdrop-blur-md transition-all duration-300`}
              >
                {/* Card Header */}
                <div className="flex items-center gap-2.5 mb-6">
                  {cat.icon}
                  <span
                    className={`font-mono text-xs font-bold tracking-wider ${cat.titleColor}`}
                  >
                    {cat.title}
                  </span>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2.5">
                  {items.map((tool) => (
                    <span
                      key={tool}
                      className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200 text-sm font-medium hover:border-white/20 hover:bg-white/[0.07] hover:text-white transition-all cursor-default shadow-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ROW: Spoken Languages Bar */}
        <div className="mt-5 w-full rounded-2xl bg-[#080811]/90 border border-white/[0.08] p-5 flex flex-wrap items-center gap-3.5 backdrop-blur-md">
          <span className="font-mono text-xs font-semibold tracking-widest text-zinc-500 uppercase mr-2">
            SPOKEN
          </span>

          {languagesList.map((lang) => {
            const countryCode =
              languageFlags[lang.toLowerCase()] ||
              lang.substring(0, 2).toUpperCase();
            return (
              <div
                key={lang}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200 text-sm font-medium flex items-center gap-2 hover:border-white/20 transition-all cursor-default"
              >
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/10 px-1.5 py-0.5 rounded">
                  {countryCode}
                </span>
                <span>{lang}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
