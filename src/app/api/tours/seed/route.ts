import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const SEED_TOURS = [
  {
    slug: "hanh-trinh-hoi-nuoc",
    title: "Hành trình hơi nước",
    description:
      "Khám phá các phát minh cơ giới hóa quan trọng của CMCN 1.0 — từ con thoi bay đến đầu máy xe lửa.",
    author: "Người dẫn tuyến Atrium",
    exhibitIds: [
      "flying-shuttle",
      "watt-steam",
      "steamboat-fulton",
      "rocket-locomotive",
    ],
    featured: true,
  },
  {
    slug: "cuoc-cach-mang-dien",
    title: "Cách mạng Điện & Cơ khí",
    description:
      "Khám phá các phát minh định hình thế giới ở thế kỷ 19 và đầu thế kỷ 20 qua lò Bessemer, điện lực Siemens và xe hơi Karl Benz.",
    author: "Người dẫn tuyến Atrium",
    exhibitIds: [
      "bessemer-converter",
      "dynamo",
      "motorwagen",
      "wright-flyer",
    ],
    featured: true,
  },
  {
    slug: "ky-nguyen-so-va-ai",
    title: "Kỷ nguyên Số & Trí tuệ",
    description:
      "Hành trình phát triển vượt bậc từ vi xử lý đầu tiên, máy tính cá nhân đến robot sinh học hình người và trợ lý ảo thông minh.",
    author: "Người dẫn tuyến Atrium",
    exhibitIds: [
      "intel-4004",
      "modicon-plc",
      "unimate-robot",
      "altair-8800",
      "atlas-robot",
      "amazon-echo",
      "iphone-4s",
    ],
    featured: true,
  },
];

export async function POST() {
  let created = 0;
  for (const t of SEED_TOURS) {
    // Delete any existing tour with the same slug to ensure it gets fully updated with new exhibitIds
    await db.tour.deleteMany({ where: { slug: t.slug } });
    
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
  }
  return NextResponse.json({ seeded: created });
}
