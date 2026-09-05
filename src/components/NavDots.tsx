"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function NavDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActive(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Section shortcuts"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
    >
      {SECTIONS.map((sec, idx) => {
        const isCurrent = active === idx;
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            data-hover
            title={sec.label}
            aria-label={`Jump to ${sec.label}`}
            className="group flex items-center justify-end p-1 cursor-pointer focus:outline-none"
          >
            <span
              className={`mr-2 font-mono text-[10px] tracking-wider uppercase transition-all opacity-0 group-hover:opacity-100 ${
                isCurrent ? "text-indigo-400 opacity-100" : "text-zinc-500"
              }`}
            >
              {sec.label}
            </span>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isCurrent
                  ? "w-7 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                  : "w-2 bg-white/20 group-hover:bg-white/40"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
