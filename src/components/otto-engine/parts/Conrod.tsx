"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ottoClock } from "../ottoClock";
import { getMaterial, darkMetalMaterial } from "./materials";
import { OttoPartProps } from "./types";

export function Conrod({ highlight, dimmed, explodeOffset = 0 }: OttoPartProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mat = useMemo(() => {
    return getMaterial(highlight, darkMetalMaterial, dimmed);
  }, [highlight, dimmed]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Piston wrist pin is at Y = -1.2, Z = pistonZ.
    // CON_ROD_LENGTH = 2.0, CRANK_RADIUS = 0.6
    const zPos = 2.0 + 0.6 * ottoClock.pistonPos;
    
    // Pivot at piston pin
    groupRef.current.position.set(0, -1.2 + explodeOffset * 0.5, zPos);
    // Rotate around X axis (rod tilt)
    groupRef.current.rotation.x = -ottoClock.conrodAngle; 
  });

  return (
    <group ref={groupRef}>
      {/* The main rod body extending horizontally towards -Z (since crank is at Z=0) */}
      {/* Wait, the distance is 2.0. Center of rod is at Z = -1.0 */}
      <mesh position={[0, 0, -1.0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.15, 1.8]} />
        <primitive object={mat} attach="material" />
      </mesh>
      
      {/* Top ring (around piston pin at Z=0) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.28, 24]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Bottom ring (around crank pin at Z=-2.0) */}
      <mesh position={[0, 0, -2.0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.35, 32]} />
        <primitive object={mat} attach="material" />
      </mesh>
      
      {/* Big end bolts */}
      <mesh position={[0, 0.35, -2.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[0, -0.35, -2.0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </group>
  );
}
