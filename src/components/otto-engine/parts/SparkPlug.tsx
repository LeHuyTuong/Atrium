"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ottoClock } from "../ottoClock";
import { getMaterial, ceramicMaterial, brassMaterial } from "./materials";
import { OttoPartProps } from "./types";
import { useOttoStore } from "../useOttoStore";

export function SparkPlug({ highlight, dimmed, explodeOffset = 0 }: OttoPartProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const sparkMatRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const showFire = useOttoStore((s) => s.showFire);

  const matC = useMemo(() => getMaterial(highlight, ceramicMaterial, dimmed), [highlight, dimmed]);
  const matB = useMemo(() => getMaterial(highlight, brassMaterial, dimmed), [highlight, dimmed]);

  useFrame(() => {
    const flash = ottoClock.combustionFlash;
    if (lightRef.current) {
      lightRef.current.intensity = showFire ? flash * 15 : 0;
    }
    if (sparkMatRef.current) {
      sparkMatRef.current.emissiveIntensity = showFire ? flash * 5 : 0;
    }
  });

  return (
    // Positioned on the cylinder head (Z = 3.3)
    <group position={[0, 1.45 + explodeOffset, 3.3]}>
      {/* Ceramic body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
        <primitive object={matC} attach="material" />
      </mesh>

      {/* Metal hex nut and thread */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 6]} />
        <primitive object={matB} attach="material" />
      </mesh>

      {/* Spark gap (electrode) */}
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          ref={sparkMatRef}
          color="#a0c0ff" 
          emissive="#60a0ff" 
          emissiveIntensity={0} 
        />
      </mesh>

      {/* Combustion Light (Illuminates inside the glass cylinder!) */}
      <pointLight 
        ref={lightRef} 
        color="#ff8800" 
        distance={6} 
        decay={2} 
        intensity={0} 
        position={[0, -1.0, 0]} 
      />
    </group>
  );
}
