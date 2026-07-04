/**
 * Bảng màu cho cảnh 3D bóng đèn Edison (Phase 2 hero exhibit).
 * Tông ấm — thủy tinh ánh vàng, dây tóc sáng cam, đế đồng thau, gỗ tối.
 * Tất cả hex để dễ dùng trong material color.
 */

export const palette = {
  // Thủy tinh
  glass: "#f5f0e0",            // vỏ thủy tinh — ấm, mờ mờ
  glassHighlight: "#fff8d0",   // vùng sáng trên thủy tinh

  // Dây đốt
  filament: "#ff8a3a",         // dây tóc cam sáng
  filamentHot: "#fff5a0",      // lõi trắng vàng nóng

  // Đế kim loại
  baseMetal: "#9a7a3e",        // đế đồng thau có ren
  baseDark: "#3a2410",         // gốm cách điện
  neck: "#5a4222",             // cổ thủy tinh
  stem: "#d4d0c0",             // trụ thủy tinh bên trong

  // Glow accent (Phase 2 yellow)
  accent: "#e8b53a",
  accentDim: "#b88a1a",

  // Môi trường
  bgColor: "#1a1408",          // canvas background — tối ấm
  fogColor: "#1a1408",
  tableWood: "#3a2410",        // mặt bàn gỗ
  tableWoodLight: "#5a3a1e",

  // UI annotation
  annotation: "#e8b53a",
  annotationDim: "#b88a1a",
} as const;

export type PaletteKey = keyof typeof palette;
