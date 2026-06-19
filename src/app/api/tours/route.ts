import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const featured = url.searchParams.get("featured");
  const tours = await db.tour.findMany({
    where: featured === "1" ? { featured: true } : undefined,
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json({ tours });
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, author, exhibitIds, featured } = await req.json();
    if (!title || !Array.isArray(exhibitIds) || exhibitIds.length === 0) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }
    const slug =
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) + "-" + Math.random().toString(36).slice(2, 6);
    const tour = await db.tour.create({
      data: {
        slug,
        title: String(title).slice(0, 120),
        description: description ? String(description).slice(0, 500) : null,
        author: author ? String(author).slice(0, 60) : "Khách",
        exhibitIds: JSON.stringify(exhibitIds),
        featured: !!featured,
      },
    });
    return NextResponse.json({ tour });
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
