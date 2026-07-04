"use client";

import { Html, Line } from "@react-three/drei";
import { PARTS } from "../parts-data";
import { useEngineStore, LabelMode } from "../useEngineStore";

/** Floating HTML labels for each named part. Visibility & verbosity follow
 *  the store's showLabels mode. Clicking a label selects the part.
 *  When exploded view is active, a thin connector line is drawn from the
 *  label to the part's anchor point for clarity. */
export function PartLabels({ mode }: { mode: LabelMode }) {
  const setSelectedPart = useEngineStore((s) => s.setSelectedPart);
  const setHighlightPart = useEngineStore((s) => s.setHighlightPart);
  const highlightPart = useEngineStore((s) => s.highlightPart);
  const selectedPart = useEngineStore((s) => s.selectedPart);
  const language = useEngineStore((s) => s.language);
  const explodedAmount = useEngineStore((s) => s.explodedAmount);

  if (mode === "off") return null;

  return (
    <>
      {PARTS.map((p) => {
        const active = highlightPart === p.id || selectedPart === p.id;
        // Label offset: when exploded, push the label further out from the part
        const offset: [number, number, number] = explodedAmount > 0.1
          ? [p.labelPos[0] + (p.labelPos[0] > 0 ? 0.8 : p.labelPos[0] < 0 ? -0.8 : 0),
             p.labelPos[1] + 0.5,
             p.labelPos[2] + 0.3]
          : p.labelPos;
        return (
          <group key={p.id}>
            {/* Connector line (only when exploded) */}
            {explodedAmount > 0.1 && (
              <Line
                points={[p.labelPos, offset]}
                color={active ? "#fbbf24" : "#7a6a52"}
                lineWidth={active ? 1.5 : 0.8}
                transparent
                opacity={0.5 + explodedAmount * 0.3}
                dashed={false}
              />
            )}
            <Html
              position={offset}
              center
              zIndexRange={[10, 0]}
              distanceFactor={11}
              occlude={false}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPart(p.id);
                }}
                onPointerEnter={() => setHighlightPart(p.id)}
                onPointerLeave={() => setHighlightPart(null)}
                className={`group flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium shadow-md transition-all duration-150 ${
                  active
                    ? "scale-110 border-amber-400 bg-amber-400/95 text-stone-900"
                    : "border-stone-300/40 bg-stone-900/85 text-amber-50 backdrop-blur-sm hover:border-amber-300/70 hover:bg-stone-800/90"
                }`}
                style={{ pointerEvents: "auto" }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: p.accent }}
                />
                <span>{language === "en" ? p.nameEn : p.name}</span>
                {mode === "full" && (
                  <span className="hidden font-normal text-amber-200/70 sm:inline">
                    · {language === "en" ? p.shortEn : p.short}
                  </span>
                )}
              </button>
            </Html>
          </group>
        );
      })}
    </>
  );
}
