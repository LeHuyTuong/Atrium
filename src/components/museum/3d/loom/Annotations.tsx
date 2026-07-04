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
              className="group grid h-6 w-6 place-items-center rounded-full border-2 backdrop-blur-sm transition-all hover:scale-125"
              style={{
                background: isSel ? `${palette.annotation}44` : "rgba(28, 19, 11, 0.5)",
                borderColor: isSel ? palette.annotation : palette.annotation,
                boxShadow: isSel
                  ? `0 0 16px ${palette.annotation}88, 0 0 4px ${palette.annotation}44`
                  : `0 0 8px ${palette.annotation}44`,
                cursor: "pointer",
                transform: "translateY(-50%)",
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: isSel ? "#fff" : palette.annotation }}
              />
            </button>
          </Html>
        );
      })}
    </group>
  );
}
