"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { makeSteel, makePolishedBrass, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";
import { engineClock } from "../engineClock";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const DECK_H = ENGINE_GEOMETRY.deckHeight;
const CRANK_PHASES = [0, Math.PI, Math.PI, 0];

export interface ValvetrainProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function Valvetrain({ highlight, onSelect }: ValvetrainProps) {
  const ivRef = useRef<Group>(null);
  const evRef = useRef<Group>(null);
  const mat = highlight ? makeHighlight() : makeSteel();

  useFrame(() => {
    const state = engineClock.state;
    if (!state) return;
    if (ivRef.current && evRef.current) {
      for (let i = 0; i < NUM; i++) {
        const iv = ivRef.current.children[i] as Group;
        const ev = evRef.current.children[i] as Group;
        if (iv) {
          const lift = state.intakeValveLift[i] || 0;
          iv.position.y = -lift * 0.06;
        }
        if (ev) {
          const lift = state.exhaustValveLift[i] || 0;
          ev.position.y = -lift * 0.06;
        }
      }
    }
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("valvetrain");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <group ref={ivRef}>
        {Array.from({ length: NUM }).map((_, i) => {
          const z = (i - (NUM - 1) / 2) * SPACING;
          return (
            <group key={`iv-${i}`} position={[-0.15, DECK_H + 0.45, z]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.025, 0.04, 0.12, 10]} />
                <primitive object={mat} attach="material" />
              </mesh>
              <mesh position={[0, -0.08, 0]}>
                <torusGeometry args={[0.05, 0.015, 6, 12]} />
                <primitive object={makePolishedBrass()} attach="material" />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
                <primitive object={mat} attach="material" />
              </mesh>
            </group>
          );
        })}
      </group>

      <group ref={evRef}>
        {Array.from({ length: NUM }).map((_, i) => {
          const z = (i - (NUM - 1) / 2) * SPACING;
          return (
            <group key={`ev-${i}`} position={[0.15, DECK_H + 0.45, z]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.025, 0.04, 0.12, 10]} />
                <primitive object={mat} attach="material" />
              </mesh>
              <mesh position={[0, -0.08, 0]}>
                <torusGeometry args={[0.05, 0.015, 6, 12]} />
                <primitive object={makePolishedBrass()} attach="material" />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
                <primitive object={mat} attach="material" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
