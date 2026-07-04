"use client";

import { create } from "zustand";

export type ViewPreset = "hero" | "side" | "top" | "cutaway" | "crankshaft";
export type LabelMode = "off" | "compact" | "full";
export type Quality = "low" | "high";
export type Language = "vi" | "en";

export interface EngineStore {
  running: boolean;
  rpm: number;
  actualRpm: number;
  throttle: number;
  load: number;
  timingAdvance: number;
  elapsed: number;
  totalRevolutions: number;
  powerOutput: number;
  position: number;

  audioOn: boolean;
  audioVolume: number;
  showLabels: LabelMode;
  showFuelSpray: boolean;
  showSpark: boolean;
  crossSection: boolean;
  exploded: boolean;
  explodedAmount: number;
  highlightPart: string | null;
  selectedPart: string | null;
  viewPreset: ViewPreset;
  quality: Quality;
  language: Language;

  toggle: () => void;
  toggleAudio: () => void;
  setAudioVolume: (v: number) => void;
  setRpm: (v: number) => void;
  setThrottle: (v: number) => void;
  setLoad: (v: number) => void;
  setTimingAdvance: (v: number) => void;
  setShowLabels: (m: LabelMode) => void;
  toggleFuelSpray: () => void;
  toggleSpark: () => void;
  toggleCrossSection: () => void;
  toggleExploded: () => void;
  setHighlightPart: (p: string | null) => void;
  setSelectedPart: (p: string | null) => void;
  setViewPreset: (v: ViewPreset) => void;
  setQuality: (q: Quality) => void;
  setLanguage: (l: Language) => void;
  toggleLanguage: () => void;
  tick: (dt: number) => void;
  reset: () => void;
}

const initialState = {
  running: true,
  audioOn: false,
  audioVolume: 0.6,
  rpm: 800,
  actualRpm: 0,
  throttle: 0.7,
  load: 0.3,
  timingAdvance: 10,
  elapsed: 0,
  totalRevolutions: 0,
  powerOutput: 0,
  position: 0,

  showLabels: "compact" as LabelMode,
  showFuelSpray: true,
  showSpark: true,
  crossSection: false,
  exploded: false,
  explodedAmount: 0,
  highlightPart: null as string | null,
  selectedPart: null as string | null,
  viewPreset: "hero" as ViewPreset,
  quality: "high" as Quality,
  language: "en" as Language,
};

export const useEngineStore = create<EngineStore>((set, get) => ({
  ...initialState,

  toggle: () => set((s) => ({ running: !s.running })),

  toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),

  setAudioVolume: (v) => set({ audioVolume: Math.max(0, Math.min(1, v)) }),

  setRpm: (v) => set({ rpm: Math.max(0, Math.min(8000, v)) }),

  setThrottle: (v) => set({ throttle: Math.max(0, Math.min(1, v)) }),

  setLoad: (v) => set({ load: Math.max(0, Math.min(1, v)) }),

  setTimingAdvance: (v) =>
    set({ timingAdvance: Math.max(0, Math.min(30, v)) }),

  setShowLabels: (m) => set({ showLabels: m }),

  toggleFuelSpray: () => set((s) => ({ showFuelSpray: !s.showFuelSpray })),

  toggleSpark: () => set((s) => ({ showSpark: !s.showSpark })),

  toggleCrossSection: () => set((s) => ({ crossSection: !s.crossSection })),

  toggleExploded: () => set((s) => ({ exploded: !s.exploded })),

  setHighlightPart: (p) => set({ highlightPart: p }),

  setSelectedPart: (p) => set({ selectedPart: p }),

  setViewPreset: (v) => set({ viewPreset: v }),

  setQuality: (q) => set({ quality: q }),

  setLanguage: (l) => set({ language: l }),

  toggleLanguage: () =>
    set((s) => ({ language: s.language === "vi" ? "en" : "vi" })),

  tick: (dt) => {
    const s = get();

    const explodeTarget = s.exploded ? 1 : 0;
    const explodeNext =
      s.explodedAmount + (explodeTarget - s.explodedAmount) * Math.min(1, 4 * dt);

    if (!s.running) {
      const nextRpm = Math.max(0, s.actualRpm - s.actualRpm * 0.6 * dt);
      set({
        actualRpm: nextRpm,
        explodedAmount: explodeNext,
      });
      return;
    }

    const loadFactor = 1 - s.load * 0.35;
    const throttleFactor = 0.15 + 0.85 * s.throttle;
    const effectiveTarget = s.rpm * throttleFactor * loadFactor;
    const k = 2.0;
    const nextRpm =
      s.actualRpm + (effectiveTarget - s.actualRpm) * Math.min(1, k * dt);
    const omega = (nextRpm / 60) * Math.PI * 2;

    set({
      actualRpm: nextRpm,
      elapsed: s.elapsed + dt,
      totalRevolutions: s.totalRevolutions + (omega * dt) / (Math.PI * 2),
      powerOutput: nextRpm * s.throttle * 0.008 * (1 - s.load * 0.2),
      explodedAmount: explodeNext,
      position: s.position + (omega * dt) / (Math.PI * 2),
    });
  },

  reset: () => {
    set({ ...initialState, running: get().running, actualRpm: 0, elapsed: 0, totalRevolutions: 0 });
  },
}));
