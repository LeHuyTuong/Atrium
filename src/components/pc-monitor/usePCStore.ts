import { create } from "zustand";
import { PCPartId } from "./pc-parts-data";

interface PCState {
  explodedAmount: number;
  setExplodedAmount: (v: number) => void;
  highlightPart: PCPartId | null;
  setHighlightPart: (id: PCPartId | null) => void;
}

export const usePCStore = create<PCState>((set) => ({
  explodedAmount: 0,
  setExplodedAmount: (v) => set({ explodedAmount: v }),
  highlightPart: null,
  setHighlightPart: (id) => set({ highlightPart: id }),
}));
