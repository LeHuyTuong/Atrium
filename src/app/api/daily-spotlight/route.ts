import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EXHIBITS } from "@/lib/museum-data";

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const today = dateKey();
  let spotlight = await db.dailySpotlight.findUnique({ where: { dateKey: today } });
  if (!spotlight) {
    // deterministic pick by day-of-year
    const dayOfYear = Math.floor(
      (Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) -
        Date.UTC(new Date().getFullYear(), 0, 0)) /
        86400000
    );
    const exhibit = EXHIBITS[dayOfYear % EXHIBITS.length];
    spotlight = await db.dailySpotlight.create({
      data: {
        dateKey: today,
        exhibitId: exhibit.id,
        curatorNote: `Hôm nay bảo tàng giới thiệu « ${exhibit.name} » (${exhibit.year}) — ${exhibit.tagline}`,
      },
    });
  }
  const exhibit = EXHIBITS.find((e) => e.id === spotlight!.exhibitId) ?? EXHIBITS[0];
  return NextResponse.json({ spotlight, exhibit });
}
