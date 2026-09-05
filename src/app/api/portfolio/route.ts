import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolioStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getPortfolioData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Portfolio API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
