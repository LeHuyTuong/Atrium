import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tour = await db.tour.findUnique({ where: { slug } });
  if (!tour) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  // increment visits (fire-and-forget, non-blocking for the response)
  await db.tour
    .update({ where: { id: tour.id }, data: { visits: { increment: 1 } } })
    .catch(() => {});

  let exhibitIds: string[] = [];
  try {
    exhibitIds = JSON.parse(tour.exhibitIds);
  } catch {
    exhibitIds = [];
  }

  return NextResponse.json({
    tour: {
      id: tour.id,
      slug: tour.slug,
      title: tour.title,
      description: tour.description,
      author: tour.author,
      exhibitIds,
      featured: tour.featured,
      visits: tour.visits + 1,
      createdAt: tour.createdAt,
    },
  });
}
