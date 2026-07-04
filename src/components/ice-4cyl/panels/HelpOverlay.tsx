"use client";

const SHORTCUTS = [
  { key: "Space", label: "Chạy / Dừng", labelEn: "Play / Pause" },
  { key: "R", label: "Đặt lại", labelEn: "Reset" },
  { key: "1–5", label: "Góc nhìn", labelEn: "View angle" },
  { key: "E", label: "Sơ đồ nổ", labelEn: "Exploded view" },
  { key: "C", label: "Cắt ngang", labelEn: "Cross-section" },
  { key: "L", label: "Nhãn (Tắt/Tên/Đầy đủ)", labelEn: "Labels (Off/Names/Full)" },
  { key: "B", label: "Đổi ngôn ngữ", labelEn: "Switch language" },
  { key: "Esc", label: "Đóng / Bỏ chọn", labelEn: "Close / Deselect" },
];

export function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-amber-500/20 bg-stone-950/95 p-5 text-stone-200 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-amber-200">
            ⌨️ Phím tắt
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[0.6rem] text-stone-500 hover:text-stone-300"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 space-y-1.5">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between text-[0.65rem]">
              <kbd className="rounded-md bg-stone-800 px-1.5 py-0.5 font-mono text-amber-300/80">
                {s.key}
              </kbd>
              <span className="text-stone-400">{s.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[0.55rem] text-stone-600">
          Phím tắt bị vô hiệu khi đang gõ trong ô nhập liệu. Nhấn Esc để đóng.
        </p>
      </div>
    </div>
  );
}
