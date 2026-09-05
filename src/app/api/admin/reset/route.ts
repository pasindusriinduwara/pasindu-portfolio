import { NextResponse } from "next/server";
import { resetPortfolioData } from "@/lib/portfolioStore";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function POST() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const defaultData = resetPortfolioData();
    return NextResponse.json({
      success: true,
      message: "Portfolio data reset to default successfully.",
      data: defaultData,
    });
  } catch (error) {
    console.error("Admin Reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset portfolio data." },
      { status: 500 }
    );
  }
}
