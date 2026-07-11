import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // ── Aggregate queries in parallel ──
    const [
      totalVisits,
      activeVisits,
      modeCounts,
      avgDuration,
      totalEvents,
      eventKindCounts,
      feedbackCounts,
      guestbookCount,
      tourCount,
      totalExhibitsSeen,
      quizzesPassedSum,
    ] = await Promise.all([
      // Total visits ever
      db.visit.count(),

      // Active visits (not ended)
      db.visit.count({ where: { endedAt: null } }),

      // Visit mode breakdown
      db.visit.groupBy({
        by: ["mode"],
        _count: { id: true },
      }),

      // Average visit duration (seconds)
      db.$queryRaw<{ avg_seconds: number }[]>`
        SELECT COALESCE(AVG(EXTRACT(EPOCH FROM ("endedAt" - "startedAt"))), 0) AS avg_seconds
        FROM "Visit"
        WHERE "endedAt" IS NOT NULL
      `,

      // Total events
      db.visitEvent.count(),

      // Event kind breakdown
      db.visitEvent.groupBy({
        by: ["kind"],
        _count: { id: true },
      }),

      // Feedback count by kind
      db.feedback.groupBy({
        by: ["kind"],
        _count: { id: true },
      }),

      // Guestbook entries (approved)
      db.guestbookEntry.count({ where: { approved: true } }),

      // Tour count
      db.tour.count(),

      // Total exhibits seen across all visits
      db.visit.aggregate({
        _sum: { exhibitsSeen: true },
      }),

      // Total quizzes passed
      db.visit.aggregate({
        _sum: { quizzesPassed: true },
      }),
    ]);

    // ── Hourly visit activity (last 7 days) ──
    const hourlyActivity = await db.$queryRaw<
      { hour: Date; count: bigint }[]
    >`
      SELECT
        date_trunc('hour', "startedAt") AS hour,
        COUNT(*)::int AS count
      FROM "Visit"
      WHERE "startedAt" >= NOW() - INTERVAL '7 days'
      GROUP BY hour
      ORDER BY hour ASC
    `;

    // ── Daily visit totals (last 30 days) ──
    const dailyActivity = await db.$queryRaw<
      { day: Date; count: bigint }[]
    >`
      SELECT
        date_trunc('day', "startedAt") AS day,
        COUNT(*)::int AS count
      FROM "Visit"
      WHERE "startedAt" >= NOW() - INTERVAL '30 days'
      GROUP BY day
      ORDER BY day ASC
    `;

    // ── Peak concurrency (max active visits in any hour) ──
    const peakConcurrency = await db.$queryRaw<
      { peak: bigint }[]
    >`
      SELECT MAX(cnt)::int AS peak FROM (
        SELECT COUNT(*)::int AS cnt
        FROM "Visit"
        WHERE "startedAt" >= NOW() - INTERVAL '30 days'
        GROUP BY date_trunc('hour', "startedAt")
      ) sub
    `;

    return NextResponse.json({
      overview: {
        totalVisits,
        activeVisits,
        avgDuration: Number(avgDuration[0]?.avg_seconds ?? 0),
        totalEvents,
        tourCount,
      },
      modes: Object.fromEntries(
        modeCounts.map((m) => [m.mode, m._count.id])
      ),
      events: Object.fromEntries(
        eventKindCounts.map((e) => [e.kind, e._count.id])
      ),
      feedback: Object.fromEntries(
        feedbackCounts.map((f) => [f.kind, f._count.id])
      ),
      engagement: {
        guestbookEntries: guestbookCount,
        totalExhibitsSeen: totalExhibitsSeen._sum.exhibitsSeen ?? 0,
        quizzesPassed: quizzesPassedSum._sum.quizzesPassed ?? 0,
      },
      traffic: {
        peakConcurrent: Number(peakConcurrency[0]?.peak ?? 0),
        hourly: hourlyActivity.map((h) => ({
          time: h.hour,
          count: Number(h.count),
        })),
        daily: dailyActivity.map((d) => ({
          date: d.day,
          count: Number(d.count),
        })),
      },
    });
  } catch (e) {
    console.error("Admin stats error:", e);
    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
