"use client";

import * as THREE from "three";
import { makeCastIron, makeSteel, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const DECK_H = ENGINE_GEOMETRY.deckHeight;

export interface ExhaustManifoldProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function ExhaustManifold({ highlight, onSelect }: ExhaustManifoldProps) {
  const mat = highlight ? makeHighlight() : makeCastIron();
  const halfSpan = ((NUM - 1) * SPACING) / 2;

  return (
    <group
      position={[0.5, DECK_H - 0.2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("exhaust-manifold");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh position={[0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.15, halfSpan * 2 + 0.3]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {Array.from({ length: NUM }).map((_, i) => {
        const z = (i - (NUM - 1) / 2) * SPACING;
        return (
          <mesh key={`primary-${i}`} position={[0.15, -0.1, z]} rotation={[0, 0, 0.4]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 0.25, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
        );
      })}

      <mesh position={[0.5, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.12, 14]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
    </group>
  );
}
