/**
 * Kiểu cho các bộ phận Intel 4004 microprocessor — dùng cho annotation + click selection.
 */

export type ChipPartId =
  | "package"      // ceramic DIP body
  | "label"        // silk-screen label area
  | "pins"         // 16 pins (DIP-16)
  | "die"          // silicon die inside
  | "traces"       // circuit traces on PCB
  | "pcb";         // printed circuit board

export interface ChipPart {
  id: ChipPartId;
  label: string;        // tên hiển thị (tiếng Việt)
  description: string;  // mô tả ngắn
  /** Vị trí 3D (x, y, z) trong local space của chip group — cho annotation HTML */
  position: [number, number, number];
}

export const CHIP_PARTS: ChipPart[] = [
  {
    id: "package",
    label: "Vỏ gốm DIP-16",
    description: "Vỏ gốm đen 16 chân — đóng gói con chip silicon bên trong.",
    position: [0, 0.3, 0],
  },
  {
    id: "label",
    label: "Nhãn in",
    description: "Vùng in lụa ghi 'intel 4004' — dòng vi xử lý đầu tiên.",
    position: [0, 0.5, 0],
  },
  {
    id: "pins",
    label: "Chân cắm (16)",
    description: "16 chân bạc cắm vào socket — chân tín hiệu + chân nguồn.",
    position: [0, 0.0, 0.5],
  },
  {
    id: "die",
    label: "Die silicon",
    description: "Tấm silicon 12mm² chứa 2.300 bóng bán dẫn — bộ não thật.",
    position: [0, 0.35, 0],
  },
  {
    id: "traces",
    label: "Mạch in (PCB)",
    description: "Các đường mạch xanh kết nối chip với các linh kiện khác.",
    position: [0, -0.1, 0],
  },
  {
    id: "pcb",
    label: "Bo mạch in",
    description: "Bo mạch xanh đậm — nền tảng vật lý của hệ thống.",
    position: [0, -0.15, 0],
  },
];
