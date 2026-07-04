"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Material } from "three";
import { makeSteel, makeBluedSteel, makePolishedBrass, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";
import { engineClock } from "../engineClock";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const R = ENGINE_GEOMETRY.crankRadius;
const CRANK_PHASES = [0, Math.PI, Math.PI, 0];

export interface CrankshaftProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function Crankshaft({ highlight, onSelect }: CrankshaftProps) {
  const ref = useRef<Group>(null);
  const mat = highlight ? makeHighlight() : makeBluedSteel();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z = engineClock.theta;
    }
  });

  const halfSpan = ((NUM - 1) * SPACING) / 2;

  return (
    <group
      ref={ref}
      position={[0, 0.4, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("crankshaft");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -halfSpan - 0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2 * halfSpan + 0.6, 16]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>

      {Array.from({ length: NUM }).map((_, i) => {
        const z = (i - (NUM - 1) / 2) * SPACING;
        const phase = CRANK_PHASES[i];
        return <CrankThrow key={`throw-${i}`} z={z} phase={phase} mat={mat} />;
      })}

      {[-halfSpan - 0.15, halfSpan + 0.15].map((z, i) => (
        <mesh key={`journal-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}

      <mesh position={[R + 0.1, 0, halfSpan + 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 20]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
    </group>
  );
}

function CrankThrow({
  z,
  phase,
  mat,
}: {
  z: number;
  phase: number;
  mat: Material;
}) {
  const cx = R * Math.cos(phase);
  const cy = R * Math.sin(phase);
  return (
    <group>
      <mesh position={[cx / 2, cy / 2, z - 0.08]} castShadow>
        <boxGeometry args={[R + 0.1, 0.15, 0.08]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[cx / 2, cy / 2, z + 0.08]} castShadow>
        <boxGeometry args={[R + 0.1, 0.15, 0.08]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[cx * 0.5, cy * 0.5, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.16, 12]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      <mesh position={[cx, cy, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
    </group>
  );
}
