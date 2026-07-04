"use client";

import { useEngineStore } from "../useEngineStore";

const TOUR = [
  {
    id: "intro",
    title: "Động cơ đốt trong 4 kỳ",
    titleEn: "4-Stroke Internal Combustion Engine",
    narration:
      "Nikolaus Otto phát minh động cơ 4 kỳ năm 1876 — bước ngoặt của kỷ nguyên điện khí hóa. Đây là trái tim của mọi phương tiện giao thông hiện đại.",
    narrationEn:
      "Nikolaus Otto invented the 4-stroke engine in 1876 — the turning point of the electrical age. It's the heart of all modern transportation.",
  },
  {
    id: "block",
    title: "Thân máy & Pít-tông",
    titleEn: "Block & Pistons",
    narration:
      "4 pít-tông chuyển động lên-xuống trong thân gang. Mỗi pít-tông thực hiện 4 kỳ: nạp, nén, nổ, xả.",
    narrationEn:
      "4 pistons move up and down in the cast-iron block. Each piston performs 4 strokes: intake, compression, power, exhaust.",
  },
  {
    id: "crank",
    title: "Trục khuỷu & Thanh truyền",
    titleEn: "Crankshaft & Connecting Rods",
    narration:
      "Thanh truyền biến chuyển động tịnh tiến của pít-tông thành chuyển động quay của trục khuỷu. Bố trí chốt khuỷu 180° giúp cân bằng lực.",
    narrationEn:
      "Connecting rods convert piston reciprocation into crankshaft rotation. 180° crank throws balance the forces.",
  },
  {
    id: "valvetrain",
    title: "Cơ cấu van & Trục cam",
    titleEn: "Valvetrain & Camshaft",
    narration:
      "Trục cam quay chậm hơn trục khuỷu 2 lần, điều khiển 8 van nấm đóng/mở đúng nhịp để nạp không khí và xả khí cháy.",
    narrationEn:
      "The camshaft rotates at half crankshaft speed, controlling 8 poppet valves to admit air and exhaust combustion gases at the right timing.",
  },
  {
    id: "cycle",
    title: "Chu trình 4 kỳ",
    titleEn: "The 4-Stroke Cycle",
    narration:
      "Kỳ 1 (Nạp): pít-tông đi xuống, hút hỗn hợp nhiên liệu. Kỳ 2 (Nén): pít-tông đi lên, nén hỗn hợp. Kỳ 3 (Nổ): bugi đánh lửa, đốt cháy hỗn hợp. Kỳ 4 (Xả): pít-tông đi lên, đẩy khí xả ra ngoài.",
    narrationEn:
      "Stroke 1 (Intake): piston descends, draws in air-fuel mixture. Stroke 2 (Compression): piston ascends, compresses mixture. Stroke 3 (Power): spark plug ignites, burning mixture expands. Stroke 4 (Exhaust): piston ascends, expels exhaust gases.",
  },
];

export function TourOverlay({ onClose }: { onClose: () => void }) {
  const language = useEngineStore((s) => s.language);
  const step = TOUR[0];

  return (
    <div className="pointer-events-auto absolute bottom-24 left-1/2 z-30 w-full max-w-md -translate-x-1/2">
      <div className="rounded-2xl border border-amber-500/20 bg-stone-950/95 p-5 text-stone-200 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <h3 className="font-serif text-lg font-bold text-amber-200">
          {language === "vi" ? step.title : step.titleEn}
        </h3>
        <p className="mt-2 text-[0.75rem] leading-relaxed text-stone-400">
          {language === "vi" ? step.narration : step.narrationEn}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[0.55rem] text-stone-500">
            {language === "vi" ? "Hướng dẫn tham quan" : "Guided Tour"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-amber-500/20 px-4 py-1 text-[0.6rem] font-medium text-amber-300 hover:bg-amber-500/30"
          >
            {language === "vi" ? "Đóng" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
