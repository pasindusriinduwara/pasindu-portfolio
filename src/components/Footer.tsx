"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Lock } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Footer() {
  const pathname = usePathname();
  const { personalInfo } = usePortfolio();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-white/8 py-12 px-6 lg:px-12 bg-[#050508]/80 backdrop-blur-md relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="font-mono text-xs text-zinc-500 tracking-wider">
            © {new Date().getFullYear()} {personalInfo.name.toUpperCase()}
          </span>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <span className="font-mono text-[11px] text-zinc-600">
            Next.js Full-Stack Portfolio
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-mono text-[11px] text-emerald-400/80 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live & Operational
          </span>

          <Link
            href="/admin"
            data-hover
            title="Admin Module"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-indigo-300 hover:border-indigo-500/40 text-[11px] font-mono transition-all"
          >
            <Lock className="w-3 h-3 text-zinc-400" />
            <span>Admin</span>
          </Link>

          <button
            onClick={scrollToTop}
            data-hover
            title="Back to top"
            aria-label="Back to top"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
