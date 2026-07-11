"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ottoClock } from "../ottoClock";
import { useOttoStore } from "../useOttoStore";
import { getMaterial, metalMaterial } from "./materials";
import { OttoPartProps } from "./types";

export function Piston({ highlight, dimmed, explodeOffset = 0 }: OttoPartProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mat = useMemo(() => {
    return getMaterial(highlight, metalMaterial, dimmed);
  }, [highlight, dimmed]);

  useFrame(() => {
    if (!groupRef.current) return;
    // We want a horizontal engine along the Z axis.
    // Crank center is at Z = 0, Y = -1.2.
    // In ottoClock.ts, pistonDist is the distance from crank center.
    // Let's map pistonDist to the Z axis.
    // pistonPos goes from -1 (BDC) to +1 (TDC).
    
    // CON_ROD_LENGTH = 2.0, CRANK_RADIUS = 0.6
    const zPos = 2.0 + 0.6 * ottoClock.pistonPos;
    
    // Apply explode offset: move piston out along X or up along Y
    groupRef.current.position.set(0, -1.2 + explodeOffset * 1.5, zPos);
  });

  return (
    <group ref={groupRef}>
      {/* Piston Head (Horizontal, so rotated to face Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.88, 1.2, 32]} />
        <primitive object={mat} attach="material" />
      </mesh>
      
      {/* Piston Rings */}
      {[0.3, 0.45, 0.6].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.885, 0.02, 8, 32]} />
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
      
      {/* Wrist Pin (horizontal, along X axis) */}
      <mesh position={[0, 0, -0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.6, 16]} />
        <meshStandardMaterial color="#666" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
