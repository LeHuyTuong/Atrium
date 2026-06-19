// Atrium — Ảnh lịch sử (dữ liệu ký họa, dùng cho Photo Wall)
// Mỗi kỷ nguyên 7 ảnh = 28 ảnh tổng. Dùng biểu diễn ký họa atmospheric
// (gradient + motif) thay vì ảnh bản quyền thật, kèm caption + nguồn tiếng Việt.

import { PhaseId, PHASES, Motif, Exhibit } from "./museum-data";

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
  // Industry 1.0 (7)
  {
    id: "h1-1",
    phase: "industry-1",
    caption: "Động cơ hơi nước Watt tại nhà máy Soho, Birmingham.",
    source: "Bảo tàng Khoa học London",
    year: "khoảng 1788",
    motif: "steam",
    gradient: grad("#3a2410", "#1a0f0a"),
    exhibitId: "watt-steam",
    featured: true,
  },
  {
    id: "h1-2",
    phase: "industry-1",
    caption: "Cái ghé quay sợi James Hargreaves trong xưởng dệt Lancashire.",
    source: "Bảo tàng Khoa học Manchester",
    year: "khoảng 1770",
    motif: "loom",
    gradient: grad("#4a2f18", "#241409"),
    exhibitId: "spinning-jenny",
  },
  {
    id: "h1-3",
    phase: "industry-1",
    caption: "Máy tách hạt bông của Eli Whitney tại đồn điền Georgia.",
    source: "Viện Smithsonian",
    year: "khoảng 1793",
    motif: "cotton-gin",
    gradient: grad("#43261a", "#1d0f08"),
    exhibitId: "cotton-gin",
  },
  {
    id: "h1-4",
    phase: "industry-1",
    caption: "Lò luyện sắt puddling Henry Cort trong xưởng rèn Hampshire.",
    source: "Bảo tàng Sắt & Thép Sheffield",
    year: "khoảng 1790",
    motif: "puddling",
    gradient: grad("#5a2a10", "#240f05"),
    exhibitId: "puddling-furnace",
  },
  {
    id: "h1-5",
    phase: "industry-1",
    caption: "Đầu máy Rocket tại cuộc thi Rainhill, 1829.",
    source: "Bảo tàng Đường sắt Quốc gia Anh",
    year: "1829",
    motif: "locomotive",
    gradient: grad("#3e2410", "#1a0f0a"),
    exhibitId: "rocket-locomotive",
  },
  {
    id: "h1-6",
    phase: "industry-1",
    caption: "Đèn gas Murdoch thắp sáng nhà máy Boulton & Watt.",
    source: "Bảo tàng Khí gas Quốc gia Anh",
    year: "khoảng 1807",
    motif: "gas-lamp",
    gradient: grad("#5a3a14", "#241409"),
    exhibitId: "gas-lamp",
  },
  {
    id: "h1-7",
    phase: "industry-1",
    caption: "Đường hầm Thames của Brunel mở cho công chúng.",
    source: "Bảo tàng Giao thông London",
    year: "1843",
    motif: "thames-shield",
    gradient: grad("#2a1f14", "#140c06"),
    exhibitId: "thames-tunnel",
  },

  // Industry 2.0 (7)
  {
    id: "h2-1",
    phase: "industry-2",
    caption: "Bóng đèn Edison tại phòng thí nghiệm Menlo Park.",
    source: "Bảo tàng Quốc gia Lịch sử Mỹ",
    year: "1879",
    motif: "light-bulb",
    gradient: grad("#5a4216", "#241a08"),
    exhibitId: "light-bulb",
    featured: true,
  },
  {
    id: "h2-2",
    phase: "industry-2",
    caption: "Máy phát điện dynamo Siemens tại triển lãm Berlin.",
    source: "Bảo tàng Deutsches",
    year: "1866",
    motif: "dynamo",
    gradient: grad("#4a3a14", "#221a08"),
    exhibitId: "dynamo",
  },
  {
    id: "h2-3",
    phase: "industry-2",
    caption: "Băng chuyền Ford Model T tại nhà máy Highland Park.",
    source: "Bảo tàng Henry Ford",
    year: "1913",
    motif: "assembly",
    gradient: grad("#4a3410", "#221608"),
    exhibitId: "model-t",
  },
  {
    id: "h2-4",
    phase: "industry-2",
    caption: "Động cơ Otto 4 thì tại xưởng Deutz.",
    source: "Bảo tàng Kỹ thuật Deutz",
    year: "1876",
    motif: "otto",
    gradient: grad("#3a2810", "#1c1408"),
    exhibitId: "otto-engine",
  },
  {
    id: "h2-5",
    phase: "industry-2",
    caption: "Trạm vô tuyến Marconi tại Newfoundland đón tín hiệu xuyên đại dương.",
    source: "Bảo tàng Marconi Ý",
    year: "1901",
    motif: "marconi",
    gradient: grad("#3a3214", "#1c1808"),
    exhibitId: "marconi-radio",
  },
  {
    id: "h2-6",
    phase: "industry-2",
    caption: "Vệ tinh Telstar trong phòng sạch trước khi phóng.",
    source: "Lưu trữ NASA",
    year: "1962",
    motif: "marconi",
    gradient: grad("#2a2a1a", "#141410"),
    exhibitId: "telstar",
  },
  {
    id: "h2-7",
    phase: "industry-2",
    caption: "Máy biến áp AC Ganz tại nhà máy điện Budapest.",
    source: "Bảo tàng Kỹ thuật Budapest",
    year: "1885",
    motif: "transformer",
    gradient: grad("#4a3a14", "#221808"),
    exhibitId: "ac-transformer",
  },

  // Industry 3.0 (7)
  {
    id: "h3-1",
    phase: "industry-3",
    caption: "Vi xử lý Intel 4004 — con chip đầu tiên của công ty.",
    source: "Bảo tàng Lịch sử Máy tính",
    year: "1971",
    motif: "chip",
    gradient: grad("#143a24", "#08180f"),
    exhibitId: "intel-4004",
    featured: true,
  },
  {
    id: "h3-2",
    phase: "industry-3",
    caption: "Bảng nút ARPANET tại UCLA, nơi gửi tin nhắn đầu tiên.",
    source: "Bảo tàng Lịch sử Máy tính",
    year: "1969",
    motif: "network",
    gradient: grad("#103a2a", "#081812"),
    exhibitId: "arpanet",
  },
  {
    id: "h3-3",
    phase: "industry-3",
    caption: "Tim Berners-Lee tại NeXT — máy chạy trang web đầu tiên.",
    source: "Lưu trữ CERN",
    year: "1991",
    motif: "www",
    gradient: grad("#103c2a", "#081812"),
    exhibitId: "www",
  },
  {
    id: "h3-4",
    phase: "industry-3",
    caption: "Gói kẹo cao su Wrigley — sản phẩm quét mã vạch đầu tiên.",
    source: "Viện Smithsonian",
    year: "1974",
    motif: "upc",
    gradient: grad("#143a30", "#081a14"),
    exhibitId: "bar-code",
  },
  {
    id: "h3-5",
    phase: "industry-3",
    caption: "Máy thu GPS quân sự đầu tiên thử nghiệm tại New Mexico.",
    source: "Lưu trữ Không quân Mỹ",
    year: "1978",
    motif: "gps",
    gradient: grad("#10382a", "#081a14"),
    exhibitId: "gps",
  },
  {
    id: "h3-6",
    phase: "industry-3",
    caption: "Martin Cooper cầm DynaTAC giữa phố New York.",
    source: "Lưu trữ Motorola",
    year: "1973",
    motif: "phone",
    gradient: grad("#143a2a", "#08180f"),
    exhibitId: "cell-phone",
  },
  {
    id: "h3-7",
    phase: "industry-3",
    caption: "Máy IBM PC 5150 và màn hình CRT xanh–đen.",
    source: "Bảo tàng IBM",
    year: "1981",
    motif: "monitor",
    gradient: grad("#143c2a", "#081a12"),
    exhibitId: "pc-monitor",
  },

  // Industry 4.0 (7)
  {
    id: "h4-1",
    phase: "industry-4",
    caption: "AlexNet chạy trên GPU gaming tại phòng lab Toronto.",
    source: "Lưu trữ Hinton Lab",
    year: "2012",
    motif: "neural-net",
    gradient: grad("#3a143a", "#180818"),
    exhibitId: "neural-net",
    featured: true,
  },
  {
    id: "h4-2",
    phase: "industry-4",
    caption: "Máy in 3D RepRap tự in linh kiện của chính nó.",
    source: "Dự án RepRap",
    year: "2009",
    motif: "printer",
    gradient: grad("#3a143a", "#180818"),
    exhibitId: "3d-printer",
  },
  {
    id: "h4-3",
    phase: "industry-4",
    caption: "Xe Waymo tự hành không tay lái tại Phoenix.",
    source: "Waymo Public Affairs",
    year: "2017",
    motif: "car",
    gradient: grad("#3a1a3a", "#180a18"),
    exhibitId: "tesla-autopilot",
  },
  {
    id: "h4-4",
    phase: "industry-4",
    caption: "Bảng điều khiển AWS EC2 khi ra mắt dịch vụ « máy chủ theo phút ».",
    source: "Lưu trữ Amazon",
    year: "2006",
    motif: "cloud",
    gradient: grad("#3a143a", "#180818"),
    exhibitId: "cloud-aws",
  },
  {
    id: "h4-5",
    phase: "industry-4",
    caption: "Steve Jobs giới thiệu iPhone tại Macworld 2007.",
    source: "Lưu trữ Apple",
    year: "2007",
    motif: "smartphone",
    gradient: grad("#3a1a3a", "#180a18"),
    exhibitId: "smartphone",
  },
  {
    id: "h4-6",
    phase: "industry-4",
    caption: "Falcon 9 hạ cánh thẳng đứng tại mũi Cape lần đầu.",
    source: "Lưu trữ SpaceX",
    year: "2015",
    motif: "rocket",
    gradient: grad("#3a1a3a", "#180a18"),
    exhibitId: "falcon-9",
  },
  {
    id: "h4-7",
    phase: "industry-4",
    caption: "Người máy Figure 01 bước đi trong nhà máy BMW.",
    source: "Figure AI",
    year: "2024",
    motif: "robot",
    gradient: grad("#3a143a", "#180818"),
    exhibitId: "humanoid-robot",
  },
];

export function imagesByPhase(phase: PhaseId): HistoricalImage[] {
  return HISTORICAL_IMAGES.filter((i) => i.phase === phase);
}

export function imageByIndex(index: number): HistoricalImage | undefined {
  return HISTORICAL_IMAGES[index];
}

export function heroImageForPhase(phase: PhaseId): HistoricalImage | undefined {
  return HISTORICAL_IMAGES.find((i) => i.phase === phase && i.featured);
}

export function imageForExhibit(exhibitId: string): HistoricalImage | undefined {
  return HISTORICAL_IMAGES.find((i) => i.exhibitId === exhibitId);
}

export const TOTAL_HISTORICAL_IMAGES = HISTORICAL_IMAGES.length;

export function phaseAccent(phaseId: PhaseId): string {
  return PHASES.find((p) => p.id === phaseId)?.accent ?? "#e89446";
}

export function gradientForExhibit(exhibit: Exhibit): string {
  const phase = PHASES.find((p) => p.id === exhibit.phase)!;
  // build a per-exhibit tinted gradient using phase accent
  return `radial-gradient(ellipse 80% 70% at 50% 30%, ${phase.accent}22 0%, transparent 60%), linear-gradient(160deg, ${phase.accent}14 0%, oklch(0.14 0.012 55) 70%)`;
}
