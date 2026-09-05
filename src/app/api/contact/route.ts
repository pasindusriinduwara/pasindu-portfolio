import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ContactMessage } from "@/types";

const messagesFilePath = path.join(process.cwd(), "src", "data", "messages.json");

function getStoredMessages(): ContactMessage[] {
  try {
    if (!fs.existsSync(messagesFilePath)) {
      fs.writeFileSync(messagesFilePath, JSON.stringify([]), "utf-8");
      return [];
    }
    const data = fs.readFileSync(messagesFilePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
  }
}

function saveMessage(message: ContactMessage): void {
  try {
    const messages = getStoredMessages();
    messages.push(message);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing message:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Message must be at least 5 characters long." },
        { status: 400 }
      );
    }

    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : "New Portfolio Inquiry",
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    saveMessage(newMessage);

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received. Pasindu will get back to you shortly.",
      id: newMessage.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process contact request." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const messages = getStoredMessages();
  return NextResponse.json({
    count: messages.length,
    status: "healthy",
  });
}
