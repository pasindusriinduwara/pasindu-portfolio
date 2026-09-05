import fs from "fs";
import path from "path";
import { PortfolioData } from "@/types";
import {
  PERSONAL_INFO as DEFAULT_PERSONAL_INFO,
  SKILLS as DEFAULT_SKILLS,
  STACK as DEFAULT_STACK,
  PROJECTS as DEFAULT_PROJECTS,
  EDUCATION as DEFAULT_EDUCATION,
} from "@/data/portfolio";

const portfolioFilePath = path.join(process.cwd(), "src", "data", "portfolio.json");
const configFilePath = path.join(process.cwd(), "src", "data", "admin_config.json");

export const DEFAULT_CATEGORIZED_STACK = {
  languages: ["Java", "TypeScript", "JavaScript", "C"],
  frontend: ["React", "Next.js", "Tailwind CSS"],
  backend: ["Node.js", "Express.js", "Spring Boot", "Spring Security"],
  databases: ["PostgreSQL", "MySQL", "Supabase"],
  tools: ["Git", "GitHub", "Cloudinary", "Web3Auth", "XRPL"],
};

export function getDefaultPortfolioData(): PortfolioData {
  return {
    personalInfo: { ...DEFAULT_PERSONAL_INFO },
    skills: JSON.parse(JSON.stringify(DEFAULT_SKILLS)),
    stack: [...DEFAULT_STACK],
    categorizedStack: JSON.parse(JSON.stringify(DEFAULT_CATEGORIZED_STACK)),
    projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
    education: JSON.parse(JSON.stringify(DEFAULT_EDUCATION)),
  };
}

export function getPortfolioData(): PortfolioData {
  try {
    if (!fs.existsSync(portfolioFilePath)) {
      const defaultData = getDefaultPortfolioData();
      savePortfolioData(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(portfolioFilePath, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      personalInfo: { ...DEFAULT_PERSONAL_INFO, ...(parsed.personalInfo || {}) },
      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_SKILLS,
      stack: Array.isArray(parsed.stack) ? parsed.stack : DEFAULT_STACK,
      categorizedStack: parsed.categorizedStack || DEFAULT_CATEGORIZED_STACK,
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS,
      education: Array.isArray(parsed.education) ? parsed.education : DEFAULT_EDUCATION,
    };
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return getDefaultPortfolioData();
  }
}

export function savePortfolioData(data: PortfolioData): boolean {
  try {
    const dir = path.dirname(portfolioFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(portfolioFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing portfolio data:", error);
    return false;
  }
}

export function resetPortfolioData(): PortfolioData {
  const defaultData = getDefaultPortfolioData();
  savePortfolioData(defaultData);
  return defaultData;
}

// Password management
export function getAdminPassword(): string {
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }
  try {
    if (fs.existsSync(configFilePath)) {
      const raw = fs.readFileSync(configFilePath, "utf-8");
      const cfg = JSON.parse(raw);
      if (cfg && cfg.adminPassword) {
        return cfg.adminPassword;
      }
    }
  } catch (err) {
    console.error("Error reading admin config:", err);
  }
  return "admin123";
}

export function setAdminPassword(newPassword: string): boolean {
  try {
    const dir = path.dirname(configFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let cfg: Record<string, unknown> = {};
    if (fs.existsSync(configFilePath)) {
      try {
        cfg = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
      } catch {
        cfg = {};
      }
    }
    cfg.adminPassword = newPassword;
    fs.writeFileSync(configFilePath, JSON.stringify(cfg, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving admin password:", err);
    return false;
  }
}
