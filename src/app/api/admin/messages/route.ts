import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/adminAuth";
import { ContactMessage } from "@/types";

const messagesFilePath = path.join(process.cwd(), "src", "data", "messages.json");

function getStoredMessages(): ContactMessage[] {
  try {
    if (!fs.existsSync(messagesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(messagesFilePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

function saveMessages(msgs: ContactMessage[]): boolean {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(msgs, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const msgs = getStoredMessages();
  // Sort descending by date
  msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    total: msgs.length,
    messages: msgs,
  });
}

export async function DELETE(req: NextRequest) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    const msgs = getStoredMessages();
    const updated = msgs.filter((m) => m.id !== id);

    saveMessages(updated);

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
      remaining: updated.length,
    });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
