"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { makeRubber, makeSteel, makeHighlight } from "../materials";
import { engineClock } from "../engineClock";

export interface TimingBeltProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function TimingBelt({ highlight, onSelect }: TimingBeltProps) {
  const beltRef = useRef<Group>(null);
  const mat = highlight ? makeHighlight() : makeRubber();

  useFrame(() => {
    if (beltRef.current) {
      beltRef.current.children.forEach((child, i) => {
        if (i > 0) child.rotation.x = engineClock.theta * 0.02;
      });
    }
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("timing-belt");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
      ref={beltRef}
    >
      <mesh position={[0.35, 2.2, 1.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 20]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>

      <mesh position={[0.35, 2.7, 1.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 20]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>

      <mesh position={[0.35, 2.45, 1.35]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.16, 0.55, 0.02]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[0.35, 2.45, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.16, 0.55, 0.02]} />
        <primitive object={mat} attach="material" />
      </mesh>

      <mesh position={[0.52, 2.45, 1.35]} rotation={[0, 0, 0.0]}>
        <boxGeometry args={[0.02, 0.5, 0.15]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh position={[0.18, 2.45, 1.35]} rotation={[0, 0, 0.0]}>
        <boxGeometry args={[0.02, 0.5, 0.15]} />
        <primitive object={mat} attach="material" />
      </mesh>
    </group>
  );
}
