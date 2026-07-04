/**
 * Kiểu cho các bộ phận bóng đèn Edison — dùng cho annotation + click selection.
 */

export type BulbPartId =
  | "envelope"   // glass bulb
  | "filament"   // glowing filament
  | "stem"       // glass stem holding filament
  | "neck"       // glass neck
  | "base"       // brass screw base
  | "insulator"; // ceramic insulator

export interface BulbPart {
  id: BulbPartId;
  label: string;
  description: string;
  position: [number, number, number];
}

export const BULB_PARTS: BulbPart[] = [
  { id: "envelope", label: "Bóng thủy tinh", description: "Vỏ thủy tinh chân không — giữ sợi đốt không bị cháy.", position: [0, 0.5, 0] },
  { id: "filament", label: "Sợi đốt", description: "Sợi tre cácbon hóa — sáng trắng khi dòng điện đi qua.", position: [0, 0.45, 0] },
  { id: "stem", label: "Trụ thủy tinh", description: "Trụ thủy tinh giữ sợi đốt và dẫn điện vào trong.", position: [0, 0.1, 0] },
  { id: "neck", label: "Cổ bóng", description: "Cổ thủy tinh nối bóng với đế đồng.", position: [0, -0.15, 0] },
  { id: "base", label: "Đế đồng", description: "Đế đồng có ren — vặn vào đui đèn để tiếp điện.", position: [0, -0.35, 0] },
  { id: "insulator", label: "Cách điện", description: "Lớp gốm cách điện ở đáy đế.", position: [0, -0.5, 0] },
];
