import { create } from "zustand";
import { DynamoPartId } from "./dynamo-parts-data";

interface DynamoState {
  explodedAmount: number;
  setExplodedAmount: (v: number) => void;
  manualExplode: boolean;
  setManualExplode: (v: boolean) => void;
  highlightPart: DynamoPartId | null;
  setHighlightPart: (id: DynamoPartId | null) => void;
  rotationSpeed: number;
  setRotationSpeed: (v: number) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

export const useDynamoStore = create<DynamoState>((set) => ({
  explodedAmount: 0,
  setExplodedAmount: (v) => set({ explodedAmount: v, manualExplode: true }),
  manualExplode: false,
  setManualExplode: (v) => set({ manualExplode: v }),
  highlightPart: null,
  setHighlightPart: (id) => set({ highlightPart: id }),
  rotationSpeed: 5,
  setRotationSpeed: (v) => set({ rotationSpeed: v }),
  isGenerating: true,
  setIsGenerating: (v) => set({ isGenerating: v }),
}));
