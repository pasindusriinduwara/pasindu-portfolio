import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "cv", "resume.pdf");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Resume file not found." },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Pasindu_Sri_CV.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
