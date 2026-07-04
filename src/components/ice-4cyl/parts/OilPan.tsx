"use client";

import { makeSteel, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;

export interface OilPanProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function OilPan({ highlight, onSelect }: OilPanProps) {
  const mat = highlight ? makeHighlight() : makeSteel();
  const halfLen = ((NUM - 1) * SPACING) / 2 + 0.4;

  return (
    <group
      position={[0, -0.05, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("oil-pan");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[halfLen * 2 - 0.3, 0.2, halfLen * 2 - 0.3]} />
        <primitive object={mat} attach="material" />
      </mesh>

      <mesh position={[0, -0.08, 0]} castShadow>
        <boxGeometry args={[halfLen * 2 - 0.2, 0.06, halfLen * 2 - 0.2]} />
        <primitive object={mat} attach="material" />
      </mesh>

      <mesh position={[halfLen - 0.3, -0.18, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
        <meshStandardMaterial color="#c9922a" metalness={1} roughness={0.28} />
      </mesh>
    </group>
  );
}
