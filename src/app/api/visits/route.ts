import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { visitorId, mode } = await req.json();
    const visit = await db.visit.create({
      data: {
        visitorId: visitorId || "anon",
        mode: mode || "free",
      },
    });
    return NextResponse.json({ visit });
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { visitId, endedAt, phaseSeen, exhibitsSeen, quizzesPassed } = await req.json();
    const visit = await db.visit.update({
      where: { id: visitId },
      data: {
        endedAt: endedAt ? new Date(endedAt) : undefined,
        phaseSeen,
        exhibitsSeen,
        quizzesPassed,
      },
    });
    return NextResponse.json({ visit });
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
