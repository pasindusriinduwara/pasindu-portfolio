export interface Skill {
  label: string;
  level: number;
  category?: "frontend" | "backend" | "database" | "blockchain" | "devops";
}

export interface Project {
  id: number;
  name: string;
  emoji: string;
  type: string;
  year: string;
  color: string;
  glow: string;
  summary: string;
  tools: string[];
  github?: string;
  live?: string;
  highlights?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  details?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface PersonalInfo {
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  internshipStatus: string;
  achievement: string;
  languages: string[];
  avatar: string;
  resumeUrl: string;
}

export interface CategorizedStack {
  languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  tools: string[];
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  stack: string[];
  categorizedStack?: CategorizedStack;
  projects: Project[];
  education: Education[];
}

export interface PortfolioStats {
  projectsCount: number;
  skillsCount: number;
  experienceYears: string;
  internshipStatus: string;
  messagesReceived: number;
  totalViews: number;
}

