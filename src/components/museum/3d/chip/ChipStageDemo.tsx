"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Tag, Sparkles } from "lucide-react";
import { ChipScene } from "./ChipScene";
import { CHIP_PARTS, type ChipPartId } from "@/lib/chip-types";

/**
 * Wrapper demo cho ChipScene — quản lý state (play/pause, speed, annotations,
 * part selection) và render control panel. Dùng cho Phase 3 hero exhibit
 * "Vi xử lý Intel 4004".
 */
export function ChipStageDemo({ height = 320 }: { height?: number }) {
  // Pause when reduced motion — lazy init to avoid setState-in-effect
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [playing, setPlaying] = useState(!reducedMotion);
  const [speed, setSpeed] = useState(1);
  const [selectedPart, setSelectedPart] = useState<ChipPartId | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [autoRotate, setAutoRotate] = useState(!reducedMotion);
  const [resetSignal, setResetSignal] = useState(0);

  const selectedPartData = CHIP_PARTS.find((p) => p.id === selectedPart);

  return (
    <div className="relative">
      <ChipScene
        playing={playing}
        speed={speed}
        selectedPart={selectedPart}
        onPartClick={(id) => setSelectedPart(id === selectedPart ? null : id)}
        showAnnotations={showAnnotations}
        parts={CHIP_PARTS}
        autoRotate={autoRotate}
        resetSignal={resetSignal}
        height={height}
      />

      {/* Control bar overlay */}
      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setPlaying((p) => !p)}
          title={playing ? "Tạm dừng" : "Chạy"}
          className="grid h-7 w-7 place-items-center rounded-full border border-foreground/20 bg-background/70 text-foreground/80 backdrop-blur-sm transition hover:border-foreground/40 hover:text-foreground"
        >
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>
        <button
          onClick={() => setResetSignal((s) => s + 1)}
          title="Đặt lại góc nhìn"
          className="grid h-7 w-7 place-items-center rounded-full border border-foreground/20 bg-background/70 text-foreground/80 backdrop-blur-sm transition hover:border-foreground/40 hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
        <button
          onClick={() => setShowAnnotations((s) => !s)}
          title={showAnnotations ? "Ẩn nhãn" : "Hiện nhãn"}
          className="inline-flex h-7 items-center gap-1 rounded-full border border-foreground/20 bg-background/70 px-2 text-[0.65rem] text-foreground/80 backdrop-blur-sm transition hover:border-foreground/40 hover:text-foreground"
          style={{
            borderColor: showAnnotations ? "#4ade8088" : "oklch(0.5 0.02 60 / 0.22)",
            color: showAnnotations ? "#4ade80" : "oklch(0.5 0.02 60 / 0.8)",
          }}
        >
          <Tag className="h-3 w-3" /> Nhãn
        </button>
        <button
          onClick={() => setAutoRotate((s) => !s)}
          title={autoRotate ? "Tự xoay" : "Cố định"}
          className="inline-flex h-7 items-center gap-1 rounded-full border border-foreground/20 bg-background/70 px-2 text-[0.65rem] text-foreground/80 backdrop-blur-sm transition hover:border-foreground/40 hover:text-foreground"
          style={{
            borderColor: autoRotate ? "#4ade8088" : "oklch(0.5 0.02 60 / 0.22)",
            color: autoRotate ? "#4ade80" : "oklch(0.5 0.02 60 / 0.8)",
          }}
        >
          <Sparkles className="h-3 w-3" /> Xoay
        </button>
      </div>

      {/* Speed slider */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-foreground/20 bg-background/70 px-2.5 py-1 backdrop-blur-sm">
        <span className="text-[0.6rem] uppercase tracking-[0.12em] text-foreground/55">Tốc độ</span>
        <input
          type="range"
          min={0.2}
          max={2}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="h-1 w-16 cursor-pointer accent-emerald-500"
        />
        <span className="font-mono text-[0.6rem] text-foreground/70">{speed.toFixed(1)}×</span>
      </div>

      {/* Selected part info panel */}
      {selectedPartData && (
        <div className="absolute bottom-3 left-3 right-3 z-10 rounded-lg border border-emerald-400/30 bg-background/85 p-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[0.7rem] font-semibold text-emerald-300">{selectedPartData.label}</span>
            <button
              onClick={() => setSelectedPart(null)}
              className="ml-auto text-[0.6rem] text-foreground/50 hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-[0.7rem] leading-relaxed text-foreground/75">
            {selectedPartData.description}
          </p>
        </div>
      )}
    </div>
  );
}
