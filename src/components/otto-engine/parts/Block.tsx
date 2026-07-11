"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getMaterial, castIronMaterial, glassMaterial, metalMaterial } from "./materials";
import { OttoPartProps } from "./types";

export function Block({ highlight, dimmed, explodeOffset = 0 }: OttoPartProps) {
  const ironMat = useMemo(() => getMaterial(highlight, castIronMaterial, dimmed), [highlight, dimmed]);
  const metalMat = useMemo(() => getMaterial(highlight, metalMaterial, dimmed), [highlight, dimmed]);
  const glassMat = useMemo(() => getMaterial(highlight, glassMaterial, dimmed), [highlight, dimmed]);

  return (
    <group position={[0, -explodeOffset, 0]}>
      {/* Heavy Base Pedestal */}
      <mesh position={[0, -1.8, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.4, 4.2]} />
        <primitive object={ironMat} attach="material" />
      </mesh>
      
      {/* Base chamfer/steps */}
      <mesh position={[0, -1.5, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.2, 3.8]} />
        <primitive object={ironMat} attach="material" />
      </mesh>

      {/* Crankcase Frame (holding the crankshaft) */}
      <mesh position={[0.6, -0.6, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.8, 1.2]} />
        <primitive object={ironMat} attach="material" />
      </mesh>
      <mesh position={[-0.6, -0.6, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.8, 1.2]} />
        <primitive object={ironMat} attach="material" />
      </mesh>
      {/* Crankcase back wall */}
      <mesh position={[0, -0.6, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.8, 0.4]} />
        <primitive object={ironMat} attach="material" />
      </mesh>

      {/* Cylinder Barrel Base */}
      <mesh position={[0, -0.2, 2.0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 2.8, 32]} />
        <primitive object={ironMat} attach="material" />
      </mesh>

      {/* Cylinder Cutaway (Glass) to see piston */}
      <mesh position={[0, 0.7, 2.0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.92, 0.92, 2.7, 32, 1, false, 0, Math.PI]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* Cylinder Head (Top cover where valves are) */}
      <mesh position={[0, 0.2, 3.5]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.4, 32]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      
      {/* Valve housing block on cylinder head */}
      <mesh position={[0, 1.2, 3.4]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <primitive object={ironMat} attach="material" />
      </mesh>
    </group>
  );
}
