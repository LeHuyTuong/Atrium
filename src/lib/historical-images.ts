// Atrium — Ảnh lịch sử (dữ liệu ký họa, dùng cho Photo Wall)
// 15 ảnh tương ứng với 15 hiện vật. Dùng biểu diễn ký họa atmospheric
// (gradient + motif) kèm caption + nguồn tiếng Việt.

import { PhaseId, Motif } from "./museum-data";

export interface HistoricalImage {
  id: string;
  phase: PhaseId;
  caption: string;
  source: string;
  year: string;
  motif: Motif;
  gradient: string; // CSS gradient for procedural visual
  exhibitId?: string;
  featured?: boolean;
  imageUrl?: string; // Optional actual image URL
}

function grad(a: string, b: string) {
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

export const HISTORICAL_IMAGES: HistoricalImage[] = [
  // Industry 1.0 (4)
  {
    id: "h1-1",
    phase: "industry-1",
    caption: "Chi tiết cơ cấu con thoi bay (Flying Shuttle) dệt vải của John Kay.",
    source: "Wikimedia Commons",
    year: "1733",
    motif: "flying-shuttle",
    gradient: grad("#3a2410", "#1a0f0a"),
    exhibitId: "flying-shuttle",
    imageUrl: "/images/museum/flying-shuttle.jpg",
  },
  {
    id: "h1-2",
    phase: "industry-1",
    caption: "Mẫu động cơ hơi nước xoay của Boulton & Watt năm 1788.",
    source: "Science Museum Group (London)",
    year: "1788",
    motif: "steam-engine",
    gradient: grad("#4a2f18", "#241409"),
    exhibitId: "watt-steam",
    featured: true,
    imageUrl: "/images/museum/watt-steam.jpg",
  },
  {
    id: "h1-3",
    phase: "industry-1",
    caption: "Mô hình tàu thủy hơi nước thương mại Clermont (North River Steamboat) của Robert Fulton năm 1807.",
    source: "Wikimedia Commons",
    year: "1807",
    motif: "steamboat-fulton",
    gradient: grad("#43261a", "#1d0f08"),
    exhibitId: "steamboat-fulton",
    imageUrl: "/images/museum/steamboat-fulton.jpg",
  },
  {
    id: "h1-4",
    phase: "industry-1",
    caption: "Đầu máy hơi nước lịch sử Stephenson Rocket năm 1829.",
    source: "Science Museum Group (London)",
    year: "1829",
    motif: "locomotive",
    gradient: grad("#3e2410", "#1a0f0a"),
    exhibitId: "rocket-locomotive",
    imageUrl: "/images/museum/rocket-locomotive.jpg",
  },

  // Industry 2.0 (4)
  {
    id: "h2-1",
    phase: "industry-2",
    caption: "Mô hình bản vẽ cấu tạo lò luyện thép Bessemer (Bessemer converter) năm 1856.",
    source: "Wikimedia Commons",
    year: "1856",
    motif: "bessemer-converter",
    gradient: grad("#5a2a10", "#240f05"),
    exhibitId: "bessemer-converter",
    imageUrl: "/images/museum/bessemer-converter.jpg",
  },
  {
    id: "h2-2",
    phase: "industry-2",
    caption: "Máy phát điện một chiều Siemens Dynamo (1866), phát minh nền móng cho nền công nghiệp điện lực.",
    source: "Deutsches Museum / bavarikon",
    year: "1866",
    motif: "dynamo",
    gradient: grad("#4c3f1a", "#211b09"),
    exhibitId: "dynamo",
    featured: true,
    imageUrl: "/images/museum/siemens_dynamo_1866.jpg",
  },
  {
    id: "h2-3",
    phase: "industry-2",
    caption: "Mẫu xe ô tô chạy bằng động cơ đốt trong đầu tiên thế giới Benz Patent-Motorwagen Nr. 1.",
    source: "Wikimedia Commons",
    year: "1886",
    motif: "motorwagen",
    gradient: grad("#3f2d18", "#1f140a"),
    exhibitId: "motorwagen",
    imageUrl: "/images/museum/motorwagen.jpg",
  },
  {
    id: "h2-4",
    phase: "industry-2",
    caption: "Chuyến bay lịch sử đầu tiên của chiếc Wright Flyer tại Kitty Hawk năm 1903.",
    source: "Smithsonian National Air and Space Museum",
    year: "1903",
    motif: "wright-flyer",
    gradient: grad("#3a3c2a", "#1a1c12"),
    exhibitId: "wright-flyer",
    imageUrl: "/images/museum/wright-flyer.jpg",
  },

  // Industry 3.0 (4)
  {
    id: "h3-1",
    phase: "industry-3",
    caption: "Cánh tay robot công nghiệp đầu tiên trên thế giới Unimate do Unimation Inc. sản xuất năm 1961.",
    source: "IEEE Spectrum / Robots Guide",
    year: "1961",
    motif: "unimate-robot",
    gradient: grad("#1c3b4a", "#091c24"),
    exhibitId: "unimate-robot",
    imageUrl: "/images/museum/unimate-robot.jpg",
  },
  {
    id: "h3-2",
    phase: "industry-3",
    caption: "Chip vi xử lý Intel 4004 — bộ vi xử lý thương mại đầu tiên trên thế giới, ra mắt năm 1971.",
    source: "Computer History Museum",
    year: "1971",
    motif: "intel-4004",
    gradient: grad("#1c2e4a", "#0a1424"),
    exhibitId: "intel-4004",
    featured: true,
    imageUrl: "/images/museum/intel-4004.jpg",
  },
  {
    id: "h3-3",
    phase: "industry-3",
    caption: "Nhóm kỹ sư sáng tạo Modicon 084 — chiếc PLC thương mại đầu tiên trên thế giới, ra đời năm 1969.",
    source: "control.com / Schneider Electric",
    year: "1969",
    motif: "modicon-plc",
    gradient: grad("#223a2a", "#0f1c12"),
    exhibitId: "modicon-plc",
    imageUrl: "/images/museum/modicon-084.jpg",
  },
  {
    id: "h3-4",
    phase: "industry-3",
    caption: "Máy tính Altair 8800 — máy tính cá nhân kit đầu tiên đã thổi bùng cuộc cách mạng PC năm 1975.",
    source: "Computer History Museum",
    year: "1975",
    motif: "altair-8800",
    gradient: grad("#2a2b3d", "#12131c"),
    exhibitId: "altair-8800",
    imageUrl: "/images/museum/altair-8800.jpg",
  },

  // Industry 4.0 (3)
  {
    id: "h4-1",
    phase: "industry-4",
    caption: "Robot hình người Atlas thế hệ đầu tiên được phát triển bởi Boston Dynamics dưới sự tài trợ của DARPA năm 2013.",
    source: "DARPA / Wikimedia Commons",
    year: "2013",
    motif: "atlas-robot",
    gradient: grad("#4a205a", "#21092b"),
    exhibitId: "atlas-robot",
    featured: true,
    imageUrl: "/images/museum/humanoid-robot.jpg",
  },
  {
    id: "h4-2",
    phase: "industry-4",
    caption: "Thiết bị loa thông minh Amazon Echo (thế hệ đầu tiên) tích hợp trợ lý ảo Alexa được giới thiệu rộng rãi năm 2015.",
    source: "Amazon Press / Wikimedia Commons",
    year: "2015",
    motif: "amazon-echo",
    gradient: grad("#3a1a4a", "#1a0824"),
    exhibitId: "amazon-echo",
    imageUrl: "/images/museum/amazon-echo.jpg",
  },
  {
    id: "h4-3",
    phase: "industry-4",
    caption: "Điện thoại thông minh iPhone 4S màu đen nguyên bản — thiết bị đầu tiên tích hợp trợ lý ảo thông minh Siri ra mắt năm 2011.",
    source: "Mobile Phone Museum",
    year: "2011",
    motif: "iphone-4s",
    gradient: grad("#4a1a30", "#240815"),
    exhibitId: "iphone-4s",
    imageUrl: "/images/museum/smartphone.png",
  },
];

export function imagesByPhase(phaseId: PhaseId): HistoricalImage[] {
  return HISTORICAL_IMAGES.filter((img) => img.phase === phaseId);
}

export function imageForExhibit(exhibitId: string): HistoricalImage | undefined {
  return HISTORICAL_IMAGES.find((img) => img.exhibitId === exhibitId);
}

export function gradientForExhibit(exhibitId: string): string {
  const img = imageForExhibit(exhibitId);
  return img ? img.gradient : "linear-gradient(135deg, #1f140a 0%, #000000 100%)";
}
