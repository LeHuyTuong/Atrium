"use client";

import { useEffect, useRef, useState } from "react";
import { useEngineStore } from "../useEngineStore";
import { t } from "../i18n";
import { Volume2, VolumeX, Volume1 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Transient on-screen volume indicator. Appears for ~1.5s whenever the
 *  audio volume changes (via Shift+↑/↓ or the slider), showing a speaker
 *  icon + volume bar. Auto-fades out. Only shows when audio is on. */
export function VolumeIndicator() {
  const audioVolume = useEngineStore((s) => s.audioVolume);
  const audioOn = useEngineStore((s) => s.audioOn);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevVolume = useRef(audioVolume);

  // Show the indicator whenever the volume changes
  useEffect(() => {
    if (Math.abs(audioVolume - prevVolume.current) < 0.001) return;
    prevVolume.current = audioVolume;
    if (!audioOn) return;
    // Defer the state update to avoid synchronous setState in effect
    const showTimer = setTimeout(() => setVisible(true), 0);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 1500);
    return () => {
      clearTimeout(showTimer);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [audioVolume, audioOn]);

  if (!visible || !audioOn) return null;

  const icon =
    audioVolume === 0 ? (
      <VolumeX className="h-5 w-5" />
    ) : audioVolume < 0.5 ? (
      <Volume1 className="h-5 w-5" />
    ) : (
      <Volume2 className="h-5 w-5" />
    );

  return (
    <div className="pointer-events-none absolute left-1/2 top-20 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-stone-950/85 px-4 py-2.5 backdrop-blur-md shadow-2xl shadow-black/40">
        <span className="text-amber-300">{icon}</span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              {tr("audioVolume")}
            </span>
            <span className="font-mono text-xs font-bold text-amber-300">
              {Math.round(audioVolume * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-[width] duration-100"
              style={{ width: `${audioVolume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
