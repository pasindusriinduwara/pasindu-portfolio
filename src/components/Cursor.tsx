"use client";

import { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHov(Boolean(target?.closest("button, a, input, textarea, [data-hover]")));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate(${pos.x - (hov ? 22 : 8)}px, ${pos.y - (hov ? 22 : 8)}px)`,
        width: hov ? 44 : 16,
        height: hov ? 44 : 16,
        borderRadius: "50%",
        background: hov ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.75)",
        border: hov ? "1.5px solid rgba(99,102,241,0.7)" : "none",
        transition: "width 0.2s cubic-bezier(0.2,0.8,0.2,1), height 0.2s cubic-bezier(0.2,0.8,0.2,1), transform 0.08s linear, background 0.2s",
        mixBlendMode: "screen",
      }}
    />
  );
}
