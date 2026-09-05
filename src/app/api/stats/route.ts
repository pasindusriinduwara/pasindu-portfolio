import { NextResponse } from "next/server";
import { PROJECTS, SKILLS, STACK, EDUCATION, PERSONAL_INFO } from "@/data/portfolio";
import fs from "fs";
import path from "path";

export async function GET() {
  let messageCount = 0;
  try {
    const messagesPath = path.join(process.cwd(), "src", "data", "messages.json");
    if (fs.existsSync(messagesPath)) {
      const data = fs.readFileSync(messagesPath, "utf-8");
      const msgs = JSON.parse(data || "[]");
      messageCount = msgs.length;
    }
  } catch {
    messageCount = 0;
  }

  return NextResponse.json({
    projectsCount: PROJECTS.length,
    skillsCount: SKILLS.length,
    stackCount: STACK.length,
    educationCount: EDUCATION.length,
    internshipStatus: PERSONAL_INFO.internshipStatus,
    achievement: PERSONAL_INFO.achievement,
    messagesCount: messageCount,
    updatedAt: new Date().toISOString(),
  });
}
