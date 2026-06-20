"use client";

import { Html } from "@react-three/drei";
import { palette } from "./palette";
import type { BulbPart, BulbPartId } from "@/lib/bulb-types";

type Props = {
  parts: BulbPart[];
  selected: BulbPartId | null;
  onSelect: (id: BulbPartId) => void;
};

/**
 * Các nhãn HTML 3D — trỏ tới từng bộ phận bóng đèn.
 * Dùng <Html> của drei để render HTML cố định trong không gian 3D.
 * Tông vàng Phase 2 (#e8b53a) — pill bo tròn, click để chọn.
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
                background: isSel ? `${palette.annotation}22` : "rgba(26, 20, 8, 0.78)",
                borderColor: isSel ? palette.annotation : `${palette.annotationDim}88`,
                color: isSel ? palette.annotation : "#f5e8c0",
                boxShadow: isSel ? `0 0 14px ${palette.annotation}88` : "none",
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
