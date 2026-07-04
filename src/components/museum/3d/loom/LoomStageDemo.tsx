"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Tag, Sparkles, X } from "lucide-react";
import { LoomScene } from "./LoomScene";
import { LOOM_PARTS, type LoomPartId } from "@/lib/loom-types";

/**
 * Wrapper demo cho LoomScene — quản lý state (play/pause, speed, annotations,
 * part selection) và render control panel. Dùng làm mẫu cho cách tích hợp
 * scene 3D chi tiết vào ExhibitModal.
 */
export function LoomStageDemo({ height = 320 }: { height?: number }) {
  // Pause when reduced motion — lazy init to avoid setState-in-effect
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [playing, setPlaying] = useState(!reducedMotion);
  const [speed, setSpeed] = useState(1);
  const [selectedPart, setSelectedPart] = useState<LoomPartId | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [autoRotate, setAutoRotate] = useState(!reducedMotion);
  const [resetSignal, setResetSignal] = useState(0);

  const selectedPartData = LOOM_PARTS.find((p) => p.id === selectedPart);

  return (
    <div className="relative">
      <LoomScene
        playing={playing}
        speed={speed}
        selectedPart={selectedPart}
        onPartClick={(id) => setSelectedPart(id === selectedPart ? null : id)}
        showAnnotations={showAnnotations}
        parts={LOOM_PARTS}
        autoRotate={autoRotate}
        resetSignal={resetSignal}
        height={height}
      />

      {/* Control bar overlay */}
      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setPlaying((p) => !p)}
          title={playing ? "Tạm dừng" : "Chạy"}
          className="grid h-8 w-8 place-items-center rounded-full border bg-black/60 text-white/90 backdrop-blur-sm transition hover:bg-black/80 hover:text-white"
          style={{ borderColor: "rgba(232, 181, 58, 0.5)" }}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => setResetSignal((s) => s + 1)}
          title="Đặt lại góc nhìn"
          className="grid h-8 w-8 place-items-center rounded-full border bg-black/60 text-white/90 backdrop-blur-sm transition hover:bg-black/80 hover:text-white"
          style={{ borderColor: "rgba(232, 181, 58, 0.5)" }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setShowAnnotations((s) => !s)}
          title={showAnnotations ? "Ẩn nhãn" : "Hiện nhãn"}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-black/60 px-3 text-[0.7rem] font-medium backdrop-blur-sm transition hover:bg-black/80"
          style={{
            borderColor: showAnnotations ? "#e8b53a" : "rgba(232, 181, 58, 0.4)",
            color: showAnnotations ? "#e8b53a" : "rgba(232, 181, 58, 0.8)",
          }}
        >
          <Tag className="h-3.5 w-3.5" /> Nhãn
        </button>
        <button
          onClick={() => setAutoRotate((s) => !s)}
          title={autoRotate ? "Tự xoay" : "Cố định"}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-black/60 px-3 text-[0.7rem] font-medium backdrop-blur-sm transition hover:bg-black/80"
          style={{
            borderColor: autoRotate ? "#e8b53a" : "rgba(232, 181, 58, 0.4)",
            color: autoRotate ? "#e8b53a" : "rgba(232, 181, 58, 0.8)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" /> Xoay
        </button>
      </div>

      {/* Speed slider */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border bg-black/60 px-3 py-1.5 backdrop-blur-sm"
        style={{ borderColor: "rgba(232, 181, 58, 0.4)" }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.12em] text-white/75">Tốc độ</span>
        <input
          type="range"
          min={0.2}
          max={2}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="h-1 w-16 cursor-pointer accent-amber-500"
        />
        <span className="font-mono text-[0.6rem] text-foreground/70">{speed.toFixed(1)}×</span>
      </div>

      {/* Selected part info panel */}
      {selectedPartData && (
        <div className="absolute bottom-3 left-3 right-3 z-10 rounded-lg border bg-black/85 p-3 backdrop-blur-md"
          style={{ borderColor: "rgba(232, 181, 58, 0.4)" }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: "#e8b53a" }} />
            <span className="text-[0.75rem] font-semibold" style={{ color: "#e8b53a" }}>{selectedPartData.label}</span>
            <button
              onClick={() => setSelectedPart(null)}
              className="ml-auto rounded-full p-0.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="mt-1.5 text-[0.7rem] leading-relaxed text-white/80">
            {selectedPartData.description}
          </p>
        </div>
      )}
    </div>
  );
}
