"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeCastAluminum, makeHighlight, makeSteel } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const DECK_H = ENGINE_GEOMETRY.deckHeight;

export interface IntakeManifoldProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function IntakeManifold({ highlight, onSelect }: IntakeManifoldProps) {
  const mat = highlight ? makeHighlight() : makeCastAluminum();
  const halfSpan = ((NUM - 1) * SPACING) / 2;

  return (
    <group
      position={[-0.5, DECK_H - 0.2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("intake-manifold");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh position={[-0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.18, halfSpan * 2 + 0.3]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {Array.from({ length: NUM }).map((_, i) => {
        const z = (i - (NUM - 1) / 2) * SPACING;
        return (
          <mesh key={`runner-${i}`} position={[-0.15, -0.1, z]} rotation={[0, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.3, 12]} />
            <primitive object={mat} attach="material" />
          </mesh>
        );
      })}

      <mesh position={[-0.5, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.08, 16]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>

      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`bolt-${i}`} position={[-0.5, 0.35, (-1.5 + i) * 0.25]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 6]} />
          <primitive object={makeSteel()} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
