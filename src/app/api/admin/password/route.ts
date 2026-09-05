import { NextRequest, NextResponse } from "next/server";
import { setAdminPassword } from "@/lib/portfolioStore";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { newPassword } = await req.json();

    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 4) {
      return NextResponse.json(
        { error: "New password must be at least 4 characters long." },
        { status: 400 }
      );
    }

    const success = setAdminPassword(newPassword.trim());
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update admin password." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Error changing password." },
      { status: 500 }
    );
  }
}
