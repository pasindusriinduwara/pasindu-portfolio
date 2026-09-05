import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolioStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tool = searchParams.get("tool");
  const query = searchParams.get("q");

  const portfolio = getPortfolioData();
  let filtered = [...portfolio.projects];

  if (tool) {
    filtered = filtered.filter((p) =>
      p.tools.some((t) => t.toLowerCase() === tool.toLowerCase())
    );
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.tools.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    total: filtered.length,
    projects: filtered,
  });
}
