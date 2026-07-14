// Atrium — Huy hiệu thành tựu (12 huy hiệu)

import { EXHIBITS, PHASES, CONNECTIONS } from "./museum-data";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  tier: "bronze" | "silver" | "gold" | "platinum";
  check: (state: AchievementState) => boolean;
}

export interface AchievementState {
  seenExhibits: Set<string>;
  bookmarkedExhibits: Set<string>;
  phasesEntered: Set<string>;
  quizzesPassed: number;
  connectionsExplored: Set<string>;
  tourCompleted: boolean;
  guestbookSigned: boolean;
  exhibitsCompared: boolean;
  searchUsed: boolean;
  compareCount: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "Bước đầu tiên",
    description: "Mở hiện vật đầu tiên trong bảo tàng.",
    icon: "Footprints",
    tier: "bronze",
    check: (s) => s.seenExhibits.size >= 1,
  },
  {
    id: "curious-mind",
    name: "Tâm hồn tò mò",
    description: "Xem tất cả hiện vật trong cùng một kỷ nguyên.",
    icon: "Eye",
    tier: "bronze",
    check: (s) => PHASES.some((p) => EXHIBITS.filter((e) => e.phase === p.id).every((e) => s.seenExhibits.has(e.id))),
  },
  {
    id: "era-explorer",
    name: "Nhà thám hiểm kỷ nguyên",
    description: "Bước chân vào cả 4 phòng kỷ nguyên.",
    icon: "Compass",
    tier: "silver",
    check: (s) => s.phasesEntered.size >= 4,
  },
  {
    id: "collector",
    name: "Nhà sưu tầm",
    description: "Đánh dấu yêu thích 5 hiện vật.",
    icon: "Bookmark",
    tier: "silver",
    check: (s) => s.bookmarkedExhibits.size >= 5,
  },
  {
    id: "scholar",
    name: "Học giả",
    description: "Vượt qua 3 câu hỏi trắc nghiệm.",
    icon: "GraduationCap",
    tier: "silver",
    check: (s) => s.quizzesPassed >= 3,
  },
  {
    id: "master-scholar",
    name: "Học giả xuất chúng",
    description: "Vượt qua cả 12 câu hỏi trắc nghiệm.",
    icon: "Award",
    tier: "gold",
    check: (s) => s.quizzesPassed >= 12,
  },
  {
    id: "weaver",
    name: "Người dệt mạng",
    description: "Khám phá 3 mạch liên kết xuyên thời gian.",
    icon: "Network",
    tier: "gold",
    check: (s) => s.connectionsExplored.size >= 3,
  },
  {
    id: "completionist",
    name: "Hoàn tất bộ sưu tập",
    description: "Mở tất cả hiện vật trong bảo tàng.",
    icon: "CheckCircle2",
    tier: "platinum",
    check: (s) => s.seenExhibits.size >= EXHIBITS.length,
  },
  {
    id: "comparator",
    name: "Nhà so sánh",
    description: "So sánh 2 hiện vật cạnh nhau.",
    icon: "Columns2",
    tier: "bronze",
    check: (s) => s.exhibitsCompared,
  },
  {
    id: "detective",
    name: "Thám tử tư",
    description: "Sử dụng ô tìm kiếm (Cmd+K).",
    icon: "Search",
    tier: "bronze",
    check: (s) => s.searchUsed,
  },
  {
    id: "tour-completer",
    name: "Khách tham quan có hướng dẫn",
    description: "Hoàn tất một chuyến tham quan có hướng dẫn.",
    icon: "Route",
    tier: "gold",
    check: (s) => s.tourCompleted,
  },
  {
    id: "guestbook-signer",
    name: "Khách của bảo tàng",
    description: "Ký tên vào sổ khách.",
    icon: "PenLine",
    tier: "bronze",
    check: (s) => s.guestbookSigned,
  },
];

export function checkAchievements(state: AchievementState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.check(state));
}
