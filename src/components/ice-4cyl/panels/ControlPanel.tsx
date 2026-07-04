"use client";

import { useEngineStore } from "../useEngineStore";

export function ControlPanel() {
  const store = useEngineStore();

  return (
    <div className="pointer-events-auto flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-stone-950/90 p-4 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40">
      <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-amber-400/70">
        {useEngineStore.getState().language === "vi" ? "Bảng điều khiển" : "Control Panel"}
      </h2>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => store.toggle()}
          className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            store.running
              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
              : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
          }`}
        >
          {store.running ? "⏹ Dừng" : "▶ Chạy"}
        </button>
        <button
          type="button"
          onClick={() => store.reset()}
          className="rounded-full bg-stone-800/60 px-3 py-1.5 text-[0.65rem] text-stone-400 hover:text-stone-200"
        >
          {store.language === "vi" ? "Đặt lại" : "Reset"}
        </button>
      </div>

      <div className="space-y-2">
        <SliderRow
          label={store.language === "vi" ? "Tốc độ mục tiêu" : "Target RPM"}
          value={store.rpm}
          min={0}
          max={8000}
          step={100}
          onChange={(v) => store.setRpm(v)}
          unit="RPM"
        />
        <SliderRow
          label={store.language === "vi" ? "Van tiết lưu" : "Throttle"}
          value={store.throttle}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => store.setThrottle(v)}
          pct
        />
        <SliderRow
          label={store.language === "vi" ? "Tải ngoài" : "Load"}
          value={store.load}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => store.setLoad(v)}
          pct
        />
        <SliderRow
          label={store.language === "vi" ? "Đánh lửa sớm" : "Spark Advance"}
          value={store.timingAdvance}
          min={0}
          max={30}
          step={1}
          onChange={(v) => store.setTimingAdvance(v)}
          unit="°"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <ToggleBtn active={store.showLabels !== "off"} onClick={() => store.setShowLabels(store.showLabels === "off" ? "compact" : store.showLabels === "compact" ? "full" : "off")}>
          {store.language === "vi" ? "Nhãn" : "Labels"}
        </ToggleBtn>
        <ToggleBtn active={store.crossSection} onClick={() => store.toggleCrossSection()}>
          {store.language === "vi" ? "Cắt ngang" : "Cutaway"}
        </ToggleBtn>
        <ToggleBtn active={store.exploded} onClick={() => store.toggleExploded()}>
          {store.language === "vi" ? "Sơ đồ nổ" : "Explode"}
        </ToggleBtn>
        <ToggleBtn active={store.showFuelSpray} onClick={() => store.toggleFuelSpray()}>
          {store.language === "vi" ? "Nhiên liệu" : "Fuel"}
        </ToggleBtn>
        <ToggleBtn active={store.showSpark} onClick={() => store.toggleSpark()}>
          ⚡
        </ToggleBtn>
      </div>

      <ViewButtons />
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
  pct,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
  pct?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[0.65rem] text-stone-400">
        <span>{label}</span>
        <span className="font-mono text-amber-300/80">
          {pct ? `${Math.round(value * 100)}%` : `${Math.round(value)}${unit || ""}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-stone-700 accent-amber-500"
      />
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-wider transition ${
        active
          ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40"
          : "bg-stone-800/60 text-stone-500 hover:text-stone-300"
      }`}
    >
      {children}
    </button>
  );
}

function ViewButtons() {
  const store = useEngineStore();
  const views = ["hero", "side", "top", "cutaway", "crankshaft"] as const;
  const labels: Record<string, string> = {
    hero: "T.cảnh",
    side: "Hông",
    top: "Trên",
    cutaway: "Cắt",
    crankshaft: "Khuỷu",
  };

  return (
    <div className="flex gap-1">
      {views.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => store.setViewPreset(v)}
          className={`flex-1 rounded-lg py-1 text-[0.55rem] font-medium uppercase tracking-wider transition ${
            store.viewPreset === v
              ? "bg-amber-500/20 text-amber-300"
              : "bg-stone-800/40 text-stone-500 hover:text-stone-300"
          }`}
        >
          {labels[v]}
        </button>
      ))}
    </div>
  );
}
