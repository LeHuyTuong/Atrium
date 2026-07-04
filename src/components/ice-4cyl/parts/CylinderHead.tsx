"use client";

import * as THREE from "three";
import { makeCastAluminum, makeAluminum, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const DECK_H = ENGINE_GEOMETRY.deckHeight;

export interface CylinderHeadProps {
  crossSection: boolean;
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function CylinderHead({ crossSection, highlight, onSelect }: CylinderHeadProps) {
  const mat = highlight ? makeHighlight() : makeCastAluminum();
  const headH = 0.45;
  const headY = DECK_H + headH / 2 + 0.06;
  const halfLen = ((NUM - 1) * SPACING) / 2 + 0.5;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("head");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {crossSection ? (
        <mesh position={[0, headY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[halfLen, halfLen, headH, 40, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#7a8898" metalness={0.7} roughness={0.45} side={THREE.BackSide} />
        </mesh>
      ) : (
        <mesh position={[0, headY, 0]} castShadow receiveShadow>
          <boxGeometry args={[halfLen * 2 - 0.2, headH, halfLen * 2 - 0.2]} />
          <primitive object={mat} attach="material" />
        </mesh>
      )}
      {Array.from({ length: NUM }).map((_, i) => {
        const z = (i - (NUM - 1) / 2) * SPACING;
        return (
          <group key={`chamber-${i}`}>
            <mesh position={[0, headY - headH / 2, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[ENGINE_GEOMETRY.bore * 0.45, ENGINE_GEOMETRY.bore * 0.45, 0.08, 24]} />
              <meshStandardMaterial color="#2a2d31" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
