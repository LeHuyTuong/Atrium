"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ottoClock } from "../ottoClock";
import { getMaterial, castIronMaterial } from "./materials";
import { OttoPartProps } from "./types";

export function Flywheel({ highlight, dimmed, explodeOffset = 0 }: OttoPartProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mat = useMemo(() => {
    return getMaterial(highlight, castIronMaterial, dimmed);
  }, [highlight, dimmed]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = -ottoClock.crankAngle;
  });

  return (
    <group position={[-1.5 - explodeOffset * 2, -1.2, 0]}>
      <group ref={groupRef}>
        {/* Main rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <torusGeometry args={[1.8, 0.25, 32, 64]} />
          <primitive object={mat} attach="material" />
        </mesh>
        
        {/* Inner rim thickness */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[1.65, 1.65, 0.5, 64, 1, true]} />
          <primitive object={mat} attach="material" />
        </mesh>

        {/* Center Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.6, 32]} />
          <primitive object={mat} attach="material" />
        </mesh>

        {/* Axle pin */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <primitive object={mat} attach="material" />
        </mesh>

        {/* Spokes (6 spokes) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <mesh key={i} rotation={[angle, 0, 0]} position={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.08, 0.12, 3.4, 16]} />
              <primitive object={mat} attach="material" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
