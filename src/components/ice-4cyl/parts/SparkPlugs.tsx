"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { makeCeramic, makeSteel, makePolishedBrass, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";
import { engineClock } from "../engineClock";
import * as THREE from "three";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const DECK_H = ENGINE_GEOMETRY.deckHeight;
const CRANK_PHASES = [0, Math.PI, Math.PI, 0];

export interface SparkPlugsProps {
  showSpark: boolean;
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function SparkPlugs({ showSpark, highlight, onSelect }: SparkPlugsProps) {
  const sparkRef = useRef<Group>(null);

  useFrame(() => {
    if (!sparkRef.current) return;
    const state = engineClock.state;
    const children = sparkRef.current.children;
    for (let i = 0; i < NUM && i < children.length; i++) {
      const g = children[i] as Group;
      const firing = state?.sparkFiring?.[i] || false;
      if (g.children.length > 0) {
        const glow = g.children[g.children.length - 1] as THREE.Mesh;
        if (glow) {
          const targetVis = firing && showSpark ? 1 : 0;
          glow.scale.setScalar(1 + targetVis * 2);
        }
      }
    }
  });

  const mat = highlight ? makeHighlight() : makeCeramic();

  return (
    <group
      ref={sparkRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("spark-plugs");
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
          <group key={`plug-${i}`} position={[0, DECK_H + 0.5, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.04, 0.12, 10]} />
              <primitive object={mat} attach="material" />
            </mesh>
            <mesh position={[0, -0.08, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.025, 0.04, 8]} />
              <primitive object={makeSteel()} attach="material" />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.06, 8]} />
              <primitive object={makePolishedBrass()} attach="material" />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshBasicMaterial
                color="#00aaff"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
