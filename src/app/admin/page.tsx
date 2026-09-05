"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Shield,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Mail,
  Settings,
  Download,
  Upload,
  AlertCircle,
  Sparkles,
  LogOut,
  CheckCircle2,
  Sliders,
  Send,
  Hexagon,
  Disc,
} from "lucide-react";
import { PortfolioData, Project, Skill, Education, ContactMessage, CategorizedStack } from "@/types";

type ActiveTab =
  | "overview"
  | "personal"
  | "projects"
  | "skills"
  | "education"
  | "messages"
  | "settings";

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App & Data state
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check auth session
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const json = await res.json();
      setIsAuthenticated(json.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch portfolio data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/portfolio");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        showToast("Failed to load portfolio data", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error loading data", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch contact messages
  const fetchMessages = useCallback(async () => {
    try {
      setMessagesLoading(true);
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      fetchMessages();
    }
  }, [isAuthenticated, fetchData, fetchMessages]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setIsAuthenticated(true);
        setPasswordInput("");
        showToast("Welcome to Admin Console!", "success");
      } else {
        setLoginError(resData.error || "Incorrect admin password");
      }
    } catch {
      setLoginError("Login failed. Check server connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      showToast("Logged out successfully", "info");
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Save all portfolio data
  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        showToast("Portfolio details updated live!", "success");
        // Trigger live refresh in same browser tab
        window.dispatchEvent(new Event("portfolio_updated"));
      } else {
        showToast(resData.error || "Failed to save updates", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to communicate with server", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default CV data
  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all portfolio details to default CV content?")) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setData(resData.data);
        showToast("Reset to default CV details successfully!", "info");
        window.dispatchEvent(new Event("portfolio_updated"));
      } else {
        showToast("Reset failed", "error");
      }
    } catch {
      showToast("Reset failed due to server error", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast("Message deleted", "info");
      } else {
        showToast("Could not delete message", "error");
      }
    } catch {
      showToast("Server error deleting message", "error");
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Portfolio backup downloaded!", "success");
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.personalInfo && Array.isArray(parsed.projects)) {
          setData(parsed);
          showToast("Backup loaded into editor! Click 'Save All Changes' to apply.", "info");
        } else {
          showToast("Invalid portfolio JSON schema", "error");
        }
      } catch {
        showToast("Failed to parse JSON file", "error");
      }
    };
    reader.readAsText(file);
  };

  // New Password Change
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      showToast("Password must be at least 4 characters", "error");
      return;
    }
    setIsChangingPass(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        showToast("Admin password updated successfully!", "success");
        setNewPassword("");
      } else {
        showToast(resData.error || "Password change failed", "error");
      }
    } catch {
      showToast("Error updating password", "error");
    } finally {
      setIsChangingPass(false);
    }
  };

  // ----------------------------------------------------
  // RENDER: Loading or Unauthenticated (Login Screen)
  // ----------------------------------------------------
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
        <div className="flex items-center gap-3 font-mono text-sm text-zinc-400">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
          <span>Checking admin credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] px-4 relative overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="p-8 rounded-2xl bg-[#0a0a14]/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-950/40">
            {/* Header / Lock Icon */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                Portfolio Admin Console
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Enter your password to manage portfolio details
              </p>
            </div>

            {/* Default credential hint */}
            <div className="mb-6 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-center">
              <span className="font-mono text-xs text-indigo-300">
                Default Access Password: <code className="bg-indigo-900/50 px-2 py-0.5 rounded text-white font-bold">admin123</code>
              </span>
            </div>

            {loginError && (
              <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoFocus
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:bg-indigo-950/20 transition-all font-mono pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span>← Back to Public Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: Authenticated Dashboard
  // ----------------------------------------------------
  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] text-white">
        <div className="flex items-center gap-3 font-mono text-sm text-zinc-400">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
          <span>Loading portfolio data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-[#f0f0f5] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <div
            className={`px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-3 font-mono text-xs border ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/40"
                : "bg-indigo-950/90 border-indigo-500/40 text-indigo-200 shadow-indigo-950/40"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#07070d]/90 backdrop-blur-md border-b border-white/8 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono text-indigo-400 font-bold text-sm shadow-[0_0_10px_rgba(99,102,241,0.3)]">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-base tracking-tight">
                  Portfolio CMS
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Live Sync
                </span>
              </div>
              <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
                Managing: {data.personalInfo.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-all"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-xs shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* SIDEBAR TABS */}
        <nav className="md:col-span-3 space-y-1">
          <div className="p-3 rounded-2xl bg-[#0a0a14]/60 border border-white/8 backdrop-blur-md space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 px-3 py-1.5">
              Manage Sections
            </div>

            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<Sparkles className="w-4 h-4" />}
              label="Overview"
              badge={`${data.projects.length} proj`}
            />

            <TabButton
              active={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
              icon={<User className="w-4 h-4" />}
              label="Profile & Bio"
            />

            <TabButton
              active={activeTab === "projects"}
              onClick={() => setActiveTab("projects")}
              icon={<FolderGit2 className="w-4 h-4" />}
              label="Projects Manager"
              badge={String(data.projects.length)}
            />

            <TabButton
              active={activeTab === "skills"}
              onClick={() => setActiveTab("skills")}
              icon={<Cpu className="w-4 h-4" />}
              label="My Stack & Toolkit"
              badge={`${(data.stack || []).length} tech`}
            />

            <TabButton
              active={activeTab === "education"}
              onClick={() => setActiveTab("education")}
              icon={<GraduationCap className="w-4 h-4" />}
              label="Education Record"
              badge={String(data.education.length)}
            />

            <TabButton
              active={activeTab === "messages"}
              onClick={() => {
                setActiveTab("messages");
                fetchMessages();
              }}
              icon={<Mail className="w-4 h-4" />}
              label="Contact Inquiries"
              badge={messages.length > 0 ? String(messages.length) : undefined}
              badgeColor={messages.length > 0 ? "bg-indigo-500/30 text-indigo-300" : undefined}
            />

            <div className="pt-2 mt-2 border-t border-white/5">
              <TabButton
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
                icon={<Settings className="w-4 h-4" />}
                label="Backup & Settings"
              />
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/15 hidden md:block">
            <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Hot Sync</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Edits saved here immediately update the live portfolio, API endpoints, and resume links without redeploying.
            </p>
          </div>
        </nav>

        {/* CONTENT AREA */}
        <main className="md:col-span-9">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0a0a14]/60 border border-white/8 backdrop-blur-md min-h-[600px]">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <OverviewTab
                data={data}
                messagesCount={messages.length}
                onSelectTab={setActiveTab}
                onUpdateStatus={(newStatus) => {
                  setData({
                    ...data,
                    personalInfo: { ...data.personalInfo, internshipStatus: newStatus },
                  });
                }}
              />
            )}

            {/* PERSONAL INFO TAB */}
            {activeTab === "personal" && (
              <PersonalInfoTab
                personalInfo={data.personalInfo}
                onChange={(updated) =>
                  setData({ ...data, personalInfo: { ...data.personalInfo, ...updated } })
                }
              />
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <ProjectsTab
                projects={data.projects}
                onChange={(updatedProjects) =>
                  setData({ ...data, projects: updatedProjects })
                }
                showToast={showToast}
              />
            )}

            {/* MY STACK & TOOLKIT TAB */}
            {activeTab === "skills" && (
              <SkillsTab
                categorizedStack={
                  data.categorizedStack || {
                    languages: ["Java", "TypeScript", "JavaScript", "C"],
                    frontend: ["React", "Next.js", "Tailwind CSS"],
                    backend: ["Node.js", "Express.js", "Spring Boot", "Spring Security"],
                    databases: ["PostgreSQL", "MySQL", "Supabase"],
                    tools: ["Git", "GitHub", "Cloudinary", "Web3Auth", "XRPL"],
                  }
                }
                spokenLanguages={data.personalInfo.languages}
                onChangeCategorizedStack={(newCat) => {
                  const allTools = [
                    ...newCat.languages,
                    ...newCat.frontend,
                    ...newCat.backend,
                    ...newCat.databases,
                    ...newCat.tools,
                  ];
                  setData({
                    ...data,
                    categorizedStack: newCat,
                    stack: allTools,
                  });
                }}
                onChangeSpokenLanguages={(newSpoken) => {
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      languages: newSpoken,
                    },
                  });
                }}
                showToast={showToast}
              />
            )}

            {/* EDUCATION TAB */}
            {activeTab === "education" && (
              <EducationTab
                education={data.education}
                onChange={(newEdu) => setData({ ...data, education: newEdu })}
                showToast={showToast}
              />
            )}

            {/* MESSAGES TAB */}
            {activeTab === "messages" && (
              <MessagesTab
                messages={messages}
                isLoading={messagesLoading}
                onDelete={handleDeleteMessage}
                onRefresh={fetchMessages}
              />
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <SettingsTab
                onExport={handleExportJSON}
                onImport={handleImportJSON}
                onReset={handleReset}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                onChangePassword={handleChangePassword}
                isChangingPass={isChangingPass}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUBCOMPONENT: Navigation Button
// ----------------------------------------------------
function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
  badgeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
        active
          ? "bg-indigo-600/20 text-white border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
          : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={active ? "text-indigo-400" : "text-zinc-500"}>{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] ${
            badgeColor || "bg-white/10 text-zinc-300"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ----------------------------------------------------
// TAB 1: OVERVIEW
// ----------------------------------------------------
function OverviewTab({
  data,
  messagesCount,
  onSelectTab,
  onUpdateStatus,
}: {
  data: PortfolioData;
  messagesCount: number;
  onSelectTab: (tab: ActiveTab) => void;
  onUpdateStatus: (status: string) => void;
}) {
  const STATUS_PRESETS = [
    "Available for internship",
    "Open to full-time roles",
    "Available for freelance projects",
    "Currently occupied",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
          Portfolio Overview & Status
        </h2>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Real-time summary of portfolio statistics and quick toggles
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectTab("projects")}
          className="p-5 rounded-xl bg-white/[0.02] border border-white/8 hover:border-indigo-500/40 transition-all cursor-pointer group"
        >
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Projects
          </div>
          <div className="font-display text-3xl font-bold text-indigo-400 group-hover:scale-105 transition-transform">
            {data.projects.length}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">Featured Works</div>
        </div>

        <div
          onClick={() => onSelectTab("skills")}
          className="p-5 rounded-xl bg-white/[0.02] border border-white/8 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Skills / Stack
          </div>
          <div className="font-display text-3xl font-bold text-emerald-400 group-hover:scale-105 transition-transform">
            {data.skills.length + data.stack.length}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">Technologies</div>
        </div>

        <div
          onClick={() => onSelectTab("education")}
          className="p-5 rounded-xl bg-white/[0.02] border border-white/8 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Education
          </div>
          <div className="font-display text-3xl font-bold text-amber-400 group-hover:scale-105 transition-transform">
            {data.education.length}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">Milestones</div>
        </div>

        <div
          onClick={() => onSelectTab("messages")}
          className="p-5 rounded-xl bg-white/[0.02] border border-white/8 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Inquiries
          </div>
          <div className="font-display text-3xl font-bold text-purple-400 group-hover:scale-105 transition-transform">
            {messagesCount}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-1">Messages Received</div>
        </div>
      </div>

      {/* Availability Status Quick Switcher */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Live Availability Status Badge
            </div>
            <div className="text-xs text-zinc-400 font-sans mt-0.5">
              This status displays prominently at the top of the homepage Hero banner.
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            ● Active
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {STATUS_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onUpdateStatus(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                data.personalInfo.internshipStatus === preset
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        <div>
          <input
            type="text"
            value={data.personalInfo.internshipStatus}
            onChange={(e) => onUpdateStatus(e.target.value)}
            placeholder="Or type custom status..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Quick Profile Summary */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
        <div className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
          Current Bio Snapshot
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-zinc-500">Name: </span>
            <span className="text-zinc-200">{data.personalInfo.name}</span>
          </div>
          <div>
            <span className="text-zinc-500">Email: </span>
            <span className="text-zinc-200">{data.personalInfo.email}</span>
          </div>
          <div>
            <span className="text-zinc-500">Title: </span>
            <span className="text-zinc-200">{data.personalInfo.title}</span>
          </div>
          <div>
            <span className="text-zinc-500">Location: </span>
            <span className="text-zinc-200">{data.personalInfo.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 2: PERSONAL INFO
// ----------------------------------------------------
function PersonalInfoTab({
  personalInfo,
  onChange,
}: {
  personalInfo: PortfolioData["personalInfo"];
  onChange: (updated: Partial<PortfolioData["personalInfo"]>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
          Personal Information & Bio
        </h2>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Configure identity, headline, contacts, and announcement achievements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Short / Display Name
          </label>
          <input
            type="text"
            value={personalInfo.shortName}
            onChange={(e) => onChange({ shortName: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Professional Title / Headline
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Hero Tagline / Bio Subtitle
          </label>
          <textarea
            rows={3}
            value={personalInfo.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="text"
            value={personalInfo.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Location
          </label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Specialization / Focus Highlight
          </label>
          <input
            type="text"
            value={personalInfo.achievement}
            onChange={(e) => onChange({ achievement: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            value={personalInfo.linkedin}
            onChange={(e) => onChange({ linkedin: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            GitHub Profile URL
          </label>
          <input
            type="url"
            value={personalInfo.github}
            onChange={(e) => onChange({ github: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Avatar Image Path or URL
          </label>
          <input
            type="text"
            value={personalInfo.avatar}
            onChange={(e) => onChange({ avatar: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Resume / CV Endpoint URL
          </label>
          <input
            type="text"
            value={personalInfo.resumeUrl}
            onChange={(e) => onChange({ resumeUrl: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-mono text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
            Spoken Languages (Comma separated)
          </label>
          <input
            type="text"
            value={Array.isArray(personalInfo.languages) ? personalInfo.languages.join(", ") : personalInfo.languages}
            onChange={(e) =>
              onChange({
                languages: e.target.value.split(",").map((l) => l.trim()).filter(Boolean),
              })
            }
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 3: PROJECTS MANAGER
// ----------------------------------------------------
function ProjectsTab({
  projects,
  onChange,
  showToast,
}: {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddProject = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 0;
    const newProject: Project = {
      id: newId,
      name: "New Project",
      emoji: "🚀",
      type: "Full-Stack Web App",
      year: new Date().getFullYear().toString(),
      color: "#6366f1",
      glow: "rgba(99,102,241,0.15)",
      summary: "Brief description of the architectural decisions and features...",
      tools: ["React", "TypeScript", "Node.js"],
      github: "https://github.com/pasindusri",
      live: "https://example.com",
      highlights: [
        "Feature highlight bullet point 1",
        "Feature highlight bullet point 2",
      ],
    };
    const updated = [...projects, newProject];
    onChange(updated);
    setEditingIndex(updated.length - 1);
    showToast("New project created. Edit its details below!", "success");
  };

  const handleDeleteProject = (index: number) => {
    if (!confirm(`Delete project "${projects[index]?.name}"?`)) return;
    const updated = projects.filter((_, idx) => idx !== index);
    onChange(updated);
    if (editingIndex === index) setEditingIndex(null);
    showToast("Project deleted", "info");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === projects.length - 1) return;
    const target = direction === "up" ? index - 1 : index + 1;
    const clone = [...projects];
    const temp = clone[index];
    clone[index] = clone[target];
    clone[target] = temp;
    onChange(clone);
    setEditingIndex(target);
  };

  const updateCurrent = (fields: Partial<Project>) => {
    if (editingIndex === null) return;
    const updated = [...projects];
    updated[editingIndex] = { ...updated[editingIndex], ...fields };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Projects Portfolio Manager
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Showcase, reorder, or update your software engineering projects
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-mono transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List Card View */}
      <div className="space-y-3">
        {projects.map((p, idx) => {
          const isSelected = editingIndex === idx;
          return (
            <div
              key={p.id}
              className={`p-4 rounded-xl border transition-all ${
                isSelected
                  ? "bg-white/[0.04] border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  : "bg-white/[0.01] border-white/8 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div
                  onClick={() => setEditingIndex(isSelected ? null : idx)}
                  className="flex items-center gap-3.5 flex-1 cursor-pointer"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white/5 shrink-0 border border-white/5">
                    {p.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{p.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-400">
                        {p.year}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                        · {p.type}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                      {p.summary}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === projects.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(isSelected ? null : idx)}
                    className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-mono cursor-pointer"
                  >
                    {isSelected ? "Close" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(idx)}
                    title="Delete Project"
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expandable Project Editor */}
              {isSelected && (
                <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updateCurrent({ name: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                        Category / Type (e.g. Blockchain · AI)
                      </label>
                      <input
                        type="text"
                        value={p.type}
                        onChange={(e) => updateCurrent({ type: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                          Emoji Icon
                        </label>
                        <input
                          type="text"
                          value={p.emoji}
                          onChange={(e) => updateCurrent({ emoji: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-center text-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={p.year}
                          onChange={(e) => updateCurrent({ year: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                        Theme Color (HEX)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={p.color}
                          onChange={(e) => updateCurrent({ color: e.target.value })}
                          className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={p.color}
                          onChange={(e) => updateCurrent({ color: e.target.value })}
                          className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                        Glow RGBA
                      </label>
                      <input
                        type="text"
                        value={p.glow}
                        onChange={(e) => updateCurrent({ glow: e.target.value })}
                        placeholder="rgba(16,185,129,0.15)"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                      Summary
                    </label>
                    <textarea
                      rows={2}
                      value={p.summary}
                      onChange={(e) => updateCurrent({ summary: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={p.github || ""}
                        onChange={(e) => updateCurrent({ github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={p.live || ""}
                        onChange={(e) => updateCurrent({ live: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Tools Tags */}
                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                      Tools & Technologies (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={p.tools.join(", ")}
                      onChange={(e) =>
                        updateCurrent({
                          tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Highlights Bullet Points */}
                  <div>
                    <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                      Key Highlights (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.highlights || []).join("\n")}
                      onChange={(e) =>
                        updateCurrent({
                          highlights: e.target.value.split("\n").map((h) => h.trim()).filter(Boolean),
                        })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-sans resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 4: MY STACK & TOOLKIT MANAGER
// ----------------------------------------------------
function SkillsTab({
  categorizedStack,
  spokenLanguages,
  onChangeCategorizedStack,
  onChangeSpokenLanguages,
  showToast,
}: {
  categorizedStack: CategorizedStack;
  spokenLanguages: string[] | string;
  onChangeCategorizedStack: (newCat: CategorizedStack) => void;
  onChangeSpokenLanguages: (newLanguages: string[]) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}) {
  const [inputs, setInputs] = useState<Record<string, string>>({
    languages: "",
    frontend: "",
    backend: "",
    databases: "",
    tools: "",
    spoken: "",
  });

  const parsedSpoken: string[] = Array.isArray(spokenLanguages)
    ? spokenLanguages
    : typeof spokenLanguages === "string" && spokenLanguages
    ? (spokenLanguages as string).split(",").map((s) => s.trim()).filter(Boolean)
    : ["English", "Sinhala"];

  const CATEGORY_CONFIGS = [
    {
      key: "languages" as keyof CategorizedStack,
      title: "LANGUAGES",
      icon: (
        <span className="font-mono text-sm font-bold text-[#6875f5] tracking-tight">
          {`{ }`}
        </span>
      ),
      titleColor: "text-[#6875f5]",
      borderColor: "border-[#252b66]/60",
      bgColor: "bg-[#0b0d22]/80",
      accentBg: "bg-[#6875f5]/10 text-[#6875f5] border-[#6875f5]/30 hover:bg-[#6875f5]/20",
      placeholder: "Add language (e.g. Python, Rust, Go)...",
    },
    {
      key: "frontend" as keyof CategorizedStack,
      title: "FRONTEND",
      icon: <Hexagon className="w-4 h-4 text-[#22d3ee] stroke-[2.2]" />,
      titleColor: "text-[#22d3ee]",
      borderColor: "border-[#14475e]/60",
      bgColor: "bg-[#06151f]/80",
      accentBg: "bg-[#22d3ee]/10 text-[#22d3ee] border-[#22d3ee]/30 hover:bg-[#22d3ee]/20",
      placeholder: "Add frontend framework/lib (e.g. Vue, Svelte, Redux)...",
    },
    {
      key: "backend" as keyof CategorizedStack,
      title: "BACKEND",
      icon: <Settings className="w-4 h-4 text-[#34d399] stroke-[2.2]" />,
      titleColor: "text-[#34d399]",
      borderColor: "border-[#13543e]/60",
      bgColor: "bg-[#071813]/80",
      accentBg: "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30 hover:bg-[#34d399]/20",
      placeholder: "Add backend framework/tool (e.g. NestJS, Django, FastAPI)...",
    },
    {
      key: "databases" as keyof CategorizedStack,
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
      borderColor: "border-[#523b0f]/60",
      bgColor: "bg-[#171206]/80",
      accentBg: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30 hover:bg-[#f59e0b]/20",
      placeholder: "Add database/storage (e.g. MongoDB, Redis, SQLite)...",
    },
    {
      key: "tools" as keyof CategorizedStack,
      title: "TOOLS & PLATFORMS",
      icon: <Disc className="w-4 h-4 text-[#c084fc] stroke-[2.2]" />,
      titleColor: "text-[#c084fc]",
      borderColor: "border-[#482070]/60",
      bgColor: "bg-[#140b22]/80",
      accentBg: "bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30 hover:bg-[#c084fc]/20",
      placeholder: "Add tool/platform (e.g. Docker, AWS, Figma)...",
    },
  ];

  const handleAddChip = (key: keyof CategorizedStack, e: React.FormEvent) => {
    e.preventDefault();
    const val = (inputs[key] || "").trim();
    if (!val) return;

    const currentList = categorizedStack[key] || [];
    if (currentList.some((item) => item.toLowerCase() === val.toLowerCase())) {
      showToast(`"${val}" is already in this category`, "info");
      return;
    }

    const updated = {
      ...categorizedStack,
      [key]: [...currentList, val],
    };
    onChangeCategorizedStack(updated);
    setInputs((prev) => ({ ...prev, [key]: "" }));
    showToast(`Added "${val}" to ${key.toUpperCase()}`, "success");
  };

  const handleRemoveChip = (key: keyof CategorizedStack, itemToRemove: string) => {
    const currentList = categorizedStack[key] || [];
    const updated = {
      ...categorizedStack,
      [key]: currentList.filter((item) => item !== itemToRemove),
    };
    onChangeCategorizedStack(updated);
    showToast(`Removed "${itemToRemove}" from ${key.toUpperCase()}`, "info");
  };

  const handleAddSpoken = (e: React.FormEvent) => {
    e.preventDefault();
    const val = (inputs.spoken || "").trim();
    if (!val) return;

    if (parsedSpoken.some((item) => item.toLowerCase() === val.toLowerCase())) {
      showToast(`"${val}" already exists in spoken languages`, "info");
      return;
    }

    onChangeSpokenLanguages([...parsedSpoken, val]);
    setInputs((prev) => ({ ...prev, spoken: "" }));
    showToast(`Added spoken language "${val}"`, "success");
  };

  const handleRemoveSpoken = (itemToRemove: string) => {
    onChangeSpokenLanguages(parsedSpoken.filter((item) => item !== itemToRemove));
    showToast(`Removed spoken language "${itemToRemove}"`, "info");
  };

  const totalTechCount = Object.values(categorizedStack).reduce(
    (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            My Stack & Toolkit Manager
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage the 5 categorized technology cards and spoken languages shown on your portfolio
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{totalTechCount} Technologies Total</span>
        </div>
      </div>

      {/* 5 CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATEGORY_CONFIGS.map((cat) => {
          const items = categorizedStack[cat.key] || [];
          return (
            <div
              key={cat.key}
              className={`p-5 rounded-2xl ${cat.bgColor} border ${cat.borderColor} backdrop-blur-md flex flex-col justify-between space-y-4`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    {cat.icon}
                    <span className={`font-mono text-xs font-bold tracking-wider ${cat.titleColor}`}>
                      {cat.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {items.length} items
                  </span>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-2 min-h-[42px]">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200 text-xs font-medium hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
                      onClick={() => handleRemoveChip(cat.key, item)}
                      title="Click to delete"
                    >
                      <span>{item}</span>
                      <X className="w-3 h-3 text-zinc-500 group-hover:text-rose-400 transition-colors" />
                    </span>
                  ))}
                </div>
              </div>

              {/* Add form */}
              <form onSubmit={(e) => handleAddChip(cat.key, e)} className="flex gap-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={inputs[cat.key] || ""}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, [cat.key]: e.target.value }))
                  }
                  placeholder={cat.placeholder}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          );
        })}
      </div>

      {/* SPOKEN LANGUAGES CARD */}
      <div className="p-5 rounded-2xl bg-[#080811]/90 border border-white/[0.08] backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-wider text-zinc-300">
              🌐 SPOKEN LANGUAGES
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              (Appears in bottom bar of My stack)
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {parsedSpoken.length} languages
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {parsedSpoken.map((lang) => (
            <span
              key={lang}
              onClick={() => handleRemoveSpoken(lang)}
              title="Click to delete"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-200 text-xs font-medium hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
            >
              <span>{lang}</span>
              <X className="w-3 h-3 text-zinc-500 group-hover:text-rose-400 transition-colors" />
            </span>
          ))}
        </div>

        <form onSubmit={handleAddSpoken} className="flex gap-2 max-w-md pt-2 border-t border-white/5">
          <input
            type="text"
            value={inputs.spoken || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, spoken: e.target.value }))
            }
            placeholder="Add spoken language (e.g. French, Japanese)..."
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 5: EDUCATION
// ----------------------------------------------------
function EducationTab({
  education,
  onChange,
  showToast,
}: {
  education: Education[];
  onChange: (edu: Education[]) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}) {
  const handleAdd = () => {
    const newEntry: Education = {
      institution: "Institution / University",
      degree: "Qualification / Degree",
      year: "2024–Present",
      details: "Academic details or Honors",
    };
    onChange([...education, newEntry]);
    showToast("Added education milestone", "success");
  };

  const handleRemove = (index: number) => {
    onChange(education.filter((_, idx) => idx !== index));
  };

  const handleUpdate = (index: number, fields: Partial<Education>) => {
    const updated = [...education];
    updated[index] = { ...updated[index], ...fields };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Academic Background
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage degrees, schools, years, and academic honors
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30 text-xs font-mono cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white/[0.02] border border-white/8 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-amber-400 uppercase tracking-wider">
                Milestone #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdate(idx, { institution: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                  Degree / Certificate
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdate(idx, { degree: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                  Year Range
                </label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => handleUpdate(idx, { year: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                  Details / Z-Score / Honors
                </label>
                <input
                  type="text"
                  value={edu.details || ""}
                  onChange={(e) => handleUpdate(idx, { details: e.target.value })}
                  placeholder="e.g. Faculty of IT or Z-Score: 1.8063"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 6: MESSAGES INBOX
// ----------------------------------------------------
function MessagesTab({
  messages,
  isLoading,
  onDelete,
  onRefresh,
}: {
  messages: ContactMessage[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Contact Inquiries Inbox
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Recruiter messages and collaboration inquiries submitted via the public contact form
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono cursor-pointer transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Filter inquiries by name, email, or keywords..."
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
      />

      {isLoading ? (
        <div className="py-16 text-center text-zinc-500 font-mono text-xs">
          Loading inbox inquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-white/10">
          <Mail className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <div className="font-mono text-xs text-zinc-400">No contact messages found</div>
          <div className="text-[11px] text-zinc-600 font-mono mt-1">
            Inquiries sent from the portfolio contact form will appear here.
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="p-5 rounded-xl bg-white/[0.02] border border-white/8 hover:border-white/15 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{msg.name}</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="font-mono text-xs text-indigo-400 hover:underline"
                    >
                      &lt;{msg.email}&gt;
                    </a>
                  </div>
                  <div className="font-mono text-xs text-zinc-400 font-medium mt-0.5">
                    Subject: {msg.subject}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-zinc-500">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-mono flex items-center gap-1"
                    title="Reply via Email"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reply</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onDelete(msg.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// TAB 7: SETTINGS & BACKUP
// ----------------------------------------------------
function SettingsTab({
  onExport,
  onImport,
  onReset,
  newPassword,
  setNewPassword,
  onChangePassword,
  isChangingPass,
}: {
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  newPassword: string;
  setNewPassword: (p: string) => void;
  onChangePassword: (e: React.FormEvent) => void;
  isChangingPass: boolean;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">
          Backup & Security Settings
        </h2>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Export full configuration, restore backups, or update access passwords
        </p>
      </div>

      {/* Backup & Restore Section */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-indigo-400 font-semibold">
          Data Backup & Transfer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="font-mono text-xs text-white font-medium flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Portfolio JSON</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Download your complete portfolio configuration (projects, skills, bio, links) as a portable JSON file.
            </p>
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-mono transition-all cursor-pointer mt-2"
            >
              <span>Download Backup</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="font-mono text-xs text-white font-medium flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Restore from JSON</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Restore portfolio contents from an existing backup JSON file.
            </p>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-mono transition-all cursor-pointer mt-2">
              <span>Select File</span>
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
          Change Admin Password
        </h3>

        <form onSubmit={onChangePassword} className="space-y-3 max-w-md">
          <div>
            <label className="block font-mono text-[11px] text-zinc-400 mb-1">
              New Admin Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 4 characters)..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isChangingPass || !newPassword}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30 text-xs font-mono transition-all cursor-pointer disabled:opacity-40"
          >
            {isChangingPass ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>Danger Zone: Revert to CV Defaults</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-2xl">
          Resetting will overwrite any changes in the admin module and restore original portfolio details from the CV source files.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-mono transition-all cursor-pointer"
        >
          Reset to CV Defaults
        </button>
      </div>
    </div>
  );
}
