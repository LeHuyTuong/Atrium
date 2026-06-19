"use client";

import { useRef, type FC, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";

/**
 * Scene Lab — Exploded view of the Watt steam engine.
 *
 * Mỗi bộ phận là một nhóm mesh riêng, có thể offset dọc theo "trục tháo rời"
 * dựa trên prop `explode` (0 = lắp ráp, 1 = tháo rời hoàn toàn).
 *
 * Tông kim loại: vàng/đồng — đồng bộ với ArtifactModels SteamEngine gốc.
 */

const ACCENT = "#e89446";

export type SteamPartId =
  | "boiler"
  | "endcap-left"
  | "endcap-right"
  | "rivet-ring"
  | "piston-rod"
  | "piston-cylinder"
  | "flywheel"
  | "steam-puff";

export interface SteamPart {
  id: SteamPartId;
  label: string;
  desc: string;
}

/** Danh sách bộ phận để SceneLabModal render checklist. */
export const STEAM_PARTS: SteamPart[] = [
  { id: "boiler", label: "Lò hơi", desc: "Buồng đốt nước sôi sinh hơi áp suất cao." },
  { id: "endcap-left", label: "Nắp đầu (trái)", desc: "Nắp kín đầu bên trái của lò hơi." },
  { id: "endcap-right", label: "Nắp đầu (phải)", desc: "Nắp kín đầu bên phải của lò hơi." },
  { id: "rivet-ring", label: "Vòng đinh tán", desc: "Gia cố mối nối giữa lò hơi và nắp đầu." },
  { id: "piston-rod", label: "Thanh piston", desc: "Truyền lực từ piston đến trục khuỷu." },
  { id: "piston-cylinder", label: "Xi-lanh", desc: "Buồng chứa piston chuyển động tịnh tiến." },
  { id: "flywheel", label: "Bánh đà", desc: "Tích lũy đà quay, làm đều chuyển động cơ." },
  { id: "steam-puff", label: "Hơi nước", desc: "Hơi nước dư thoát ra khỏi lò hơi." },
];

interface ExplodedSteamEngineProps {
  /** 0 = lắp ráp, 1 = tháo rời hoàn toàn. */
  explode: number;
  /** Khi set, bộ phận tương ứng phát sáng, các bộ phận khác mờ đi. */
  highlightedPart?: SteamPartId | null;
}

interface PartRenderProps {
  dimmed: boolean;
  highlighted: boolean;
}

interface PartConfig {
  id: SteamPartId;
  /** Offset thêm vào vị trí gốc khi explode = 1. */
  offset: [number, number, number];
  label: string;
  /** Vị trí label Html trong local coords (tính từ tâm group, không nhân explode). */
  labelPosition: [number, number, number];
  Mesh: FC<PartRenderProps>;
}

/* ---------- Mesh components (giữ nguyên vị trí gốc của mô hình) ---------- */

function BoilerPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.7, 0.7, 1.8, 32]} />
      <meshStandardMaterial
        color="#7a5a2e"
        metalness={0.85}
        roughness={0.28}
        emissive={highlighted ? ACCENT : "#000000"}
        emissiveIntensity={highlighted ? 0.6 : 0}
        transparent={dimmed}
        opacity={dimmed ? 0.3 : 1}
      />
    </mesh>
  );
}

function EndCapLeftPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.72, 0.72, 0.08, 32]} />
      <meshStandardMaterial
        color="#9a7a3e"
        metalness={0.85}
        roughness={0.28}
        emissive={highlighted ? ACCENT : "#000000"}
        emissiveIntensity={highlighted ? 0.6 : 0}
        transparent={dimmed}
        opacity={dimmed ? 0.3 : 1}
      />
    </mesh>
  );
}

function EndCapRightPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.72, 0.72, 0.08, 32]} />
      <meshStandardMaterial
        color="#9a7a3e"
        metalness={0.85}
        roughness={0.28}
        emissive={highlighted ? ACCENT : "#000000"}
        emissiveIntensity={highlighted ? 0.6 : 0}
        transparent={dimmed}
        opacity={dimmed ? 0.3 : 1}
      />
    </mesh>
  );
}

function RivetRingPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <mesh position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.7, 0.04, 8, 32]} />
      <meshStandardMaterial
        color="#caa05a"
        metalness={0.85}
        roughness={0.28}
        emissive={highlighted ? ACCENT : "#000000"}
        emissiveIntensity={highlighted ? 0.7 : 0}
        transparent={dimmed}
        opacity={dimmed ? 0.3 : 1}
      />
    </mesh>
  );
}

function PistonRodPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <mesh position={[1.4, 0.3, 0]}>
      <boxGeometry args={[0.8, 0.18, 0.18]} />
      <meshStandardMaterial
        color="#d4b06a"
        metalness={0.85}
        roughness={0.28}
        emissive={highlighted ? ACCENT : "#000000"}
        emissiveIntensity={highlighted ? 0.6 : 0}
        transparent={dimmed}
        opacity={dimmed ? 0.3 : 1}
      />
    </mesh>
  );
}

function PistonCylinderPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <mesh position={[1.85, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.22, 0.22, 0.4, 24]} />
      <meshStandardMaterial
        color="#b89050"
        metalness={0.85}
        roughness={0.28}
        emissive={highlighted ? ACCENT : "#000000"}
        emissiveIntensity={highlighted ? 0.6 : 0}
        transparent={dimmed}
        opacity={dimmed ? 0.3 : 1}
      />
    </mesh>
  );
}

function FlywheelPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <group position={[1.85, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <torusGeometry args={[0.5, 0.08, 16, 48]} />
        <meshStandardMaterial
          color={ACCENT}
          metalness={0.85}
          roughness={0.28}
          emissive={ACCENT}
          emissiveIntensity={highlighted ? 1.1 : 0.3}
          transparent={dimmed}
          opacity={dimmed ? 0.3 : 1}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial
          color="#8a6a2e"
          metalness={0.85}
          roughness={0.28}
          emissive={highlighted ? ACCENT : "#000000"}
          emissiveIntensity={highlighted ? 0.5 : 0}
          transparent={dimmed}
          opacity={dimmed ? 0.3 : 1}
        />
      </mesh>
    </group>
  );
}

function SteamPuffPart({ dimmed, highlighted }: PartRenderProps) {
  return (
    <mesh position={[-1.2, 0.5, 0]}>
      <sphereGeometry args={[0.15, 12, 12]} />
      <meshStandardMaterial
        color="#dddddd"
        emissive={highlighted ? ACCENT : "#ffffff"}
        emissiveIntensity={highlighted ? 0.9 : 0.5}
        transparent
        opacity={dimmed ? 0.15 : 0.4}
      />
    </mesh>
  );
}

/* ---------- Part configs ---------- */

const PARTS: PartConfig[] = [
  { id: "boiler", offset: [0, 0, 0], label: "Lò hơi", labelPosition: [0, 0.85, 0], Mesh: BoilerPart },
  { id: "endcap-left", offset: [-1.5, 0, 0], label: "Nắp đầu", labelPosition: [-0.9, 0.7, 0], Mesh: EndCapLeftPart },
  { id: "endcap-right", offset: [1.0, 0, 0], label: "Nắp đầu", labelPosition: [0.9, 0.7, 0], Mesh: EndCapRightPart },
  { id: "rivet-ring", offset: [-0.7, 0, 0], label: "Vòng đinh tán", labelPosition: [-0.85, 0.5, 0], Mesh: RivetRingPart },
  { id: "piston-rod", offset: [1.5, 0, 0], label: "Thanh piston", labelPosition: [1.4, 0.7, 0], Mesh: PistonRodPart },
  { id: "piston-cylinder", offset: [2.5, 0, 0], label: "Xi-lanh", labelPosition: [1.85, 0.85, 0], Mesh: PistonCylinderPart },
  { id: "flywheel", offset: [3.5, 0, 0], label: "Bánh đà", labelPosition: [1.85, 1.15, 0], Mesh: FlywheelPart },
  { id: "steam-puff", offset: [0, 1.4, 0], label: "Hơi nước", labelPosition: [-1.2, 0.85, 0], Mesh: SteamPuffPart },
];

/* ---------- Part wrapper: position lerp + label ---------- */

function Part({
  config,
  explode,
  highlightedPart,
}: {
  config: PartConfig;
  explode: number;
  highlightedPart: SteamPartId | null;
}) {
  const ref = useRef<THREE.Group>(null);
  const reduced = usePrefersReducedMotion();
  const target = useRef(new THREE.Vector3());

  const highlighted = highlightedPart === config.id;
  const dimmed = highlightedPart !== null && !highlighted;
  const showLabel = explode > 0.3 && !dimmed;

  useFrame(() => {
    if (!ref.current) return;
    target.current.set(
      config.offset[0] * explode,
      config.offset[1] * explode,
      config.offset[2] * explode
    );
    if (reduced) {
      ref.current.position.copy(target.current);
    } else {
      ref.current.position.lerp(target.current, 0.16);
    }
  });

  const Mesh = config.Mesh;

  return (
    <group ref={ref}>
      <Mesh dimmed={dimmed} highlighted={highlighted} />
      {showLabel && (
        <Html
          center
          distanceFactor={8}
          occlude
          position={config.labelPosition}
          zIndexRange={[40, 0]}
          className="pointer-events-none select-none"
        >
          <div className="flex items-center gap-1.5 -translate-y-1/2 whitespace-nowrap rounded-full border border-amber-300/50 bg-black/85 px-2.5 py-1 text-[0.7rem] font-medium text-amber-100 shadow-lg backdrop-blur-sm">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
            />
            {config.label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------- Main export ---------- */

export function ExplodedSteamEngine({
  explode,
  highlightedPart = null,
}: ExplodedSteamEngineProps): ReactNode {
  const clamped = Math.max(0, Math.min(1, explode));
  return (
    <group position={[0, 0.1, 0]} scale={1}>
      {PARTS.map((p) => (
        <Part
          key={p.id}
          config={p}
          explode={clamped}
          highlightedPart={highlightedPart}
        />
      ))}
    </group>
  );
}
