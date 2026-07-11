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
}

function grad(a: string, b: string) {
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

export const HISTORICAL_IMAGES: HistoricalImage[] = [
  // Industry 1.0 (4)
  {
    id: "h1-1",
    phase: "industry-1",
    caption: "Bản vẽ thiết kế con thoi bay của John Kay.",
    source: "Văn phòng Bằng sáng chế Vương quốc Anh",
    year: "1733",
    motif: "flying-shuttle",
    gradient: grad("#3a2410", "#1a0f0a"),
    exhibitId: "flying-shuttle",
  },
  {
    id: "h1-2",
    phase: "industry-1",
    caption: "Động cơ hơi nước Watt tại nhà máy Soho, Birmingham.",
    source: "Bảo tàng Khoa học London",
    year: "khoảng 1788",
    motif: "steam-engine",
    gradient: grad("#4a2f18", "#241409"),
    exhibitId: "watt-steam",
    featured: true,
  },
  {
    id: "h1-3",
    phase: "industry-1",
    caption: "Tàu thủy Clermont của Robert Fulton trên sông Hudson.",
    source: "Thư viện Quốc hội Hoa Kỳ",
    year: "1807",
    motif: "steamboat-fulton",
    gradient: grad("#43261a", "#1d0f08"),
    exhibitId: "steamboat-fulton",
  },
  {
    id: "h1-4",
    phase: "industry-1",
    caption: "Đầu máy hơi nước Rocket tại cuộc thi thử nghiệm Rainhill.",
    source: "Bảo tàng Đường sắt Quốc gia Anh",
    year: "1829",
    motif: "locomotive",
    gradient: grad("#3e2410", "#1a0f0a"),
    exhibitId: "rocket-locomotive",
  },

  // Industry 2.0 (4)
  {
    id: "h2-1",
    phase: "industry-2",
    caption: "Lò chuyển Bessemer phun lửa trong xưởng thép Sheffield.",
    source: "Lưu trữ Lịch sử Sheffield",
    year: "khoảng 1860",
    motif: "bessemer-converter",
    gradient: grad("#5a2a10", "#240f05"),
    exhibitId: "bessemer-converter",
  },
  {
    id: "h2-2",
    phase: "industry-2",
    caption: "Máy phát điện Dynamo Siemens trong trạm phát điện Berlin.",
    source: "Lưu trữ Lịch sử Siemens",
    year: "1866",
    motif: "dynamo",
    gradient: grad("#4c3f1a", "#211b09"),
    exhibitId: "dynamo",
    featured: true,
  },
  {
    id: "h2-3",
    phase: "industry-2",
    caption: "Bà Bertha Benz lái thử xe hơi Benz Patent-Motorwagen.",
    source: "Bảo tàng Mercedes-Benz",
    year: "1888",
    motif: "motorwagen",
    gradient: grad("#3f2d18", "#1f140a"),
    exhibitId: "motorwagen",
  },
  {
    id: "h2-4",
    phase: "industry-2",
    caption: "Chuyến bay lịch sử đầu tiên của anh em nhà Wright tại Kitty Hawk.",
    source: "Viện Smithsonian",
    year: "1903",
    motif: "wright-flyer",
    gradient: grad("#3a3c2a", "#1a1c12"),
    exhibitId: "wright-flyer",
  },

  // Industry 3.0 (4)
  {
    id: "h3-1",
    phase: "industry-3",
    caption: "Cánh tay robot công nghiệp Unimate đầu tiên gắp linh kiện nóng tại xưởng General Motors.",
    source: "Hiệp hội Robot Công nghiệp Hoa Kỳ",
    year: "1961",
    motif: "unimate-robot",
    gradient: grad("#1c3b4a", "#091c24"),
    exhibitId: "unimate-robot",
  },
  {
    id: "h3-2",
    phase: "industry-3",
    caption: "Ảnh chụp phóng đại cấu trúc vi xử lý Intel 4004.",
    source: "Lưu trữ Tập đoàn Intel",
    year: "1971",
    motif: "intel-4004",
    gradient: grad("#1c2e4a", "#0a1424"),
    exhibitId: "intel-4004",
    featured: true,
  },
  {
    id: "h3-3",
    phase: "industry-3",
    caption: "Bộ điều khiển khả trình PLC Modicon 084 trong tủ điện vận hành.",
    source: "Bảo tàng Tự động hóa Boston",
    year: "1969",
    motif: "modicon-plc",
    gradient: grad("#223a2a", "#0f1c12"),
    exhibitId: "modicon-plc",
  },
  {
    id: "h3-4",
    phase: "industry-3",
    caption: "Máy tính Altair 8800 được trưng bày tại triển lãm công nghệ.",
    source: "Bảo tàng Lịch sử Máy tính",
    year: "1975",
    motif: "altair-8800",
    gradient: grad("#2a2b3d", "#12131c"),
    exhibitId: "altair-8800",
  },

  // Industry 4.0 (3)
  {
    id: "h4-1",
    phase: "industry-4",
    caption: "Robot Atlas thực hiện động tác nhảy vượt chướng ngại vật tại phòng thí nghiệm.",
    source: "Boston Dynamics Press Kit",
    year: "2018",
    motif: "atlas-robot",
    gradient: grad("#4a205a", "#21092b"),
    exhibitId: "atlas-robot",
    featured: true,
  },
  {
    id: "h4-2",
    phase: "industry-4",
    caption: "Loa thông minh Amazon Echo trong không gian phòng khách hiện đại.",
    source: "Amazon Press Media",
    year: "2014",
    motif: "amazon-echo",
    gradient: grad("#3a1a4a", "#1a0824"),
    exhibitId: "amazon-echo",
  },
  {
    id: "h4-3",
    phase: "industry-4",
    caption: "Màn hình giới thiệu trợ lý ảo Siri trên điện thoại iPhone 4S.",
    source: "Apple Archive",
    year: "2011",
    motif: "iphone-4s",
    gradient: grad("#4a1a30", "#240815"),
    exhibitId: "iphone-4s",
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
