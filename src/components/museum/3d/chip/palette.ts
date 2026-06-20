/**
 * Bảng màu cho cảnh 3D Intel 4004 microprocessor.
 * Tông xanh đen — gốm DIP tối, đồng thau nhãn, bạc chân cắm,
 * xanh lá Phase 3 cho mạch in + silicon die phát sáng.
 * Tất cả hex để dễ dùng trong material color.
 */

export const palette = {
  // Vỏ chip (DIP-16 ceramic)
  chipBody: "#1a1a1a",       // gốm đen DIP
  chipBodyLight: "#2a2a2a",  // gốm sáng hơn khi highlight
  chipLabel: "#d4b87a",      // vàng in lụa — vùng nhãn "intel 4004"
  chipLabelDim: "#8a7340",

  // Chân cắm
  pins: "#b8b8b8",           // chân bạc
  pinsDark: "#7a7a7a",
  pinsHighlight: "#e0e0e0",

  // Phase 3 xanh lá — accent
  accent: "#4ade80",
  accentDim: "#2d9d52",

  // Mạch in (PCB)
  circuitTrace: "#4ade80",   // đường mạch xanh phát sáng
  pcbGreen: "#0a3a1a",       // nền bo mạch xanh đậm
  pcbGreenLight: "#0f4a22",  // bo mạch sáng hơn khi highlight
  solderPad: "#c9a05a",      // miếng hàn vàng đồng

  // Silicon die
  silicon: "#3a4a5a",        // tấm silicon xám-xanh

  // Môi trường
  bgColor: "#0a1410",        // nền canvas — xanh đen pha xanh
  fogColor: "#0a1410",

  // UI annotation
  annotation: "#4ade80",
  annotationDim: "#2d9d52",
} as const;

export type PaletteKey = keyof typeof palette;
