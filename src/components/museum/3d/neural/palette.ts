/**
 * Bảng màu cho cảnh 3D mạng nơ-ron (Neural Network — AlexNet, Phase 4 hero).
 * Tông tím-hồng neon — nơ-ron phát sáng fuchsia, xung dữ liệu vàng nóng,
 * nền tím đen sâu. Phase 4 accent là pink (#e879f9).
 * Tất cả hex để dễ dùng trong material color.
 */

export const palette = {
  // Nơ-ron (nodes)
  nodeOff: "#3a1438",        // nơ-ron tắt — tím đậm
  nodeOn: "#e879f9",         // nơ-ron đang fire — hồng fuchsia sáng
  nodeCore: "#fff",          // lõi trắng nóng

  // Kết nối (connections / synapses)
  connectionOff: "#4a1a44",  // dây tắt — tím đậm
  connectionOn: "#e879f9",   // dây sáng — hồng fuchsia

  // Màu từng lớp (layer accents)
  layer1Color: "#e879f9",    // input layer — hồng sáng
  layer2Color: "#c026d3",    // hidden layers — magenta
  layer3Color: "#a21caf",    // output layer — tím đậm

  // Xung dữ liệu (data pulse)
  dataPulse: "#fff8a0",      // xung vàng nóng chạy dọc kết nối

  // Accent (Phase 4 pink)
  accent: "#e879f9",
  accentDim: "#a21caf",

  // Môi trường
  bgColor: "#0a0510",        // nền canvas — tím đen sâu
  fogColor: "#0a0510",
  floorColor: "#1a0a18",     // đế/platform tối

  // UI annotation
  annotation: "#e879f9",
  annotationDim: "#a21caf",
} as const;

export type PaletteKey = keyof typeof palette;
