"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ottoClock } from "../ottoClock";
import { getMaterial, metalMaterial } from "./materials";
import { OttoPartProps } from "./types";

export function Crankshaft({ highlight, dimmed, explodeOffset = 0 }: OttoPartProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mat = useMemo(() => {
    return getMaterial(highlight, metalMaterial, dimmed);
  }, [highlight, dimmed]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Rotate around X axis (crankAngle)
    groupRef.current.rotation.x = ottoClock.crankAngle;
  });

  return (
    // Crank center at Y=0, Z=0 (we moved it from -1.2 to 0 to simplify)
    <group position={[0, -1.2, 0 + explodeOffset * 2]}>
      <group ref={groupRef}>
        {/* Main Shaft (along X axis) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
          <primitive object={mat} attach="material" />
        </mesh>
        
        {/* Crank Webs */}
        <mesh position={[0.4, 0, 0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.5, 0.9]} />
          <primitive object={mat} attach="material" />
        </mesh>
        <mesh position={[-0.4, 0, 0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.5, 0.9]} />
          <primitive object={mat} attach="material" />
        </mesh>

        {/* Crank Pin (where conrod attaches) - radius = 0.6 */}
        <mesh position={[0, 0, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.8, 24]} />
          <primitive object={mat} attach="material" />
        </mesh>

        {/* Counterweights */}
        <mesh position={[0.4, 0, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.7, 0.5]} />
          <primitive object={mat} attach="material" />
        </mesh>
        <mesh position={[-0.4, 0, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.7, 0.5]} />
          <primitive object={mat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
