"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import {
  makeCastIron,
  makePolishedBrass,
  makeSteel,
  makeBluedSteel,
  makeHighlight,
} from "./materials";
import { ENGINE_GEOMETRY } from "@/lib/kinematics";
import { engineClock } from "../engineClock";

const W = ENGINE_GEOMETRY.flywheelCenter; // [4.6, 2.1]
const RIM_R = 1.5;
const CRANK_R = ENGINE_GEOMETRY.crankRadius; // 0.72

export interface FlywheelProps {
  highlight: boolean;
  onSelect: (id: string) => void;
}

/** Large spoked flywheel + crank pin + crankshaft. Rotates about the Z axis
 *  through (4.6, 2.1). The crank pin is rigidly attached to the wheel face
 *  at radius CRANK_R and drives the connecting rod.
 *  Self-animates from engineClock.theta. */
export function FlywheelAssembly({ highlight, onSelect }: FlywheelProps) {
  const spinRef = useRef<Group>(null);
  useFrame(() => {
    if (spinRef.current) spinRef.current.rotation.z = engineClock.theta;
  });
  return (
    <group>
      {/* Crankshaft (fixed, along Z, behind the wheel) */}
      <mesh position={[W[0], W[1], -0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.4, 20]} />
        <primitive object={makeSteel()} attach="material" />
      </mesh>
      {/* Outboard bearing (toward viewer) */}
      <mesh position={[W[0], W[1], 0.55]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.25, 20]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
      <mesh position={[W[0], W[1], 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 20]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>

      {/* The rotating flywheel + crank assembly */}
      <group ref={spinRef} position={[W[0], W[1], 0]}>
        <FlywheelShape highlight={highlight} onSelect={onSelect} />
        {/* Crank web (a flat plate offsetting the pin from the shaft) */}
        <mesh position={[CRANK_R / 2, 0, 0.18]} castShadow>
          <boxGeometry args={[CRANK_R + 0.2, 0.25, 0.08]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
        <mesh position={[CRANK_R / 2, 0, -0.18]} castShadow>
          <boxGeometry args={[CRANK_R + 0.2, 0.25, 0.08]} />
          <primitive object={makeCastIron()} attach="material" />
        </mesh>
        {/* Crank pin (the pivot for the connecting rod big end) */}
        <mesh position={[CRANK_R, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 20]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
        <mesh
          position={[CRANK_R, 0, 0.27]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.13, 0.13, 0.05, 20]} />
          <primitive object={makePolishedBrass()} attach="material" />
        </mesh>
      </group>

      {/* Drive take-off pulley on the back of the shaft (for the governor belt) */}
      <mesh position={[W[0], W[1], -1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.14, 24]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      <mesh position={[W[0], W[1], -1.13]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 8, 24]} />
        <primitive object={makePolishedBrass()} attach="material" />
      </mesh>
    </group>
  );
}

function FlywheelShape({
  highlight,
  onSelect,
}: {
  highlight: boolean;
  onSelect: (id: string) => void;
}) {
  const mat = highlight ? makeHighlight() : makeCastIron();
  const spokeMat = makeBluedSteel();
  const brass = makePolishedBrass();

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("flywheel");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Outer rim (torus in the XY plane, axis = Z) */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[RIM_R, 0.1, 16, 64]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* Inner rim */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[RIM_R - 0.22, 0.06, 12, 64]} />
        <primitive object={mat} attach="material" />
      </mesh>

      {/* Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.4, 24]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.035, 10, 24]} />
        <primitive object={brass} attach="material" />
      </mesh>

      {/* Spokes (6) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const x = Math.cos(a) * (RIM_R - 0.15);
        const y = Math.sin(a) * (RIM_R - 0.15);
        return (
          <group key={`spoke-${i}`} rotation={[0, 0, a]}>
            <mesh position={[(RIM_R - 0.15) / 2, 0, 0]} castShadow>
              <boxGeometry args={[RIM_R - 0.2, 0.12, 0.08]} />
              <primitive object={spokeMat} attach="material" />
            </mesh>
            {/* Spoke bolts at rim */}
            <mesh position={[x, y, 0.08]}>
              <cylinderGeometry args={[0.025, 0.025, 0.04, 10]} />
              <primitive object={brass} attach="material" />
            </mesh>
            <mesh position={[x, y, -0.08]}>
              <cylinderGeometry args={[0.025, 0.025, 0.04, 10]} />
              <primitive object={brass} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Decorative rim bolts */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
        return (
          <mesh
            key={`rbolt-${i}`}
            position={[Math.cos(a) * RIM_R, Math.sin(a) * RIM_R, 0.06]}
          >
            <cylinderGeometry args={[0.022, 0.022, 0.04, 8]} />
            <primitive object={brass} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}
