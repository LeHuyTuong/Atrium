import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const SEED_TOURS = [
  {
    slug: "hanh-trinh-hoi-nuoc",
    title: "Hành trình hơi nước",
    description:
      "Năm hiện vật đầu tiên của kỷ nguyên cơ giới hóa — từ Watt đến Jacquard.",
    author: "Người dẫn tuyến Atrium",
    exhibitIds: [
      "watt-steam",
      "spinning-jenny",
      "cotton-gin",
      "puddling-furnace",
      "rocket-locomotive",
    ],
    featured: true,
  },
  {
    slug: "anh-sang-va-dien",
    title: "Ánh sáng & điện",
    description:
      "Từ bóng đèn Edison đến máy biến áp — câu chuyện về việc thắp sáng thế giới.",
    author: "Người dẫn tuyến Atrium",
    exhibitIds: [
      "light-bulb",
      "dynamo",
      "edison-meter",
      "ac-transformer",
      "model-t",
    ],
    featured: true,
  },
  {
    slug: "tu-silicon-den-ai",
    title: "Từ silicon đến AI",
    description:
      "Khi máy tính học cách nghĩ — từ Intel 4004 đến mạng nơ-ron sâu.",
    author: "Người dẫn tuyến Atrium",
    exhibitIds: [
      "intel-4004",
      "arpanet",
      "www",
      "neural-net",
      "transformer-arch",
    ],
    featured: true,
  },
];

export async function POST() {
  let created = 0;
  for (const t of SEED_TOURS) {
    const existing = await db.tour.findUnique({ where: { slug: t.slug } });
    if (!existing) {
      await db.tour.create({
        data: {
          slug: t.slug,
          title: t.title,
          description: t.description,
          author: t.author,
          exhibitIds: JSON.stringify(t.exhibitIds),
          featured: true,
        },
      });
      created++;
    } else if (!existing.featured) {
      await db.tour.update({
        where: { slug: t.slug },
        data: { featured: true },
      });
      created++;
    }
  }
  return NextResponse.json({ seeded: created });
}
