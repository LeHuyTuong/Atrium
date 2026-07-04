"use client";

import { PARTS, PART_MAP } from "../parts-data";
import { useEngineStore } from "../useEngineStore";

export function InfoPanel() {
  const language = useEngineStore((s) => s.language);
  const selectedPart = useEngineStore((s) => s.selectedPart);
  const setSelectedPart = useEngineStore((s) => s.setSelectedPart);
  const setHighlightPart = useEngineStore((s) => s.setHighlightPart);

  const selected = selectedPart ? PART_MAP[selectedPart] : null;

  const categoryLabels: Record<string, [string, string]> = {
    block: ["Thân máy", "Engine Block"],
    rotating: ["Chuyển động quay", "Rotating"],
    valvetrain: ["Phân phối khí", "Valvetrain"],
    fuel: ["Nhiên liệu", "Fuel & Ignition"],
  };

  return (
    <div className="pointer-events-auto flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-stone-950/90 p-4 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40 max-h-[60vh] overflow-y-auto">
      <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-amber-400/70">
        {language === "vi" ? "Phụ tùng" : "Parts"}
      </h2>

      {selected ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-200">
              {language === "vi" ? selected.name : selected.nameEn}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedPart(null)}
              className="text-[0.6rem] text-stone-500 hover:text-stone-300"
            >
              ✕
            </button>
          </div>
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[0.5rem] uppercase tracking-wider"
            style={{
              backgroundColor: `${selected.accent}20`,
              color: selected.accent,
            }}
          >
            {(categoryLabels[selected.category] || ["", ""])[language === "vi" ? 0 : 1]}
          </span>
          <p className="text-[0.65rem] leading-relaxed text-stone-400">
            {language === "vi" ? selected.description : selected.descriptionEn}
          </p>
          <button
            type="button"
            onClick={() => setSelectedPart(null)}
            className="text-[0.6rem] text-amber-500/60 hover:text-amber-400"
          >
            ← {language === "vi" ? "Trở về danh sách" : "Back to list"}
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onPointerEnter={() => setHighlightPart(p.id)}
              onPointerLeave={() => setHighlightPart(null)}
              onClick={() => setSelectedPart(p.id)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[0.65rem] transition hover:bg-stone-800/80"
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: p.accent }}
              />
              <span className="flex-1 text-stone-300">
                {language === "vi" ? p.name : p.nameEn}
              </span>
              <span className="text-[0.45rem] text-stone-500 uppercase">
                {(categoryLabels[p.category] || ["", ""])[language === "vi" ? 0 : 1]}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="border-t border-stone-800/60 pt-2 text-[0.55rem] text-stone-600">
        {language === "vi"
          ? "💡 Kéo chuột để xoay, lăn để zoom. Bấm vào phụ tùng trên mô hình 3D để xem chi tiết."
          : "💡 Drag to rotate, scroll to zoom. Click a part on the 3D model for details."}
      </p>
    </div>
  );
}
