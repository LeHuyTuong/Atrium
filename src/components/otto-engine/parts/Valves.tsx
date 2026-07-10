"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ottoClock } from "../ottoClock";
import { getMaterial, metalMaterial, darkMetalMaterial } from "./materials";
import { OttoPartProps } from "./types";

export function Valves({
  highlight,
  dimmed,
  explodeOffset = 0,
  type,
}: OttoPartProps & { type: "intake" | "exhaust" }) {
  const valveRef = useRef<THREE.Group>(null);

  const mat = useMemo(() => {
    return getMaterial(highlight, type === "intake" ? metalMaterial : darkMetalMaterial, dimmed);
  }, [highlight, dimmed, type]);

  useFrame(() => {
    if (!valveRef.current) return;
    // Valve moves down (negative Y) when opening
    const openAmount = type === "intake" ? ottoClock.intakeOpen : ottoClock.exhaustOpen;
    const yDrop = openAmount * 0.25; 
    
    // Position valves on top of the cylinder head (Z = 3.3)
    const xPos = type === "intake" ? -0.4 : 0.4;
    valveRef.current.position.set(xPos, 1.4 - yDrop + explodeOffset * 0.8, 3.3);
  });

  return (
    <group ref={valveRef}>
      {/* Valve stem */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 12]} />
        <primitive object={mat} attach="material" />
      </mesh>
      
      {/* Valve head */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.08, 24]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Valve spring (ribbed cylinder) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 16, 12]} />
        <meshStandardMaterial color="#666" metalness={0.7} roughness={0.6} wireframe />
      </mesh>
    </group>
  );
}
