export interface PartInfo {
  id: string;
  name: string; // Vietnamese name
  nameEn: string; // English name
  short: string; // one-line Vietnamese
  shortEn: string; // one-line English
  description: string; // longer Vietnamese description
  descriptionEn: string; // longer English description
  labelPos: [number, number, number];
  accent: string; // hex color for label dot
  category: "structure" | "steam" | "motion" | "control";
}

export const PARTS: PartInfo[] = [
  {
    id: "boiler",
    name: "Lò hơi",
    nameEn: "Boiler",
    short: "Sinh hơi nước áp suất cao",
    shortEn: "Generates high-pressure steam",
    description:
      "Lò hơi đốt than để sinh hơi nước bão hòa áp suất cao. Hơi đi qua van an toàn và ống dẫn hơi tới hộp hơi của xy-lanh.",
    descriptionEn:
      "The boiler burns coal to produce high-pressure saturated steam. Steam passes through the safety valve and steam pipe to the cylinder's steam chest.",
    labelPos: [-5.6, 2.55, 0],
    accent: "#d97706",
    category: "steam",
  },
  {
    id: "steam-pipe",
    name: "Ống hơi",
    nameEn: "Steam pipe",
    short: "Dẫn hơi từ lò hơi đến xy-lanh",
    shortEn: "Carries steam from boiler to cylinder",
    description:
      "Ống đồng dẫn hơi nước từ nắp hơi (steam dome) của lò hơi đến hộp hơi phía trên xy-lanh, có mặt bích nối.",
    descriptionEn:
      "A copper pipe carrying steam from the boiler's steam dome to the steam chest atop the cylinder, with flange joints.",
    labelPos: [-3.8, 3.35, 0.3],
    accent: "#b5603a",
    category: "steam",
  },
  {
    id: "steam-chest",
    name: "Hộp hơi & van trượt",
    nameEn: "Steam chest & slide valve",
    short: "Phân phối hơi vào xy-lanh",
    shortEn: "Distributes steam into the cylinder",
    description:
      "Hộp hơi chứa van trượt (slide valve) do cam trên trục khuỷu điều khiển, đóng mở các cổ hơi để nạp/xả hơi đúng nhịp.",
    descriptionEn:
      "The steam chest contains a slide valve actuated by a cam on the crankshaft, opening and closing steam ports to admit and exhaust steam at the right timing.",
    labelPos: [-2.4, 2.65, 0.95],
    accent: "#c9922a",
    category: "control",
  },
  {
    id: "cylinder",
    name: "Xy-lanh",
    nameEn: "Cylinder",
    short: "Nơi hơi đẩy pít-tông",
    shortEn: "Where steam pushes the piston",
    description:
      "Xy-lanh bằng gang đúc, pít-tông chuyển động tịnh tiến bên trong. Hơi đẩy pít-tông đi lên (động cơ đơn động) hoặc cả hai chiều (động cơ kép tác dụng).",
    descriptionEn:
      "A cast-iron cylinder with a piston moving linearly inside. Steam pushes the piston upward (single-acting) or both ways (double-acting engine).",
    labelPos: [-2.0, 1.7, 0.9],
    accent: "#9ca3af",
    category: "motion",
  },
  {
    id: "piston",
    name: "Pít-tông",
    nameEn: "Piston",
    short: "Chuyển động tịnh tiến",
    shortEn: "Moves linearly",
    description:
      "Pít-tông bằng thép có vành đạn đồng, chuyển động lên–xuất trong xy-lanh. Thanh pít-tông nối với đầu trái của đòn cân.",
    descriptionEn:
      "A steel piston with brass rings, moving up and down in the cylinder. The piston rod connects to the left end of the beam.",
    labelPos: [-2.85, 1.6, 0.4],
    accent: "#566578",
    category: "motion",
  },
  {
    id: "beam",
    name: "Đòn cân (dầm đung đưa)",
    nameEn: "Beam (rocking lever)",
    short: "Chuyển đổi tịnh tiến ↔ đung đưa",
    shortEn: "Converts linear ↔ rocking motion",
    description:
      "Dầm gang lớn đung đưa quanh chốt tựa ở giữa — biểu tượng của động cơ Watt. Đầu trái nối pít-tông, đầu phải nối thanh truyền đến trục khuỷu.",
    descriptionEn:
      "A large cast-iron beam rocking on a central pivot — the symbol of Watt's engine. The left end connects to the piston, the right end to the connecting rod to the crankshaft.",
    labelPos: [0, 4.95, 0],
    accent: "#a87822",
    category: "motion",
  },
  {
    id: "parallel-motion",
    name: "Cơ cấu chuyển động song song Watt",
    nameEn: "Watt's parallel motion",
    short: "Phát minh vĩ đại nhất của Watt",
    shortEn: "Watt's greatest invention",
    description:
      "Bộ khâu 3 thanh khiến đầu thanh pít-tông di chuyển theo đường gần thẳng đứng dù đầu đòn cân đi theo vòng cung. Watt gọi đây là phát minh mình tự hào nhất.",
    descriptionEn:
      "A 3-bar linkage that makes the piston rod top travel in a nearly straight vertical line even though the beam end follows an arc. Watt called this his proudest invention.",
    labelPos: [-2.3, 3.4, 0.5],
    accent: "#b5603a",
    category: "motion",
  },
  {
    id: "conrod",
    name: "Thanh truyền",
    nameEn: "Connecting rod",
    short: "Đòn cân → trục khuỷu",
    shortEn: "Beam → crankshaft",
    description:
      "Thanh truyền nối đầu phải của đòn cân với chốt khuỷu trên bánh đà, biến dao động của đòn cân thành chuyển động quay.",
    descriptionEn:
      "The connecting rod links the beam's right end to the crank pin on the flywheel, converting the beam's oscillation into rotary motion.",
    labelPos: [3.4, 3.15, 0],
    accent: "#8a9099",
    category: "motion",
  },
  {
    id: "flywheel",
    name: "Bánh đà",
    nameEn: "Flywheel",
    short: "Quán tính giữ đều tốc độ",
    shortEn: "Inertia smooths the speed",
    description:
      "Bánh đà lớn tích lũy động năng, giữ cho trục khuỷu quay đều qua các kỳ chết (TDC/BDC). Chốt khuỷu lệch tâm một khoảng bằng bán kính khuỷu.",
    descriptionEn:
      "The large flywheel stores kinetic energy, keeping the crankshaft turning smoothly through dead centres (TDC/BDC). The crank pin is offset by the crank radius.",
    labelPos: [4.6, 2.1, 0.55],
    accent: "#566578",
    category: "motion",
  },
  {
    id: "governor",
    name: "Bộ điều tốc ly tâm",
    nameEn: "Centrifugal governor",
    short: "Tự động giữ đều tốc độ",
    shortEn: "Automatically holds speed constant",
    description:
      "Hai quả cầu quay theo tốc độ động cơ; khi quay nhanh hơn, lực ly tâm làm quả cầu văng ra ngoài, kéo sleeve lên và đóng bớt van hơi — giữ tốc độ không đổi.",
    descriptionEn:
      "Two balls spin at engine speed; when spinning faster, centrifugal force flings them outward, raising the sleeve and closing the steam valve — automatically holding speed constant.",
    labelPos: [2.4, 3.7, 0.9],
    accent: "#c9922a",
    category: "control",
  },
  {
    id: "condenser",
    name: "Bộ ngưng riêng (Watt)",
    nameEn: "Separate condenser (Watt)",
    short: "Phát minh then chốt tiết kiệm than",
    shortEn: "Key invention saving fuel",
    description:
      "Watt tách bộ ngưng ra khỏi xy-lanh: hơi xả được phun nước lạnh để ngưng thành nước, tạo chân không kéo pít-tông xuống. Tránh phải làm nóng/làm lạnh xy-lanh mỗi nhịp — tăng hiệu suất gấp 3–4 lần Newcomen.",
    descriptionEn:
      "Watt separated the condenser from the cylinder: exhaust steam is sprayed with cold water to condense it, creating a vacuum that pulls the piston down. This avoids heating/cooling the cylinder each cycle — 3–4× more efficient than Newcomen's.",
    labelPos: [-3.5, 1.4, 0.55],
    accent: "#6b6660",
    category: "steam",
  },
  {
    id: "air-pump",
    name: "Bơm khí",
    nameEn: "Air pump",
    short: "Rút nước & không khí khỏi bộ ngưng",
    shortEn: "Removes water & air from the condenser",
    description:
      "Bơm kiểu Pitts đặt trên bộ ngưng, rút nước ngưng và không khí ra ngoài để duy trì chân không, đẩy nước về bình nóng (hot well).",
    descriptionEn:
      "A Pitts-type pump atop the condenser, extracting condensed water and air to maintain the vacuum, pushing water to the hot well.",
    labelPos: [-3.3, 1.5, 0.6],
    accent: "#c9922a",
    category: "steam",
  },
];

export const PART_MAP: Record<string, PartInfo> = Object.fromEntries(
  PARTS.map((p) => [p.id, p]),
);
