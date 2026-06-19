import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { visitorId, kind, message } = await req.json();
    if (!message) return NextResponse.json({ error: "missing" }, { status: 400 });
    const fb = await db.feedback.create({
      data: {
        visitorId: visitorId || "anon",
        kind: kind || "idea",
        message: String(message).slice(0, 1000),
      },
    });
    return NextResponse.json({ feedback: fb });
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
