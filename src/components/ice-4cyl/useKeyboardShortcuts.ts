"use client";

import { useEffect } from "react";
import { useEngineStore } from "./useEngineStore";

const VIEW_PRESETS = ["hero", "side", "top", "cutaway", "crankshaft"] as const;
const LABEL_CYCLE = ["off", "compact", "full"] as const;

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) {
        return;
      }

      const s = useEngineStore.getState();
      const key = e.key;

      if (key === " ") {
        e.preventDefault();
        s.toggle();
      } else if (key === "r" || key === "R") {
        s.reset();
      } else if (key >= "1" && key <= "5") {
        const idx = parseInt(key, 10) - 1;
        s.setViewPreset(VIEW_PRESETS[idx]);
      } else if (key === "e" || key === "E") {
        s.toggleExploded();
      } else if (key === "c" || key === "C") {
        s.toggleCrossSection();
      } else if (key === "l" || key === "L") {
        const cur = s.showLabels;
        const next = LABEL_CYCLE[(LABEL_CYCLE.indexOf(cur) + 1) % LABEL_CYCLE.length];
        s.setShowLabels(next);
      } else if (key === "b" || key === "B") {
        s.toggleLanguage();
      } else if (key === "Escape") {
        if (s.selectedPart) s.setSelectedPart(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
