/**
 * Bảng màu cho cảnh 3D máy dệt (Power Loom).
 * Tông ấm — gỗ sồi cũ, đồng thau, sợi vải đỏ son, vải dệt kem.
 * Tất cả hex để dễ dùng trong material color.
 */

export const palette = {
  // Gỗ
  frameWood: "#6b3a1a",        // gỗ sồi cũ, nâu đậm
  frameWoodLight: "#8a4f24",   // gỗ sáng hơn cho chi tiết
  beamWood: "#5a2e14",         // trục cuộn gỗ đậm
  treadleWood: "#4a2410",      // bàn đạp gỗ tối

  // Kim loại
  brass: "#b8893f",            // đồng thau — các vòng bi, ống l bạc
  darkBrass: "#7a5a2e",
  steel: "#9a9a9a",            // thép — trục, thanh dẫn

  // Sợi vải
  warpRed: "#c4392f",          // sợi dọc (warp) đỏ son
  warpRedLight: "#e85d4f",
  weftCream: "#e8d5a8",        // sợi ngang (weft) kem
  cloth: "#d4b87a",            // vải đã dệt

  // Môi trường
  floorWood: "#3a2410",        // sàn xưởng
  floorWoodLight: "#5a3a1e",   // ván sàn sáng
  bgColor: "#1c130b",          // background canvas
  fogColor: "#1c130b",

  // UI annotation
  annotation: "#e8b53a",       // vàng — màu nhãn
  annotationDim: "#8a6a2e",
} as const;

export type PaletteKey = keyof typeof palette;
