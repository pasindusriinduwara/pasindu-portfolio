import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolioStore";
import { verifyAdminSession } from "@/lib/adminAuth";
import { PortfolioData } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin Portfolio GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: PortfolioData = await req.json();

    if (!body || !body.personalInfo) {
      return NextResponse.json(
        { error: "Invalid portfolio data payload." },
        { status: 400 }
      );
    }

    const success = savePortfolioData(body);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to write portfolio data to disk." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio details updated successfully.",
      data: body,
    });
  } catch (error) {
    console.error("Admin Portfolio PUT error:", error);
    return NextResponse.json(
      { error: "Error updating portfolio data" },
      { status: 500 }
    );
  }
}
