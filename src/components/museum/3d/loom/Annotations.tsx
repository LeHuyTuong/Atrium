"use client";

import { Html } from "@react-three/drei";
import { palette } from "./palette";
import type { LoomPart, LoomPartId } from "@/lib/loom-types";

type Props = {
  parts: LoomPart[];
  selected: LoomPartId | null;
  onSelect: (id: LoomPartId) => void;
};

/**
 * Các nhãn HTML 3D — trỏ tới từng bộ phận máy dệt.
 * Dùng <Html> của drei để render HTML cố định trong không gian 3D.
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
            distanceFactor={6}
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
                background: isSel ? `${palette.annotation}22` : "rgba(28, 19, 11, 0.75)",
                borderColor: isSel ? palette.annotation : `${palette.annotationDim}88`,
                color: isSel ? palette.annotation : "#e8d5a8",
                boxShadow: isSel ? `0 0 12px ${palette.annotation}66` : "none",
                cursor: "pointer",
                transform: "translateY(-50%)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: isSel ? palette.annotation : palette.annotationDim }}
              />
              {p.label}
            </button>
          </Html>
        );
      })}
    </group>
  );
}
