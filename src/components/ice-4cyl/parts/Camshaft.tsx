"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { makeSteel, makeBluedSteel, makePolishedBrass, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";
import { engineClock } from "../engineClock";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const DECK_H = ENGINE_GEOMETRY.deckHeight;

export interface CamshaftProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function Camshaft({ highlight, onSelect }: CamshaftProps) {
  const ref = useRef<Group>(null);
  const mat = highlight ? makeHighlight() : makeBluedSteel();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z = engineClock.theta / 2;
    }
  });

  const halfSpan = ((NUM - 1) * SPACING) / 2;

  return (
    <group
      ref={ref}
      position={[0.35, DECK_H + 0.35, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("camshaft");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -halfSpan - 0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2 * halfSpan + 0.4, 12]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>

      {Array.from({ length: NUM * 2 }).map((_, i) => {
        const cylIdx = Math.floor(i / 2);
        const isIntake = i % 2 === 0;
        const z = (cylIdx - (NUM - 1) / 2) * SPACING;
        const lobeAngle = (i / (NUM * 2)) * Math.PI * 2;
        return (
          <group key={`lobe-${i}`} rotation={[0, 0, lobeAngle]}>
            <mesh position={[0.035, 0, z]} castShadow>
              <boxGeometry args={[0.08, 0.06, 0.03]} />
              <primitive object={mat} attach="material" />
            </mesh>
            <mesh position={[0.06, 0, z]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <primitive object={makePolishedBrass()} attach="material" />
            </mesh>
          </group>
        );
      })}

      {[-halfSpan - 0.1, halfSpan + 0.1].map((z, i) => (
        <mesh key={`cam-journal-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
