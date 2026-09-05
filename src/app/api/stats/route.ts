import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolioStore";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getPortfolioData();
  let messageCount = 0;
  try {
    const messagesPath = path.join(process.cwd(), "src", "data", "messages.json");
    if (fs.existsSync(messagesPath)) {
      const msgData = fs.readFileSync(messagesPath, "utf-8");
      const msgs = JSON.parse(msgData || "[]");
      messageCount = msgs.length;
    }
  } catch {
    messageCount = 0;
  }

  return NextResponse.json({
    projectsCount: data.projects.length,
    skillsCount: data.skills.length,
    stackCount: data.stack.length,
    educationCount: data.education.length,
    internshipStatus: data.personalInfo.internshipStatus,
    achievement: data.personalInfo.achievement,
    messagesCount: messageCount,
    updatedAt: new Date().toISOString(),
  });
}
