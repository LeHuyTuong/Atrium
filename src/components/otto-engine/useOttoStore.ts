"use client";

import { create } from "zustand";

export type OttoStrokeIndex = 0 | 1 | 2 | 3;
export const STROKE_NAMES_VI = ["Hút", "Nén", "Nổ", "Xả"];
export const STROKE_NAMES_EN = ["Intake", "Compression", "Power", "Exhaust"];
export const STROKE_COLORS = ["#4a9eff", "#a0a0a0", "#ff6a1a", "#7a7a7a"];

export interface OttoStore {
  // Simulation
  running: boolean;
  rpm: number;
  actualRpm: number;
  throttle: number;
  load: number;
  elapsed: number;
  totalRevolutions: number;

  // Visual
  showLabels: boolean;
  showFire: boolean;
  showExhaust: boolean;
  crossSection: boolean;
  exploded: boolean;
  explodedAmount: number;
  manualExplode: boolean;
  highlightPart: string | null;
  selectedPart: string | null;
  language: "vi" | "en";

  // Per-frame derived (from ottoClock)
  strokeIndex: OttoStrokeIndex;
  pistonPos: number;
  intakeOpen: number;
  exhaustOpen: number;
  combustionFlash: number;

  // Actions
  toggle: () => void;
  setRpm: (v: number) => void;
  setThrottle: (v: number) => void;
  setLoad: (v: number) => void;
  toggleFire: () => void;
  toggleExhaust: () => void;
  toggleCrossSection: () => void;
  toggleExploded: () => void;
  setExplodedAmount: (v: number) => void;
  setHighlightPart: (p: string | null) => void;
  setSelectedPart: (p: string | null) => void;
  toggleLanguage: () => void;
  tick: (dt: number) => void;
  reset: () => void;
}

const initialState = {
  running: true,
  rpm: 200,
  actualRpm: 0,
  throttle: 0.8,
  load: 0.3,
  elapsed: 0,
  totalRevolutions: 0,

  showLabels: true,
  showFire: true,
  showExhaust: true,
  crossSection: false,
  exploded: false,
  explodedAmount: 0,
  manualExplode: false,
  highlightPart: null as string | null,
  selectedPart: null as string | null,
  language: "vi" as "vi" | "en",

  strokeIndex: 0 as OttoStrokeIndex,
  pistonPos: 1,
  intakeOpen: 0,
  exhaustOpen: 0,
  combustionFlash: 0,
};

export const useOttoStore = create<OttoStore>((set, get) => ({
  ...initialState,

  toggle: () => set((s) => ({ running: !s.running })),
  setRpm: (v) => set({ rpm: Math.max(60, Math.min(800, v)) }),
  setThrottle: (v) => set({ throttle: Math.max(0, Math.min(1, v)) }),
  setLoad: (v) => set({ load: Math.max(0, Math.min(1, v)) }),
  toggleFire: () => set((s) => ({ showFire: !s.showFire })),
  toggleExhaust: () => set((s) => ({ showExhaust: !s.showExhaust })),
  toggleCrossSection: () => set((s) => ({ crossSection: !s.crossSection })),
  toggleExploded: () => set((s) => ({ exploded: !s.exploded, manualExplode: false })),
  setExplodedAmount: (v) => set({ explodedAmount: Math.max(0, Math.min(1, v)), manualExplode: true }),
  setHighlightPart: (p) => set({ highlightPart: p }),
  setSelectedPart: (p) => set({ selectedPart: p }),
  toggleLanguage: () => set((s) => ({ language: s.language === "vi" ? "en" : "vi" })),

  tick: (dt) => {
    const s = get();
    if (!s.running) {
      set({
        actualRpm: Math.max(0, s.actualRpm - s.actualRpm * 0.4 * dt),
      });
      return;
    }

    // Smooth RPM
    const pressureFactor = 0.4 + s.throttle * 0.6;
    const loadFactor = 1 - s.load * 0.4;
    const targetRpm = s.rpm * pressureFactor * loadFactor;
    const nextRpm = s.actualRpm + (targetRpm - s.actualRpm) * Math.min(1, 1.5 * dt);

    // Explode animation
    const explodeTarget = s.exploded ? 1 : 0;
    const explodeNext = s.manualExplode
      ? s.explodedAmount
      : s.explodedAmount + (explodeTarget - s.explodedAmount) * Math.min(1, 4 * dt);

    const omega = (nextRpm / 60) * Math.PI * 2;
    set({
      actualRpm: nextRpm,
      elapsed: s.elapsed + dt,
      totalRevolutions: s.totalRevolutions + (omega * dt) / (Math.PI * 2),
      explodedAmount: explodeNext,
    });
  },

  reset: () => set({ ...initialState }),
}));
