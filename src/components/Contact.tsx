"use client";

import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  Check,
  Copy,
  Download,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export default function Contact() {
  const { personalInfo } = usePortfolio();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setFeedback(data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setFeedback(err.message);
      } else {
        setFeedback("Something went wrong. Please try again or reach out directly.");
      }
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen py-24 px-6 lg:px-12 relative flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block font-mono text-xs uppercase tracking-widest text-indigo-400 mb-3">
            04 / Contact & Inquiries
          </div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Let's build <br className="hidden sm:inline" />
            <span className="text-indigo-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.35)]">
              something great.
            </span>
          </h2>
          <p className="text-zinc-400 font-light text-base sm:text-lg max-w-xl mx-auto mt-4">
            Currently open for software engineering internships and high-impact full-stack
            collaborations. Send a direct message below or connect across platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Full-Stack Contact Form */}
          <div className="lg:col-span-7 bg-[#0a0a14]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/8">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="font-display text-xl font-bold text-white">
                Send a Direct Message
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Sarah Connor"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:bg-indigo-950/10 transition-all font-sans"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider"
                  >
                    Your Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="sarah@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:bg-indigo-950/10 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider"
                >
                  Subject / Topic
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Internship Opportunity / Project Collaboration"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:bg-indigo-950/10 transition-all font-sans"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider"
                >
                  Your Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell me about your team, project, or what you'd like to build together..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:bg-indigo-950/10 transition-all font-sans resize-none"
                />
              </div>

              {/* Status Alert Banner */}
              {status === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                data-hover
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Quick Connect Links */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Quick Email Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                Direct Email
              </div>
              <div className="text-lg font-mono text-white font-medium break-all">
                {personalInfo.email}
              </div>
              <button
                onClick={copyEmail}
                data-hover
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs hover:bg-indigo-600/30 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="p-4 rounded-xl bg-white/[0.02] border border-white/8 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400">LinkedIn</div>
                  <div className="text-xs text-zinc-200 font-semibold mt-0.5">
                    Connect Profile ↗
                  </div>
                </div>
              </a>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="p-4 rounded-xl bg-white/[0.02] border border-white/8 hover:border-white/20 hover:bg-white/[0.04] transition-all flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-white/10 text-zinc-200">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400">GitHub</div>
                  <div className="text-xs text-zinc-200 font-semibold mt-0.5">
                    Explore Code ↗
                  </div>
                </div>
              </a>

              <a
                href={`tel:${personalInfo.phone.replace(/\s+/g, "")}`}
                data-hover
                className="p-4 rounded-xl bg-white/[0.02] border border-white/8 hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400">Mobile Phone</div>
                  <div className="text-xs text-zinc-200 font-semibold mt-0.5">
                    {personalInfo.phone}
                  </div>
                </div>
              </a>

              <a
                href={personalInfo.resumeUrl || "/api/resume"}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="p-4 rounded-xl bg-white/[0.02] border border-white/8 hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400">Curriculum Vitae</div>
                  <div className="text-xs text-zinc-200 font-semibold mt-0.5">
                    Download CV PDF ↗
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
