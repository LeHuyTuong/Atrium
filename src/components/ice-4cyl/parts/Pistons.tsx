"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { makeAluminum, makePolishedBrass, makeSteel, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";
import { engineClock } from "../engineClock";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const BORE = ENGINE_GEOMETRY.bore;
const CRANK_PHASES = [0, Math.PI, Math.PI, 0];

export interface PistonsProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function Pistons({ highlight, onSelect }: PistonsProps) {
  const ref = useRef<Group>(null);
  const mat = highlight ? makeHighlight() : makeAluminum();

  useFrame(() => {
    if (!ref.current) return;
    const theta = engineClock.theta;
    const r = ENGINE_GEOMETRY.crankRadius;
    const l = ENGINE_GEOMETRY.rodLength;
    const children = ref.current.children;
    for (let i = 0; i < NUM && i < children.length; i++) {
      const g = children[i] as Group;
      const cylTheta = theta + CRANK_PHASES[i];
      const sinT = Math.sin(cylTheta);
      const cosT = Math.cos(cylTheta);
      const pistonPos = r * cosT + Math.sqrt(l * l - r * r * sinT * sinT);
      const maxPos = l + r;
      const pistonY = ENGINE_GEOMETRY.deckHeight - (maxPos - pistonPos) - 0.4;
      g.position.y = pistonY;
    }
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("pistons");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {Array.from({ length: NUM }).map((_, i) => {
        const z = (i - (NUM - 1) / 2) * SPACING;
        return (
          <group key={`piston-${i}`} position={[0, 0.8, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[BORE * 0.47, BORE * 0.47, 0.28, 24]} />
              <primitive object={mat} attach="material" />
            </mesh>
            {[-0.08, 0, 0.08].map((dy) => (
              <mesh key={`ring-${dy}`} position={[0, dy, 0]}>
                <torusGeometry args={[BORE * 0.48, 0.015, 8, 24]} />
                <primitive object={makePolishedBrass()} attach="material" />
              </mesh>
            ))}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
              <primitive object={makeSteel()} attach="material" />
            </mesh>
            <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 10]} />
              <primitive object={makeSteel()} attach="material" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
