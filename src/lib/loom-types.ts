/**
 * Kiểu cho các bộ phận máy dệt — dùng cho annotation + click selection.
 */

export type LoomPartId =
  | "frame"
  | "warp-beam"
  | "warp-threads"
  | "heddles"
  | "harness"
  | "shuttle"
  | "reed"
  | "cloth-beam"
  | "treadles";

export interface LoomPart {
  id: LoomPartId;
  label: string;        // tên hiển thị (tiếng Việt)
  description: string;  // mô tả ngắn
  /** Vị trí 3D (x, y, z) trong local space của loom group — cho annotation HTML */
  position: [number, number, number];
}

export const LOOM_PARTS: LoomPart[] = [
  {
    id: "frame",
    label: "Khung gỗ",
    description: "Khung sồi chịu lực — держ tất cả bộ phận.",
    position: [0, 1.0, 0],
  },
  {
    id: "warp-beam",
    label: "Trục sợi dọc",
    description: "Cuộn sợi warp (dọc) — cấp sợi cho khung dệt.",
    position: [0, 1.4, -1.1],
  },
  {
    id: "warp-threads",
    label: "Sợi dọc (warp)",
    description: "Các sợi dọc căng đều — bệ cho sợi ngang đi qua.",
    position: [0, 1.2, -0.3],
  },
  {
    id: "heddles",
    label: "Lá dệt (heddles)",
    description: "Các lá dệt có lỗ — nâng/hạ sợi dọc tạo shed.",
    position: [-0.35, 1.1, 0.1],
  },
  {
    id: "harness",
    label: "Khung lá dệt",
    description: "Khung đỡ lá dệt, chuyển động lên/xuống theo bánh cam.",
    position: [-0.35, 1.3, 0.1],
  },
  {
    id: "shuttle",
    label: "Con thoi",
    description: "Con thoi mang sợi ngang (weft) đi qua shed.",
    position: [0, 1.0, 0.4],
  },
  {
    id: "reed",
    label: "Lược đánh (reed)",
    description: "Lược đồng đập sợi ngang chặt vào mép vải.",
    position: [0.35, 1.1, 0.1],
  },
  {
    id: "cloth-beam",
    label: "Trục cuộn vải",
    description: "Cuộn vải đã dệt thành tấm.",
    position: [0, 0.8, 1.1],
  },
  {
    id: "treadles",
    label: "Bàn đạp",
    description: "Bàn đạp chân — điều khiển khung lá dệt lên/xuống.",
    position: [0, 0.1, 0.5],
  },
];
