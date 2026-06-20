/**
 * Kiểu cho các bộ phận mạng nơ-ron — dùng cho annotation + click selection.
 * Mô hình AlexNet-style rút gọn: 4 lớp (4 → 6 → 6 → 3 nơ-ron).
 */

export type NeuralPartId =
  | "input-layer"    // lớp đầu vào (4 nơ-ron)
  | "hidden-layer-1" // lớp ẩn 1 (6 nơ-ron)
  | "hidden-layer-2" // lớp ẩn 2 (6 nơ-ron)
  | "output-layer"   // lớp đầu ra (3 nơ-ron)
  | "connections"    // tất cả kết nối synapse
  | "data-flow";     // xung dữ liệu động

export interface NeuralPart {
  id: NeuralPartId;
  label: string;        // tên hiển thị (tiếng Việt)
  description: string;  // mô tả ngắn
  /** Vị trí 3D (x, y, z) trong local space của neural group — cho annotation HTML */
  position: [number, number, number];
}

export const NEURAL_PARTS: NeuralPart[] = [
  {
    id: "input-layer",
    label: "Lớp đầu vào",
    description: "4 nơ-ron đầu vào — nhận dữ liệu thô (pixel ảnh).",
    position: [-1.8, 0, 0],
  },
  {
    id: "hidden-layer-1",
    label: "Lớp ẩn 1",
    description: "6 nơ-ron — trích xuất đặc trưng cấp thấp (cạnh, góc).",
    position: [-0.6, 0, 0],
  },
  {
    id: "hidden-layer-2",
    label: "Lớp ẩn 2",
    description: "6 nơ-ron — trích xuất đặc trưng cấp cao (hình dạng).",
    position: [0.6, 0, 0],
  },
  {
    id: "output-layer",
    label: "Lớp đầu ra",
    description: "3 nơ-ron — phân loại cuối (mèo, chó, chim).",
    position: [1.8, 0, 0],
  },
  {
    id: "connections",
    label: "Synapse",
    description: "Các kết nối trọng số — mỗi dây mang một trọng số học được.",
    position: [0, 0.5, 0],
  },
  {
    id: "data-flow",
    label: "Dòng dữ liệu",
    description: "Xung dữ liệu chạy qua mạng theo từng lớp — forward pass.",
    position: [0, 1.0, 0],
  },
];
