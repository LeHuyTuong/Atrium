"use client";

import { Html } from "@react-three/drei";
import { palette } from "./palette";
import type { NeuralPart, NeuralPartId } from "@/lib/neural-types";

type Props = {
  parts: NeuralPart[];
  selected: NeuralPartId | null;
  onSelect: (id: NeuralPartId) => void;
};

/**
 * Các nhãn HTML 3D — trỏ tới từng bộ phận của mạng nơ-ron.
 * Dùng <Html> của drei để render HTML cố định trong không gian 3D.
 * Pill-shape, click-to-select, highlight selected — pink accent (Phase 4).
 */
export function Annotations({ parts, selected, onSelect }: Props) {
  return (
    <group>
      {parts.map((p) => {
        const isSel = selected === p.id;
        return (
          <Html
            key={p.id}
            position={p.position}
            center
            distanceFactor={7}
            occlude={false}
            zIndexRange={[20, 0]}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(p.id);
              }}
              className="group flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-medium backdrop-blur-sm transition-all"
              style={{
                background: isSel ? `${palette.annotation}22` : "rgba(10, 5, 16, 0.78)",
                borderColor: isSel ? palette.annotation : `${palette.annotationDim}88`,
                color: isSel ? palette.annotation : "#f0c4f5",
                boxShadow: isSel ? `0 0 14px ${palette.annotation}66` : "none",
                cursor: "pointer",
                transform: "translateY(-50%)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: isSel ? palette.annotation : palette.annotationDim,
                  boxShadow: isSel ? `0 0 6px ${palette.annotation}` : "none",
                }}
              />
              {p.label}
            </button>
          </Html>
        );
      })}
    </group>
  );
}
