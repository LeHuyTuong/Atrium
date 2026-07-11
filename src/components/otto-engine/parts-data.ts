export interface OttoPartDef {
  id: string;
  name: { vi: string; en: string };
  desc: { vi: string; en: string };
}

export const OTTO_PARTS: OttoPartDef[] = [
  {
    id: "block",
    name: { vi: "Thân máy & Xi-lanh", en: "Engine Block & Cylinder" },
    desc: {
      vi: "Nơi diễn ra quá trình cháy và dẫn hướng cho pít-tông.",
      en: "Houses the combustion process and guides the piston.",
    },
  },
  {
    id: "piston",
    name: { vi: "Pít-tông", en: "Piston" },
    desc: {
      vi: "Chuyển động lên xuống, nhận áp lực từ khí cháy.",
      en: "Moves up and down, receiving pressure from combustion.",
    },
  },
  {
    id: "conrod",
    name: { vi: "Thanh truyền (Tay biên)", en: "Connecting Rod" },
    desc: {
      vi: "Truyền lực từ pít-tông xuống trục khuỷu.",
      en: "Transmits force from piston to crankshaft.",
    },
  },
  {
    id: "crankshaft",
    name: { vi: "Trục khuỷu & Cacte", en: "Crankshaft & Crankcase" },
    desc: {
      vi: "Biến chuyển động tịnh tiến thành chuyển động quay.",
      en: "Converts linear motion into rotational motion.",
    },
  },
  {
    id: "flywheel",
    name: { vi: "Bánh đà", en: "Flywheel" },
    desc: {
      vi: "Tích trữ động năng, giúp động cơ quay đều qua các kỳ.",
      en: "Stores momentum to keep the engine spinning smoothly.",
    },
  },
  {
    id: "intake-valve",
    name: { vi: "Van nạp & Đường nạp", en: "Intake Valve & Manifold" },
    desc: {
      vi: "Mở để hút hỗn hợp nhiên liệu - không khí vào xi-lanh.",
      en: "Opens to draw air-fuel mixture into the cylinder.",
    },
  },
  {
    id: "exhaust-valve",
    name: { vi: "Van xả & Đường xả", en: "Exhaust Valve & Manifold" },
    desc: {
      vi: "Mở để đẩy khí thải ra ngoài sau khi cháy.",
      en: "Opens to expel exhaust gases after combustion.",
    },
  },
  {
    id: "spark-plug",
    name: { vi: "Bugi", en: "Spark Plug" },
    desc: {
      vi: "Tạo tia lửa điện châm ngòi hỗn hợp nhiên liệu.",
      en: "Creates a spark to ignite the air-fuel mixture.",
    },
  },
];
