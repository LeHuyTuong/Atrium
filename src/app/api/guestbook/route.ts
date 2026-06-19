import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const entries = await db.guestbookEntry.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  try {
    const { name, message, phase, rating } = await req.json();
    if (!name || !message) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }
    // Auto-approve short, non-spammy messages (in production: moderation queue)
    const approved = message.length <= 400 && message.length >= 3 && !/<script|http:/i.test(message);
    const entry = await db.guestbookEntry.create({
      data: {
        name: String(name).slice(0, 60),
        message: String(message).slice(0, 400),
        phase: phase || null,
        rating: rating || null,
        approved,
      },
    });
    return NextResponse.json({ entry, approved });
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
