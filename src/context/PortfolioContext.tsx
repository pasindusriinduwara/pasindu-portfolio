"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { PortfolioData, PersonalInfo, Skill, Project, Education } from "@/types";
import {
  PERSONAL_INFO as DEFAULT_PERSONAL_INFO,
  SKILLS as DEFAULT_SKILLS,
  STACK as DEFAULT_STACK,
  PROJECTS as DEFAULT_PROJECTS,
  EDUCATION as DEFAULT_EDUCATION,
} from "@/data/portfolio";

const fallbackData: PortfolioData = {
  personalInfo: DEFAULT_PERSONAL_INFO,
  skills: DEFAULT_SKILLS,
  stack: DEFAULT_STACK,
  projects: DEFAULT_PROJECTS,
  education: DEFAULT_EDUCATION,
};

interface PortfolioContextType {
  data: PortfolioData;
  personalInfo: PersonalInfo;
  skills: Skill[];
  stack: string[];
  projects: Project[];
  education: Education[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateDataLocally: (newData: PortfolioData) => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: fallbackData,
  personalInfo: fallbackData.personalInfo,
  skills: fallbackData.skills,
  stack: fallbackData.stack,
  projects: fallbackData.projects,
  education: fallbackData.education,
  loading: false,
  refreshData: async () => {},
  updateDataLocally: () => {},
});

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: PortfolioData;
}) {
  const [data, setData] = useState<PortfolioData>(initialData || fallbackData);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.ok) {
        const json: PortfolioData = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to refresh portfolio data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDataLocally = useCallback((newData: PortfolioData) => {
    setData(newData);
  }, []);

  useEffect(() => {
    // Refresh on mount to ensure fresh data from portfolio.json
    refreshData();

    // Listen for cross-tab or same-window portfolio updates
    const handlePortfolioUpdate = () => {
      refreshData();
    };
    window.addEventListener("portfolio_updated", handlePortfolioUpdate);

    return () => {
      window.removeEventListener("portfolio_updated", handlePortfolioUpdate);
    };
  }, [refreshData]);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        personalInfo: data.personalInfo,
        skills: data.skills,
        stack: data.stack,
        projects: data.projects,
        education: data.education,
        loading,
        refreshData,
        updateDataLocally,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
