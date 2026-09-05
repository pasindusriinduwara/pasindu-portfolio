"use client";

import { useEffect, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { usePathname } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { personalInfo } = usePortfolio();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050508]/85 backdrop-blur-md border-b border-white/8 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#home"
          data-hover
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono text-indigo-400 font-bold text-sm shadow-[0_0_12px_rgba(99,102,241,0.25)] group-hover:border-indigo-400 group-hover:shadow-[0_0_18px_rgba(99,102,241,0.4)] transition-all">
            PS
          </div>
          <span className="font-display font-bold text-white text-base tracking-tight hidden sm:inline-block">
            Pasindu<span className="text-indigo-400">.sri</span>
          </span>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/8 rounded-full px-4 py-1.5 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.label}
                href={item.href}
                data-hover
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  isActive
                    ? "text-white bg-indigo-600/30 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/api/resume"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            title="Download CV"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Resume</span>
            <Download className="w-3 h-3 text-zinc-400" />
          </a>

          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            title="GitHub"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            title="LinkedIn"
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
