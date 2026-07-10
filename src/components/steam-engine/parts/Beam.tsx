"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import {
  makeCastIron,
  makePolishedBrass,
  makeSteel,
  makeHighlight,
} from "./materials";
import { engineClock } from "../engineClock";

const FULCRUM: [number, number, number] = [0, 4.2, 0];
const HALF_LEN = 2.4;

export interface BeamProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

/** Watt's rocking beam — ornate cast-iron girder pivoting on a central boss.
 *  Carries end bearings for the piston rod (left) and connecting rod (right),
 *  plus a simplified Watt parallel-motion linkage on the piston side.
 *  Self-animates from engineClock.alpha. */
export function Beam({ highlight, onSelect }: BeamProps) {
  const rockRef = useRef<Group>(null);
  useFrame(() => {
    if (rockRef.current) rockRef.current.rotation.z = engineClock.alpha;
  });
  return (
    <group>
      {/* Fulcrum pivot shaft (fixed, along Z) */}
      <mesh position={FULCRUM} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 1.6, 24]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
      {/* Pivot end caps */}
      {[-0.8, 0.8].map((z) => (
        <mesh
          key={`pc-${z}`}
          position={[FULCRUM[0], FULCRUM[1], z]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.2, 0.2, 0.06, 24]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}

      {/* The rocking beam group */}
      <group ref={rockRef} position={FULCRUM}>
        <BeamShape highlight={highlight} onSelect={onSelect} />
        {/* End bearings */}
        <EndBearing x={-HALF_LEN} />
        <EndBearing x={HALF_LEN} />
        {/* Parallel motion linkage on the left side */}
        <ParallelMotion />
      </group>
    </group>
  );
}

function BeamShape({
  highlight,
  onSelect,
}: {
  highlight: boolean;
  onSelect: (id: string) => void;
}) {
  const mat = highlight ? makeHighlight() : makeCastIron();
  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("beam");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Central boss (thick around pivot) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.55, 0.6]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.7, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Main girder — tapered: thicker in middle, thinner at ends.
          Built from 3 segments for a tapered silhouette. */}
      <mesh position={[-HALF_LEN / 2 - 0.45, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[HALF_LEN - 0.45, 0.32, 0.36]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[HALF_LEN / 2 + 0.45, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[HALF_LEN - 0.45, 0.32, 0.36]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* Tapered tips */}
      <mesh position={[-HALF_LEN + 0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.3]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[HALF_LEN - 0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.3]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Top & bottom flanges (thicker rails) */}
      {[-HALF_LEN / 2, HALF_LEN / 2].map((cx, i) => (
        <group key={`flange-${i}`}>
          <mesh position={[cx, 0.2, 0]} castShadow>
            <boxGeometry args={[HALF_LEN, 0.08, 0.42]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <mesh position={[cx, -0.2, 0]} castShadow>
            <boxGeometry args={[HALF_LEN, 0.08, 0.42]} />
            <primitive object={mat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Decorative open-work trusses (diagonal struts) */}
      {[-1.7, -1.0, -0.3, 0.3, 1.0, 1.7].map((x, i) => (
        <mesh key={`truss-${i}`} position={[x, 0, 0]} rotation={[0, 0, i % 2 ? 0.5 : -0.5]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.2]} />
          <primitive object={mat} attach="material" />
        </mesh>
      ))}

      {/* Name cast into the beam */}
      <mesh position={[0, 0, 0.31]}>
        <boxGeometry args={[0.5, 0.12, 0.02]} />
        <meshStandardMaterial color="#c9922a" metalness={1} roughness={0.35} />
      </mesh>

      {/* Center pivot bushing */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.34, 0.04, 12, 32]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
    </group>
  );
}

function EndBearing({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.4, 0.5]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 20]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
      {/* Cotter pin */}
      <mesh position={[0, 0, 0.32]}>
        <boxGeometry args={[0.04, 0.18, 0.06]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
    </group>
  );
}

/** Simplified Watt parallel-motion linkage (decorative + educational).
 *  Two links from the beam and a fixed anchor form a 3-bar linkage whose
 *  midpoint traces a near-straight vertical line — Watt's "greatest invention". */
function ParallelMotion() {
  // Anchored at a fixed point relative to the beam group: at (-2.4, -1.8) from pivot.
  // (This anchor is itself attached to the beam here for simplicity; in reality
  //  one anchor is on the beam, one on the frame. We show the characteristic shape.)
  return (
    <group position={[-HALF_LEN + 0.1, -0.25, 0.25]}>
      {/* Upper link (from beam end downward) */}
      <mesh position={[-0.15, -0.45, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.05, 1.0, 0.06]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      {/* Lower link to fixed anchor */}
      <mesh position={[-0.7, -1.4, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.05, 1.2, 0.06]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      {/* Coupling bar */}
      <mesh position={[-0.4, -1.0, 0]} rotation={[0, 0, 1.2]} castShadow>
        <boxGeometry args={[0.05, 0.8, 0.06]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      {/* Joints */}
      {[
        [-0.15, -0.9],
        [-0.7, -1.9],
        [-0.4, -1.0],
      ].map((p, i) => (
        <mesh key={`joint-${i}`} position={[p[0], p[1], 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// Re-export for use elsewhere
export { FULCRUM as BEAM_FULCRUM, HALF_LEN as BEAM_HALF_LEN };
