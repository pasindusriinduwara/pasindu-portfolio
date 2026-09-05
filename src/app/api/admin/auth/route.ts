import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminPassword } from "@/lib/portfolioStore";

// In-memory or simple token generator
const SESSION_SECRET = "portfolio_admin_session_auth_key_v1";

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(SESSION_SECRET);
  } catch {
    return false;
  }
}

function generateToken(): string {
  return Buffer.from(`${SESSION_SECRET}:${Date.now()}`).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const expectedPassword = getAdminPassword();

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const token = generateToken();
    const cookieStore = await cookies();

    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
    });
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const isAuthenticated = isValidToken(sessionCookie);

    return NextResponse.json({
      authenticated: isAuthenticated,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true, message: "Logged out." });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed." },
      { status: 500 }
    );
  }
}
