"use client";

import { useRef, useState, useEffect } from "react";
import { useEngineStore } from "../useEngineStore";
import { cn } from "@/lib/utils";

const HISTORY_LEN = 40; // ~10s of history at 4Hz sampling

/** A lightweight FPS counter overlay with a sparkline history graph.
 *  Measures frame intervals via requestAnimationFrame and displays the rolling
 *  average FPS + frame time + a 40-sample sparkline.
 *  Toggled by the store's showFps flag (F key).
 *  Color-coded: green ≥50fps, amber 30–50, red <30. */
export function FpsCounter() {
  const show = useEngineStore((s) => s.showFps);
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.7);
  const [history, setHistory] = useState<number[]>([]);
  const frames = useRef(0);
  const accumMs = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef(0);
  const histRef = useRef<number[]>([]);

  useEffect(() => {
    if (!show) return;
    lastTime.current = performance.now();
    frames.current = 0;
    accumMs.current = 0;

    const loop = (now: number) => {
      const dt = now - lastTime.current;
      lastTime.current = now;
      frames.current++;
      accumMs.current += dt;
      if (accumMs.current >= 250) {
        const avgFps = (frames.current * 1000) / accumMs.current;
        const avgFt = accumMs.current / frames.current;
        const roundedFps = Math.round(avgFps);
        setFps(roundedFps);
        setFrameTime(Math.round(avgFt * 10) / 10);
        // Update history
        const next = [...histRef.current, roundedFps];
        if (next.length > HISTORY_LEN) next.shift();
        histRef.current = next;
        setHistory(next);
        frames.current = 0;
        accumMs.current = 0;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [show]);

  if (!show) return null;

  const color = fps >= 50 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-rose-400";
  const dotColor = fps >= 50 ? "bg-emerald-400" : fps >= 30 ? "bg-amber-400" : "bg-rose-400";
  const strokeColor = fps >= 50 ? "#34d399" : fps >= 30 ? "#fbbf24" : "#f43f5e";

  // Build sparkline path
  const sparkPath = buildSparkPath(history, 60, 16);

  return (
    <div className="pointer-events-none absolute left-1/2 top-12 z-40 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-xl border border-amber-500/25 bg-stone-950/85 px-3 py-1.5 backdrop-blur-md">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
        <span className={cn("font-mono text-xs font-bold", color)}>{fps}</span>
        <span className="text-[10px] text-stone-400">FPS</span>
        <span className="text-stone-600">·</span>
        <span className="font-mono text-[10px] text-stone-400">{frameTime}ms</span>
        {/* Sparkline */}
        {history.length > 1 && (
          <svg width={60} height={16} className="ml-1">
            <path d={sparkPath} fill="none" stroke={strokeColor} strokeWidth={1} strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

/** Build an SVG sparkline path from an array of FPS values. */
function buildSparkPath(values: number[], width: number, height: number): string {
  if (values.length < 2) return "";
  const max = 80; // cap at 80 fps for the scale
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - Math.min(1, v / max) * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}
