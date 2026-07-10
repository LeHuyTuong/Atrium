"use client";

import { useEffect, useRef } from "react";
import { useEngineStore } from "./useEngineStore";

/** Monitors FPS and automatically downgrades graphics quality when FPS is
 *  consistently below 30 for ~5 seconds. Only active when `autoQuality` is on.
 *  Upgrades back to high when FPS is consistently above 50 for ~10 seconds. */
export function AutoQualityMonitor() {
  const autoQuality = useEngineStore((s) => s.autoQuality);
  const lowFpsAccum = useRef(0);
  const highFpsAccum = useRef(0);
  const lastTime = useRef(performance.now());
  const frames = useRef(0);
  const accumMs = useRef(0);

  useEffect(() => {
    if (!autoQuality) return;
    let raf = 0;
    lastTime.current = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = now - lastTime.current;
      lastTime.current = now;
      frames.current++;
      accumMs.current += dt;
      // Sample every 500ms
      if (accumMs.current < 500) return;
      const fps = (frames.current * 1000) / accumMs.current;
      frames.current = 0;
      accumMs.current = 0;

      const s = useEngineStore.getState();
      if (!s.autoQuality) return;

      if (fps < 30 && s.quality === "high") {
        lowFpsAccum.current += 0.5;
        highFpsAccum.current = 0;
        if (lowFpsAccum.current >= 5) {
          s.setQuality("low");
          lowFpsAccum.current = 0;
        }
      } else if (fps > 50 && s.quality === "low") {
        highFpsAccum.current += 0.5;
        lowFpsAccum.current = 0;
        if (highFpsAccum.current >= 10) {
          s.setQuality("high");
          highFpsAccum.current = 0;
        }
      } else {
        // Reset accumulators when in the target band
        lowFpsAccum.current = 0;
        highFpsAccum.current = 0;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [autoQuality]);

  return null;
}
