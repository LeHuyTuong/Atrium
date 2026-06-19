import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { visitId, kind, refId, meta } = await req.json();
    if (!visitId || !kind) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }
    const event = await db.visitEvent.create({
      data: {
        visitId,
        kind,
        refId: refId || null,
        meta: meta ? JSON.stringify(meta) : null,
      },
    });
    return NextResponse.json({ event });
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
